import { useState } from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, HelpCircle, Lightbulb, Loader2 } from 'lucide-react';
import type { CoachFeedback, HintLevel } from '../types/hyo.ts';

interface HintStepProps {
  draft: string;
  feedback: CoachFeedback | null;
  loading: boolean;
  currentHintLevel: HintLevel;
  onRequestNextHint: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function HighlightedDraft({
  text,
  phrase,
}: {
  text: string;
  phrase?: string;
}) {
  const cleanPhrase = (phrase || '').trim();
  if (!cleanPhrase) {
    return <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-900">{text}</p>;
  }

  const idx = text.indexOf(cleanPhrase);
  if (idx === -1) {
    return <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-900">{text}</p>;
  }

  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + cleanPhrase.length);
  const after = text.slice(idx + cleanPhrase.length);

  return (
    <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-900">
      {before}
      <mark className="rounded bg-amber-200/80 px-1 py-0.5 font-medium text-slate-950 underline decoration-amber-600 decoration-2 underline-offset-4">
        {match}
      </mark>
      {after}
    </p>
  );
}

export function HintStep({
  draft,
  feedback,
  loading,
  currentHintLevel,
  onRequestNextHint,
  onBack,
  onNext,
}: HintStepProps) {
  const [showKorean, setShowKorean] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-5 pb-28 sm:px-6 sm:pb-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-600">Step 3 · Hint</p>
          <h1 className="font-display mt-0.5 text-xl font-bold text-slate-900 sm:text-2xl">
            Hyo-Co&apos;s Hint
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowKorean((prev) => !prev)}
          disabled={!feedback || loading}
          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <HelpCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
          <span>한국어 도움</span>
        </button>
      </div>

      {/* Highlighted Student Text */}
      <section
        aria-label="Your draft with one highlighted point"
        className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
      >
        <p className="mb-1.5 text-xs font-medium text-slate-500">Your Draft</p>
        <HighlightedDraft text={draft} phrase={feedback?.highlightedPhrase} />
      </section>

      {/* Friendly Hyo-Co Coach Character + Speech Bubble */}
      <section
        aria-label="Hyo-Co feedback"
        className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6"
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:gap-5">
          {/* Larger Hyo-Co Portrait */}
          <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-center sm:gap-1.5">
            <div className="h-20 w-20 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/40 shadow-xs sm:h-28 sm:w-28">
              {!avatarFailed ? (
                <img
                  src="/src/assets/images/hyoco_coach_avatar_1795142254678.jpg"
                  alt="Hyo-Co writing coach owl with glasses and notebook"
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-700">
                  <Lightbulb className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="sm:text-center">
              <p className="font-display text-sm font-bold text-slate-900">Hyo-Co</p>
              <p className="font-tabular text-[11px] font-medium text-slate-500">
                Hint {currentHintLevel}/3
              </p>
            </div>
          </div>

          {/* Conversational Speech Bubble */}
          <div className="relative w-full flex-1 rounded-2xl border border-blue-200/80 bg-blue-50/45 p-4 sm:p-5">
            {/* Speech bubble pointer arrow on desktop */}
            <div
              aria-hidden="true"
              className="hidden sm:block sm:absolute sm:-left-2 sm:top-7 sm:h-3.5 sm:w-3.5 sm:rotate-45 sm:border-b sm:border-l sm:border-blue-200/80 sm:bg-[#f5f9ff]"
            />
            {/* Speech bubble pointer arrow on mobile */}
            <div
              aria-hidden="true"
              className="absolute -top-2 left-7 h-3.5 w-3.5 rotate-45 border-l border-t border-blue-200/80 bg-[#f5f9ff] sm:hidden"
            />

            {loading ? (
              <div className="flex items-center gap-2.5 py-5 text-sm text-slate-700">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" aria-hidden="true" />
                <span>Hyo-Co is reading your story...</span>
              </div>
            ) : feedback ? (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-blue-700">
                  Hyo-Co says: &ldquo;Here is one tip for you!&rdquo; 👋
                </p>

                {feedback.fallbackNotice && (
                  <p className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700">
                    {feedback.fallbackNotice}
                  </p>
                )}

                <div className="space-y-2 rounded-xl bg-white/85 p-3.5 text-sm leading-relaxed sm:text-base">
                  <p className="text-slate-900">
                    <strong className="font-semibold text-emerald-700">Praise: </strong>
                    {feedback.praise}
                  </p>
                  <p className="text-slate-900">
                    <strong className="font-semibold text-blue-700">Fix: </strong>
                    {feedback.fix}
                  </p>
                  <p className="text-slate-900">
                    <strong className="font-semibold text-slate-900">Question: </strong>
                    {feedback.question}
                  </p>
                </div>

                {feedback.patternExample && (
                  <div className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800">
                    <span className="text-xs font-semibold text-slate-500">Pattern: </span>
                    <span className="font-medium text-slate-900">{feedback.patternExample}</span>
                  </div>
                )}

                {showKorean && (
                  <div
                    role="region"
                    aria-label="한국어 힌트 설명"
                    className="rounded-xl border border-blue-200 bg-white p-3 text-sm leading-relaxed text-slate-800"
                  >
                    {feedback.koreanHelp}
                  </div>
                )}

                {currentHintLevel < 3 && (
                  <div className="pt-0.5">
                    <button
                      type="button"
                      onClick={onRequestNextHint}
                      className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50"
                    >
                      <Lightbulb className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                      <span>Need another hint? (Hint {currentHintLevel + 1})</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
          <span>AI can be wrong. Check a dictionary or textbook if unsure.</span>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:static sm:mt-6 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:flex-none sm:px-6"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>Back</span>
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={loading}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:flex-none sm:px-8"
          >
            <span>Next · Rewrite</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
