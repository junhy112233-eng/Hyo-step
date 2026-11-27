/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { DraftStep } from './components/DraftStep.tsx';
import { FinishStep } from './components/FinishStep.tsx';
import { HintStep } from './components/HintStep.tsx';
import { OnboardingPopup, type PopupStage } from './components/OnboardingPopup.tsx';
import { PlanStep } from './components/PlanStep.tsx';
import { RecordsView } from './components/RecordsView.tsx';
import { RewriteStep } from './components/RewriteStep.tsx';
import { SignInModal } from './components/SignInModal.tsx';
import { StartScreen } from './components/StartScreen.tsx';
import { TopBar } from './components/TopBar.tsx';
import type {
  AppScreen,
  CoachFeedback,
  HintLevel,
  HyoTopic,
  PlanAnswers,
  RewriteEvaluation,
  SupportLevel,
  UserSession,
  WritingRecord,
  WritingStep,
} from './types/hyo.ts';
import { buildFallbackHint, HYO_TOPICS } from './utils/fallbackHints.ts';
import { checkPrivacy } from './utils/privacyCheck.ts';

const SESSION_KEY = 'hyo_steps_session_v1';
const LEVEL_KEY = 'hyo_steps_level_v1';

const EMPTY_PLAN: PlanAnswers = {
  who: '',
  what: '',
  when: '',
  feeling: '',
};

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('start');
  const [step, setStep] = useState<WritingStep>(1);
  const [popupStage, setPopupStage] = useState<PopupStage>('intro');
  const [selectedTopic, setSelectedTopic] = useState<HyoTopic>(HYO_TOPICS[0]);
  const [supportLevel, setSupportLevel] = useState<SupportLevel>(() => {
    const saved = localStorage.getItem(LEVEL_KEY);
    return saved === '1' ? 1 : saved === '3' ? 3 : 2;
  });

  const [session, setSession] = useState<UserSession | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as UserSession) : null;
    } catch {
      return null;
    }
  });
  const [signInOpen, setSignInOpen] = useState(false);

  // Writing state (never lost when moving Back/Next)
  const [plan, setPlan] = useState<PlanAnswers>(EMPTY_PLAN);
  const [firstDraft, setFirstDraft] = useState('');
  const [rewrittenDraft, setRewrittenDraft] = useState('');
  const [whatIChanged, setWhatIChanged] = useState('');
  const [privacyWarning, setPrivacyWarning] = useState('');

  // Hint state
  const [currentHintLevel, setCurrentHintLevel] = useState<HintLevel>(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [maxHintLevel, setMaxHintLevel] = useState<HintLevel>(1);
  const [feedback, setFeedback] = useState<CoachFeedback | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  // Finish & Save state
  const [checkingRewrite, setCheckingRewrite] = useState(false);
  const [evaluation, setEvaluation] = useState<RewriteEvaluation | null>(null);
  const [savingRecord, setSavingRecord] = useState(false);
  const [recordSaved, setRecordSaved] = useState(false);

  // Records state
  const [records, setRecords] = useState<WritingRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    localStorage.setItem(LEVEL_KEY, String(supportLevel));
  }, [supportLevel]);

  async function fetchRecords(targetScreen: 'records' | 'teacher', activeSession: UserSession | null) {
    if (!activeSession) {
      setRecords([]);
      return;
    }
    setLoadingRecords(true);
    try {
      const scope = targetScreen === 'teacher' && activeSession.isTeacher ? 'all' : 'mine';
      const res = await fetch(
        `/api/records?email=${encodeURIComponent(activeSession.email)}&scope=${scope}`
      );
      if (res.ok) {
        const data = await res.json();
        setRecords(Array.isArray(data.records) ? data.records : []);
      } else {
        setRecords([]);
      }
    } catch {
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  }

  function handleNavigate(nextScreen: AppScreen) {
    if (nextScreen === 'teacher' && !session?.isTeacher) {
      setScreen('start');
      return;
    }
    setScreen(nextScreen);
    if (nextScreen === 'records' || nextScreen === 'teacher') {
      void fetchRecords(nextScreen, session);
    }
  }

  async function handleSignIn(name: string, email: string) {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) {
      throw new Error('Sign in failed');
    }
    const nextSession = (await res.json()) as UserSession;
    setSession(nextSession);
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextSession));

    if (screen === 'records' || screen === 'teacher') {
      void fetchRecords(screen, nextSession);
    }
  }

  function handleSignOut() {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
    setRecords([]);
    if (screen === 'teacher') {
      setScreen('start');
    }
  }

  async function requestHint(draftText: string, hintLvl: HintLevel) {
    setLoadingHint(true);
    try {
      const res = await fetch('/api/coach/hint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft: draftText,
          hintLevel: hintLvl,
          supportLevel,
          topicTitle: selectedTopic.title,
          previousHighlighted: feedback?.highlightedPhrase || '',
        }),
      });
      const data = await res.json();

      if (res.status === 400 && data.privacyBlocked) {
        setPrivacyWarning(data.message);
        setStep(2);
        return;
      }

      if (!res.ok) {
        setFeedback(buildFallbackHint(draftText, hintLvl));
      } else {
        setFeedback(data as CoachFeedback);
      }

      setCurrentHintLevel(hintLvl);
      setHintsUsed((prev) => prev + 1);
      setMaxHintLevel((prev) => (hintLvl > prev ? hintLvl : prev));
    } catch {
      setFeedback(buildFallbackHint(draftText, hintLvl));
      setCurrentHintLevel(hintLvl);
      setHintsUsed((prev) => prev + 1);
      setMaxHintLevel((prev) => (hintLvl > prev ? hintLvl : prev));
    } finally {
      setLoadingHint(false);
    }
  }

  function handleConfirmOnboarding(topic: HyoTopic, level: SupportLevel) {
    setSelectedTopic(topic);
    setSupportLevel(level);
    setPopupStage(null);
    setPrivacyWarning('');
    setStep(1);
    setScreen('writing');
  }

  function handleStartWriting() {
    setPrivacyWarning('');
    setStep(1);
    setScreen('writing');
  }

  function handleDraftChange(nextDraft: string) {
    setFirstDraft(nextDraft);
    if (step <= 2) {
      setRewrittenDraft(nextDraft);
      if (feedback) {
        setFeedback(null);
      }
    }
    if (privacyWarning) {
      const check = checkPrivacy(nextDraft);
      if (!check.hasPersonalInfo) {
        setPrivacyWarning('');
      }
    }
  }

  function handleDraftNext() {
    const privacy = checkPrivacy(firstDraft);
    if (privacy.hasPersonalInfo) {
      setPrivacyWarning(privacy.message);
      return;
    }
    setPrivacyWarning('');
    if (!rewrittenDraft.trim()) {
      setRewrittenDraft(firstDraft);
    }
    setStep(3);

    if (!feedback) {
      setHintsUsed(0);
      setMaxHintLevel(1);
      void requestHint(firstDraft, 1);
    }
  }

  function handleRequestAnotherHint() {
    const nextHint: HintLevel = currentHintLevel === 1 ? 2 : 3;
    void requestHint(firstDraft, nextHint);
  }

  async function handleRewriteNext() {
    const privacy = checkPrivacy(rewrittenDraft);
    if (privacy.hasPersonalInfo) {
      setPrivacyWarning(privacy.message);
      return;
    }
    setPrivacyWarning('');
    setCheckingRewrite(true);

    try {
      const res = await fetch('/api/coach/check-rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstDraft,
          rewrittenDraft,
          highlightedPhrase: feedback?.highlightedPhrase || '',
          fixNote: feedback?.fix || '',
          supportLevel,
          maxHintLevel,
        }),
      });
      const data = await res.json();
      if (res.status === 400 && data.privacyBlocked) {
        setPrivacyWarning(data.message);
        return;
      }
      if (res.ok) {
        setEvaluation(data as RewriteEvaluation);
      } else {
        setEvaluation({
          fixed: rewrittenDraft.trim() !== firstDraft.trim(),
          recommendedNextLevel: supportLevel,
          levelChange: 'same',
          encouragement: 'Great work completing your own rewrite!',
        });
      }
      setStep(5);
    } catch {
      setEvaluation({
        fixed: rewrittenDraft.trim() !== firstDraft.trim(),
        recommendedNextLevel: supportLevel,
        levelChange: 'same',
        encouragement: 'Great work completing your own rewrite!',
      });
      setStep(5);
    } finally {
      setCheckingRewrite(false);
    }
  }

  async function handleSaveRecord() {
    if (!session) {
      setSignInOpen(true);
      return;
    }
    setSavingRecord(true);
    try {
      const nextLevel = evaluation?.recommendedNextLevel ?? supportLevel;
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: session.name,
          studentEmail: session.email,
          topicId: selectedTopic.id,
          topicTitle: selectedTopic.title,
          supportLevel,
          nextRecommendedLevel: nextLevel,
          hintsUsed: Math.max(1, hintsUsed),
          maxHintLevel,
          firstDraft,
          finalText: rewrittenDraft,
          whatIChanged,
        }),
      });
      if (res.ok) {
        setRecordSaved(true);
        setSupportLevel(nextLevel);
      }
    } finally {
      setSavingRecord(false);
    }
  }

  function handleStartNextTopic(nextLevel: SupportLevel) {
    setSupportLevel(nextLevel);
    setPlan(EMPTY_PLAN);
    setFirstDraft('');
    setRewrittenDraft('');
    setWhatIChanged('');
    setPrivacyWarning('');
    setFeedback(null);
    setCurrentHintLevel(1);
    setHintsUsed(0);
    setMaxHintLevel(1);
    setEvaluation(null);
    setRecordSaved(false);
    setStep(1);
    setScreen('start');
    setPopupStage('roulette');
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopBar
        screen={screen}
        step={step}
        supportLevel={supportLevel}
        session={session}
        onNavigate={handleNavigate}
        onGoHome={() => setScreen('start')}
        onSelectStep={setStep}
        onOpenSignIn={() => setSignInOpen(true)}
        onSignOut={handleSignOut}
      />

      {screen === 'start' && (
        <StartScreen
          totalTopicCount={HYO_TOPICS.length}
          selectedTopic={selectedTopic}
          supportLevel={supportLevel}
          session={session}
          onOpenIntroPopup={() => setPopupStage('intro')}
          onOpenRoulettePopup={() => setPopupStage('roulette')}
          onSelectLevel={setSupportLevel}
          onStart={handleStartWriting}
          onOpenSignIn={() => setSignInOpen(true)}
        />
      )}

      {screen === 'writing' && (
        <main>
          {step === 1 && (
            <PlanStep
              topic={selectedTopic}
              plan={plan}
              onChange={setPlan}
              onBack={() => setScreen('start')}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <DraftStep
              topic={selectedTopic}
              plan={plan}
              supportLevel={supportLevel}
              draft={firstDraft}
              privacyWarning={privacyWarning}
              onChangeDraft={handleDraftChange}
              onBack={() => setStep(1)}
              onNext={handleDraftNext}
            />
          )}

          {step === 3 && (
            <HintStep
              draft={firstDraft}
              feedback={feedback}
              loading={loadingHint}
              currentHintLevel={currentHintLevel}
              onRequestNextHint={handleRequestAnotherHint}
              onBack={() => setStep(2)}
              onNext={() => {
                setPrivacyWarning('');
                setStep(4);
              }}
            />
          )}

          {step === 4 && (
            <RewriteStep
              firstDraft={firstDraft}
              rewrittenDraft={rewrittenDraft}
              feedback={feedback}
              privacyWarning={privacyWarning}
              checking={checkingRewrite}
              onChangeRewrite={(val) => {
                setRewrittenDraft(val);
                if (privacyWarning && !checkPrivacy(val).hasPersonalInfo) {
                  setPrivacyWarning('');
                }
              }}
              onBack={() => setStep(3)}
              onNext={handleRewriteNext}
            />
          )}

          {step === 5 && (
            <FinishStep
              topic={selectedTopic}
              firstDraft={firstDraft}
              finalText={rewrittenDraft}
              whatIChanged={whatIChanged}
              hintsUsed={Math.max(1, hintsUsed)}
              maxHintLevel={maxHintLevel}
              supportLevel={supportLevel}
              evaluation={evaluation}
              saved={recordSaved}
              saving={savingRecord}
              onChangeNote={setWhatIChanged}
              onBack={() => setStep(4)}
              onSave={handleSaveRecord}
              onViewRecords={() => handleNavigate('records')}
              onStartNextTopic={handleStartNextTopic}
            />
          )}
        </main>
      )}

      {screen === 'records' && (
        <RecordsView
          mode="mine"
          session={session}
          records={records}
          loading={loadingRecords}
          onOpenSignIn={() => setSignInOpen(true)}
          onStartWriting={handleStartWriting}
        />
      )}

      {screen === 'teacher' && session?.isTeacher && (
        <RecordsView
          mode="teacher"
          session={session}
          records={records}
          loading={loadingRecords}
          onOpenSignIn={() => setSignInOpen(true)}
          onStartWriting={handleStartWriting}
        />
      )}

      <OnboardingPopup
        stage={popupStage}
        topics={HYO_TOPICS}
        initialLevel={supportLevel}
        onChangeStage={setPopupStage}
        onConfirmSelection={handleConfirmOnboarding}
      />

      <SignInModal
        isOpen={signInOpen}
        onClose={() => setSignInOpen(false)}
        onSignIn={handleSignIn}
      />
    </div>
  );
}
