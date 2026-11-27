import { GoogleGenAI, Type } from '@google/genai';
import 'dotenv/config';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { checkPrivacy } from './src/utils/privacyCheck.ts';
import type { HintLevel, SupportLevel, WritingRecord } from './src/types/hyo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const TEACHER_EMAIL = (process.env.TEACHER_EMAIL || 'junhy112233@gmail.com').trim().toLowerCase();
const DATA_DIR = path.resolve(__dirname, 'data');
const RECORDS_FILE = path.join(DATA_DIR, 'records.json');

function ensureRecordsFile(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(RECORDS_FILE)) {
    fs.writeFileSync(RECORDS_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

function readRecords(): WritingRecord[] {
  ensureRecordsFile();
  try {
    const raw = fs.readFileSync(RECORDS_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeRecords(records: WritingRecord[]): void {
  ensureRecordsFile();
  fs.writeFileSync(RECORDS_FILE, JSON.stringify(records, null, 2), 'utf8');
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function sanitizeCoachText(text: string): string {
  return text
    .replace(/\bwrong\b/gi, 'needs a closer look')
    .replace(/\bmistakes?\b/gi, 'points to check')
    .replace(/\bbad\b/gi, 'unclear')
    .trim();
}

function findSafeHighlight(draft: string, candidate?: string): string {
  const cleanCandidate = (candidate || '').trim();
  if (cleanCandidate && draft.includes(cleanCandidate)) {
    return cleanCandidate;
  }
  const sentences = draft
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return sentences[0] || draft.trim().slice(0, 60);
}

const app = express();
app.use(express.json({ limit: '1mb' }));

// Session role check endpoint
app.post('/api/session', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const name = String(req.body?.name || '').trim();
  if (!email || !name) {
    res.status(400).json({ error: 'Name and email are required.' });
    return;
  }
  const isTeacher = email === TEACHER_EMAIL;
  res.json({
    name,
    email,
    isTeacher,
  });
});

// Step 2 Korean scaffolding help (no full English sentences given)
app.post('/api/coach/korean-draft-help', async (req, res) => {
  const { draft = '', plan = {}, supportLevel = 2, topicTitle = '' } = req.body ?? {};
  const privacy = checkPrivacy(`${draft} ${JSON.stringify(plan)}`);
  if (privacy.hasPersonalInfo) {
    res.status(400).json({ privacyBlocked: true, message: privacy.message });
    return;
  }

  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({
      error: 'Gemini API key is not configured.',
      fallbackKorean:
        '계획한 4가지 내용(누구에게, 무엇을, 언제, 어떤 기분이었는지)을 짧은 영어 문장으로 이어 써 보세요. 문장을 연결할 때는 and, because, so를 사용하면 좋아요. (예시 문장은 마지막 단계에서 볼 수 있어요.)',
    });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Topic: "${topicTitle}"
Student support level: Level ${supportLevel}
Student plan notes: Who=${plan.who || ''}, What=${plan.what || ''}, When=${plan.when || ''}, Feeling=${plan.feeling || ''}
Current draft so far: "${draft}"

Give 2-3 short, warm sentences in easy Korean for a 13-year-old Korean middle school student (CEFR A2) explaining how to organize or continue their paragraph.
STRICT RULES:
- Do NOT write any complete corrected English sentence for them.
- Do NOT mention "wrong", "mistake", "bad", or scores.
- You may mention 1-2 single connector words like "because" or "so".
- Do not assume all families look the same.`,
      config: {
        systemInstruction:
          'You are Hyo-Co, a warm writing coach helping a Korean middle schooler in Korean without writing English sentences for them.',
      },
    });
    res.json({ koreanHelp: (response.text || '').trim() });
  } catch (err) {
    console.error('Gemini korean-draft-help error:', err);
    res.status(502).json({
      error: 'AI coach could not respond right now.',
      fallbackKorean:
        '계획표에 적은 단어를 바탕으로 5문장 정도를 천천히 써 보세요. 과거에 한 일이라면 동사의 과거형을, 이유를 쓸 때는 because를 활용해 보세요.',
    });
  }
});

// Step 3 Hint Coach (Praise -> Fix -> Question + Hint Ladder 1/2/3 + Korean help)
app.post('/api/coach/hint', async (req, res) => {
  const {
    draft = '',
    hintLevel = 1,
    supportLevel = 2,
    topicTitle = 'How can you show care and respect for your family?',
    previousHighlighted = '',
  } = req.body ?? {};

  const trimmedDraft = String(draft).trim();
  if (!trimmedDraft) {
    res.status(400).json({ error: 'Please write a short draft first.' });
    return;
  }

  // Server-side Privacy Gate: NEVER send personal info to AI
  const privacy = checkPrivacy(trimmedDraft);
  if (privacy.hasPersonalInfo) {
    res.status(400).json({
      privacyBlocked: true,
      message: privacy.message,
      reasons: privacy.reasons,
    });
    return;
  }

  const normalizedHintLevel: HintLevel = hintLevel === 3 ? 3 : hintLevel === 2 ? 2 : 1;
  const ai = getGeminiClient();
  if (!ai) {
    res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
    return;
  }

  const ladderInstructions =
    normalizedHintLevel === 1
      ? 'Hint Level 1: Highlight the single most important phrase or sentence to check (priority: meaning -> missing parts -> grammar -> spelling). Give 1 specific praise, 1 gentle fix focus pointing to that place, and 1 short guiding question.'
      : normalizedHintLevel === 2
        ? `Hint Level 2: Stay on the same issue ("${previousHighlighted || 'the most important part'}"). Describe what kind of language issue it is using a simple guiding question so the student can notice the gap themselves.`
        : `Hint Level 3: Stay on the same issue ("${previousHighlighted || 'the most important part'}"). Provide patternExample: ONE short example sentence showing the SAME language pattern on a DIFFERENT situation/person (never using the student's exact words or rewriting their sentence!).`;

  const systemInstruction = `You are Hyo-Co, a friendly English writing coach for Korean Grade 1 middle school students (CEFR A2, age 13), not a teacher or a judge.
The topic is HYO, meaning care and respect for family.
CRITICAL RULES:
1. NEVER rewrite the student's text and NEVER show a corrected version of the student's sentence.
2. Give ONLY ONE fix point (the most important one: meaning > missing parts > grammar > spelling).
3. Use warm, encouraging, easy English (CEFR A2), strictly under 12 words per sentence, at most one emoji total.
4. NEVER use the words "wrong", "bad", "mistake", or give numeric scores/grades.
5. If you are unsure about something, start with "I think..." and suggest checking a dictionary or textbook.
6. Do not judge the student's family or assume every family has the same structure.
7. End the feedback with the single question.
8. "highlightedPhrase" MUST be an exact substring copied verbatim from the student's draft.
9. "koreanHelp" must explain the hint in friendly Korean for a 13-year-old WITHOUT giving the corrected English sentence.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Topic: "${topicTitle}"
Student support level: Level ${supportLevel}
${ladderInstructions}

Student draft:
"""
${trimmedDraft}
"""`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            praise: {
              type: Type.STRING,
              description: 'One specific praise in easy A2 English, under 12 words.',
            },
            fix: {
              type: Type.STRING,
              description:
                'One focus point in easy A2 English, under 12 words. Never show a corrected sentence. Never say wrong, bad, or mistake.',
            },
            question: {
              type: Type.STRING,
              description:
                'One guiding question ending with a question mark, under 12 words. Never reveal the corrected answer.',
            },
            highlightedPhrase: {
              type: Type.STRING,
              description:
                'An exact verbatim substring from the student draft that relates to the fix point.',
            },
            patternExample: {
              type: Type.STRING,
              description:
                'Only for Hint Level 3: one short example sentence with a DIFFERENT subject/context showing the same pattern (e.g., "She shows care by listening."). Empty string for Hint Level 1 or 2.',
            },
            koreanHelp: {
              type: Type.STRING,
              description:
                'Friendly Korean explanation of the hint without giving a corrected English sentence.',
            },
          },
          required: ['praise', 'fix', 'question', 'highlightedPhrase', 'koreanHelp'],
        },
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    const safeHighlight = findSafeHighlight(trimmedDraft, parsed.highlightedPhrase);

    res.json({
      praise: sanitizeCoachText(parsed.praise || 'You shared a warm family story.'),
      fix: sanitizeCoachText(parsed.fix || 'Look closely at the highlighted part.'),
      question: sanitizeCoachText(parsed.question || 'What small change can make this clearer?'),
      highlightedPhrase: safeHighlight,
      hintLevel: normalizedHintLevel,
      patternExample:
        normalizedHintLevel === 3 && parsed.patternExample
          ? sanitizeCoachText(String(parsed.patternExample))
          : undefined,
      koreanHelp:
        String(parsed.koreanHelp || '').trim() ||
        '강조된 부분을 천천히 다시 읽고, 시제나 단어 형태를 살펴보세요.',
      isFallback: false,
    });
  } catch (err) {
    console.error('Gemini hint error:', err);
    res.status(502).json({ error: 'Hyo-Co could not connect right now.' });
  }
});

// Step 4 -> Step 5 Rewrite Check & Adaptive Leveling
app.post('/api/coach/check-rewrite', async (req, res) => {
  const {
    firstDraft = '',
    rewrittenDraft = '',
    highlightedPhrase = '',
    fixNote = '',
    supportLevel = 2,
    maxHintLevel = 1,
  } = req.body ?? {};

  const trimmedRewrite = String(rewrittenDraft).trim();
  const privacy = checkPrivacy(trimmedRewrite);
  if (privacy.hasPersonalInfo) {
    res.status(400).json({ privacyBlocked: true, message: privacy.message });
    return;
  }

  const currentLevel: SupportLevel = supportLevel === 3 ? 3 : supportLevel === 1 ? 1 : 2;
  const changedHighlight =
    Boolean(highlightedPhrase) && !trimmedRewrite.includes(highlightedPhrase.trim());
  const textChanged = trimmedRewrite !== String(firstDraft).trim();

  // Deterministic adaptive rule fallback
  const fallbackResult = () => {
    const fixed = textChanged && (changedHighlight || trimmedRewrite.length >= firstDraft.trim().length);
    if (fixed && maxHintLevel === 1) {
      const nextLevel: SupportLevel = currentLevel === 1 ? 2 : 3;
      return {
        fixed: true,
        recommendedNextLevel: nextLevel,
        levelChange: nextLevel > currentLevel ? ('up' as const) : ('same' as const),
        encouragement:
          nextLevel > currentLevel
            ? `Nice revision on your first try! Next writing moves to Level ${nextLevel}.`
            : 'Nice revision on your first try! You are writing strongly at Level 3.',
      };
    }
    if (!fixed && maxHintLevel >= 3) {
      const nextLevel: SupportLevel = currentLevel === 3 ? 2 : 1;
      return {
        fixed: false,
        recommendedNextLevel: nextLevel,
        levelChange: nextLevel < currentLevel ? ('down' as const) : ('same' as const),
        encouragement:
          nextLevel < currentLevel
            ? `Let us practice with extra support at Level ${nextLevel} next time.`
            : 'Good effort! Keep practicing with Level 1 frames next time.',
      };
    }
    return {
      fixed,
      recommendedNextLevel: currentLevel,
      levelChange: 'same' as const,
      encouragement: `Great effort rewriting! You will stay at Level ${currentLevel} next time.`,
    };
  };

  const ai = getGeminiClient();
  if (!ai) {
    res.json(fallbackResult());
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Compare the student's first draft and rewrite for a CEFR A2 middle school student.
Highlighted issue from earlier: "${highlightedPhrase}"
Focus note given earlier: "${fixNote}"
First draft: "${firstDraft}"
Student rewrite: "${trimmedRewrite}"

Did the student meaningfully improve or address the highlighted point? Return JSON.`,
      config: {
        systemInstruction:
          'Evaluate gently if the student improved the highlighted point. Never output a corrected sentence, never say wrong/bad/mistake, and keep encouragement under 14 words.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fixed: { type: Type.BOOLEAN },
            encouragement: { type: Type.STRING },
          },
          required: ['fixed', 'encouragement'],
        },
      },
    });
    const parsed = JSON.parse((response.text || '{}').trim());
    const fixed = Boolean(parsed.fixed) && textChanged;

    let nextLevel: SupportLevel = currentLevel;
    let levelChange: 'up' | 'same' | 'down' = 'same';
    if (fixed && maxHintLevel === 1) {
      nextLevel = currentLevel === 1 ? 2 : 3;
      levelChange = nextLevel > currentLevel ? 'up' : 'same';
    } else if (!fixed && maxHintLevel >= 3) {
      nextLevel = currentLevel === 3 ? 2 : 1;
      levelChange = nextLevel < currentLevel ? 'down' : 'same';
    }

    res.json({
      fixed,
      recommendedNextLevel: nextLevel,
      levelChange,
      encouragement: sanitizeCoachText(
        parsed.encouragement || fallbackResult().encouragement
      ),
    });
  } catch (err) {
    console.error('Gemini check-rewrite error:', err);
    res.json(fallbackResult());
  }
});

// Records API (scoped by role: student sees own records; teacher email sees all read-only)
app.get('/api/records', (req, res) => {
  const email = String(req.query.email || '').trim().toLowerCase();
  const scope = String(req.query.scope || 'mine');
  if (!email) {
    res.json({ records: [] });
    return;
  }

  const allRecords = readRecords();
  if (scope === 'all') {
    if (email !== TEACHER_EMAIL) {
      res.status(403).json({ error: 'Only the teacher account can view all records.' });
      return;
    }
    res.json({ records: allRecords });
    return;
  }

  const mine = allRecords.filter((r) => r.studentEmail.toLowerCase() === email);
  res.json({ records: mine });
});

app.post('/api/records', (req, res) => {
  const body = req.body ?? {};
  const studentEmail = String(body.studentEmail || '').trim().toLowerCase();
  const studentName = String(body.studentName || '').trim();
  const firstDraft = String(body.firstDraft || '').trim();
  const finalText = String(body.finalText || '').trim();

  if (!studentEmail || !studentName || !firstDraft || !finalText) {
    res.status(400).json({ error: 'Missing required fields for saving record.' });
    return;
  }

  const record: WritingRecord = {
    id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    studentName,
    studentEmail,
    date: new Date().toISOString(),
    topicId: String(body.topicId || 'hyo-core'),
    topicTitle: String(body.topicTitle || 'How can you show care and respect for your family?'),
    supportLevel: body.supportLevel === 1 ? 1 : body.supportLevel === 3 ? 3 : 2,
    nextRecommendedLevel:
      body.nextRecommendedLevel === 1 ? 1 : body.nextRecommendedLevel === 3 ? 3 : 2,
    hintsUsed: Number(body.hintsUsed || 1),
    maxHintLevel: body.maxHintLevel === 3 ? 3 : body.maxHintLevel === 2 ? 2 : 1,
    firstDraft,
    finalText,
    whatIChanged: String(body.whatIChanged || '').trim(),
  };

  const existing = readRecords();
  existing.unshift(record);
  writeRecords(existing);

  res.status(201).json({ record });
});

async function startServer(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HYO Steps server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
