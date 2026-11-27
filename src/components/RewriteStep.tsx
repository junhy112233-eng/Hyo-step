import { useState } from 'react';
import { ArrowLeft, ArrowRight, HelpCircle, Loader2, ShieldAlert } from 'lucide-react';
import type { CoachFeedback } from '../types/hyo.ts';
import { HighlightedDraft } from './HintStep.tsx';

interface RewriteStepProps {
  firstDraft: string;
  rewrittenDraft: string;
  feedback: CoachFeedback | null;
  privacyWarning: string;
  checking: boolean;
  onChangeRewrite: (text: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function RewriteStep({
  firstDraft,
  rewrittenDraft,
  feedback,
  privacyWarning,
  checking,
  onChangeRewrite,
  onBack,
  onNext,
}: RewriteStepProps) {
  const [showKorean, setShowKorean] = useState(false);

  const words = rewrittenDraft.trim() ? rewrittenDraft.trim().split(/\s+/).length : 0;
  const sentences = rewrittenDraft.trim()
    ? rewrittenDraft
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean).length
    : 0;

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-5 pb-28 sm:px-6 sm:pb-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-600">Step 4 · Rewrite</p>
          <h1 className="font-display mt-0.5 text-xl font-bold text-slate-900 sm:text-2xl">
            Rewrite it yourself
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowKorean((prev) => !prev)}
          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <HelpCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
          <span>한국어 도움</span>
        </button>
      </div>

      {feedback && (
        <section
          aria-label="Retained focus point"
          className="mb-3.5 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="rounded-xl bg-slate-50 p-3">
            <HighlightedDraft text={firstDraft} phrase={feedback.highlightedPhrase} />
          </div>
          <p className="mt-2.5 text-sm text-slate-800">
            <strong className="font-semibold text-blue-700">Fix: </strong>
            {feedback.fix} <strong className="font-semibold text-slate-900">Question: </strong>
            {feedback.question}
          </p>
          {feedback.patternExample && (
            <p className="mt-1.5 text-xs text-slate-600">{feedback.patternExample}</p>
          )}
        </section>
      )}

      {showKorean && feedback?.koreanHelp && (
        <div
          role="region"
          aria-label="한국어 힌트 도움"
          className="mb-3.5 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-sm text-slate-800"
        >
          {feedback.koreanHelp}
        </div>
      )}

      {privacyWarning && (
        <div
          role="alert"
          className="mb-3.5 flex items-start gap-2.5 rounded-2xl border border-red-300 bg-red-50 p-3.5 text-xs text-red-900 sm:text-sm"
        >
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <span>{privacyWarning}</span>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <label htmlFor="rewrite-textarea" className="sr-only">
          Your Rewrite
        </label>
        <textarea
          id="rewrite-textarea"
          rows={6}
          value={rewrittenDraft}
          onChange={(e) => onChangeRewrite(e.target.value)}
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-base leading-relaxed text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
        />
        <div className="mt-2.5 flex items-center justify-end text-xs font-medium text-slate-600 font-tabular">
          {words} words · {sentences} sentences
        </div>
      </div>

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
            disabled={!rewrittenDraft.trim() || checking}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:flex-none sm:px-8"
          >
            {checking ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <span>Next · Finish</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
