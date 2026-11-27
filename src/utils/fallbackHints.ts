import type { CoachFeedback, HintLevel, HyoTopic, SupportLevel } from '../types/hyo.ts';
import { HYO_TOPICS_100 } from './hyoTopics100.ts';

export const HYO_TOPICS: HyoTopic[] = HYO_TOPICS_100;

export const LEVEL_SUPPORT_COPY: Record<
  SupportLevel,
  {
    label: string;
    koreanLabel: string;
    shortDesc: string;
    koreanDesc: string;
    englishDesc: string;
    promptTitle: string;
    promptBody: string;
    frames?: string[];
    starterTemplate?: string;
    keywords?: string[];
  }
> = {
  1: {
    label: 'Level 1',
    koreanLabel: '문장 단위 도움',
    shortDesc: 'Sentence frames',
    englishDesc: 'Fill in helpful sentence starters step by step.',
    koreanDesc: '문장 틀의 빈칸을 채우며 영어로 쉽게 시작해요.',
    promptTitle: 'Use these sentence frames to build your story:',
    promptBody: 'Fill in the blanks with your own family story. Aim for about 5 short sentences.',
    frames: [
      'I show care for my family by ___.',
      'I do this when ___.',
      'I help my ___ by ___.',
      'It helps because ___.',
      'I feel ___ when we share this moment.',
    ],
    starterTemplate:
      'I show care for my family by ___.\nI do this when ___.\nI also ___.\nIt helps because ___.\nI feel ___ when we are together.',
  },
  2: {
    label: 'Level 2',
    koreanLabel: '키워드 도움',
    shortDesc: 'Keyword prompts',
    englishDesc: 'Use key word prompts to write your own sentences.',
    koreanDesc: '핵심 키워드 힌트를 보고 스스로 문장을 연결해요.',
    promptTitle: 'Use these keywords as your guide:',
    promptBody: 'Write about 5 sentences using connectors like and, because, and so.',
    keywords: ['person', 'action', 'time', 'reason or feeling', 'and / because / so'],
  },
  3: {
    label: 'Level 3',
    koreanLabel: '자유롭게 쓰기',
    shortDesc: 'Free writing',
    englishDesc: 'Write freely with only the topic prompt.',
    koreanDesc: '도움 틀 없이 주제만 보고 내 생각대로 자유롭게 써요.',
    promptTitle: 'Free writing',
    promptBody:
      'Write about 5 sentences in your own words. Connect your ideas clearly with and, because, or so.',
  },
};

function findFirstMatch(draft: string, patterns: RegExp[]): string | null {
  for (const regex of patterns) {
    const match = draft.match(regex);
    if (match && match[0]) {
      return match[0].trim();
    }
  }
  return null;
}

export function buildFallbackHint(draft: string, hintLevel: HintLevel): CoachFeedback {
  const sentences = draft
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (sentences.length < 3 || draft.trim().split(/\s+/).length < 18) {
    const target = sentences[sentences.length - 1] || draft.trim().slice(0, 40);
    return {
      praise: 'You started sharing your family story clearly.',
      fix: 'Look at the end of your paragraph.',
      question:
        hintLevel === 1
          ? 'Can you add one sentence about why or how you felt?'
          : hintLevel === 2
            ? 'How did your family feel, and why was it helpful?'
            : 'Look at this pattern. Can you add a feeling sentence too?',
      highlightedPhrase: target,
      hintLevel,
      patternExample:
        hintLevel === 3 ? 'Pattern example: "She smiled, so I felt very proud."' : undefined,
      koreanHelp:
        '좋은 시작이에요! 글의 마지막 부분에 그 행동이 가족에게 어떤 도움이 되었는지, 또는 나의 기분이 어땠는지 한 문장을 더 써 보세요. ("because"나 "so"를 써 보면 좋아요.)',
      isFallback: true,
      fallbackNotice: 'Hyo-Co is using an offline study hint right now. Your writing is safe.',
    };
  }

  const byVerbMatch = findFirstMatch(draft, [
    /\bby\s+(help|clean|cook|wash|listen|talk|carry|make|give)\b/i,
  ]);
  if (byVerbMatch) {
    return {
      praise: 'You gave clear examples of caring for your family.',
      fix: 'Look closely at the words after "by".',
      question:
        hintLevel === 1
          ? 'After "by", what ending does the action word take?'
          : hintLevel === 2
            ? 'Does the verb after "by" need "-ing"?'
            : 'Check the "-ing" pattern below. How can you change yours?',
      highlightedPhrase: byVerbMatch,
      hintLevel,
      patternExample:
        hintLevel === 3 ? 'Pattern example: "She shows care by listening."' : undefined,
      koreanHelp:
        '"by" 뒤에는 동작을 나타내는 말에 "-ing" 형태(~함으로써)가 와야 자연스러워요. 예: by + 동사원형 + ing',
      isFallback: true,
      fallbackNotice: 'Hyo-Co is using an offline study hint right now. Your writing is safe.',
    };
  }

  const pastMatch = findFirstMatch(draft, [
    /\b(yesterday|last\s+\w+|ago)[^.!?]{0,40}\b(help|clean|cook|wash|walk|talk|go|eat|make|give|carry)\b/i,
  ]);
  if (pastMatch) {
    return {
      praise: 'You shared a real moment with your family.',
      fix: 'Look at the action word in your past-time sentence.',
      question:
        hintLevel === 1
          ? 'Did this happen in the past? Which verb form shows past?'
          : hintLevel === 2
            ? 'Check your time word. Should the verb use a past form?'
            : 'Look at the past-tense pattern below. Can you check your verb?',
      highlightedPhrase: pastMatch,
      hintLevel,
      patternExample:
        hintLevel === 3 ? 'Pattern example: "Yesterday, I cooked warm soup for my dad."' : undefined,
      koreanHelp:
        '"yesterday"나 "last weekend"처럼 과거를 나타내는 말이 있을 때는 동사도 과거형으로 맞추어 주어야 해요.',
      isFallback: true,
      fallbackNotice: 'Hyo-Co is using an offline study hint right now. Your writing is safe.',
    };
  }

  const missingBeMatch = findFirstMatch(draft, [
    /\b(my\s+\w+|she|he|they|we|i)\s+(happy|proud|tired|glad|sad|good|kind)\b/i,
  ]);
  if (missingBeMatch) {
    return {
      praise: 'You described feelings clearly in your story.',
      fix: 'Look at the words before the feeling word.',
      question:
        hintLevel === 1
          ? 'What linking word (am, is, are, was) connects them?'
          : hintLevel === 2
            ? 'Can you add a "be" verb before the feeling word?'
            : 'See the pattern below. Which "be" verb fits your sentence?',
      highlightedPhrase: missingBeMatch,
      hintLevel,
      patternExample:
        hintLevel === 3 ? 'Pattern example: "My grandfather was very glad."' : undefined,
      koreanHelp:
        '"happy"나 "proud" 같은 감정 단어 앞에는 주어에 맞는 be동사(am, is, are, was, were)가 필요해요.',
      isFallback: true,
      fallbackNotice: 'Hyo-Co is using an offline study hint right now. Your writing is safe.',
    };
  }

  const hasConnector = /\b(because|so|and|but|when)\b/i.test(draft);
  const firstSentence = sentences[0] || draft.trim();
  if (!hasConnector) {
    return {
      praise: 'Your sentences are easy to read and warm.',
      fix: 'Look at how your sentences connect together.',
      question:
        hintLevel === 1
          ? 'Can you connect two ideas with "because" or "so"?'
          : hintLevel === 2
            ? 'Why did you do this, or what happened next?'
            : 'Look at how "because" connects ideas below. Can you try it?',
      highlightedPhrase: firstSentence,
      hintLevel,
      patternExample:
        hintLevel === 3
          ? 'Pattern example: "I cleaned the room because my aunt visited."'
          : undefined,
      koreanHelp:
        '"because"(왜냐하면)나 "so"(그래서) 같은 연결어를 쓰면 문장이 훨씬 자연스럽게 이어져요.',
      isFallback: true,
      fallbackNotice: 'Hyo-Co is using an offline study hint right now. Your writing is safe.',
    };
  }

  const targetSentence = sentences[Math.min(1, sentences.length - 1)] || firstSentence;
  return {
    praise: 'You connected your ideas nicely with clear examples.',
    fix: 'Look closely at this sentence for one small detail.',
    question:
      hintLevel === 1
        ? 'Can you check the verb form or add one more detail?'
        : hintLevel === 2
          ? 'Check the time of the story and the verb ending. Does it match?'
          : 'Look at this example sentence. How can you make yours clearer?',
    highlightedPhrase: targetSentence,
    hintLevel,
    patternExample:
      hintLevel === 3 ? 'Pattern example: "We talked together, and everyone smiled."' : undefined,
    koreanHelp:
      '문장을 잘 연결했어요! 강조된 문장에서 시제(현재/과거)나 단어의 끝모양, 또는 구체적인 이유를 한 번 더 살펴보세요.',
    isFallback: true,
    fallbackNotice: 'Hyo-Co is using an offline study hint right now. Your writing is safe.',
  };
}
