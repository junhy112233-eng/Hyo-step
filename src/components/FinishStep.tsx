import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import type { HintLevel, HyoTopic, RewriteEvaluation, SupportLevel } from '../types/hyo.ts';

interface FinishStepProps {
  topic: HyoTopic;
  firstDraft: string;
  finalText: string;
  whatIChanged: string;
  hintsUsed: number;
  maxHintLevel: HintLevel;
  supportLevel: SupportLevel;
  evaluation: RewriteEvaluation | null;
  saved: boolean;
  saving: boolean;
  onChangeNote: (note: string) => void;
  onBack: () => void;
  onSave: () => void;
  onViewRecords: () => void;
  onStartNextTopic: (nextLevel: SupportLevel) => void;
}

const HINT_LABELS: Record<HintLevel, string> = {
  1: 'Hint 1',
  2: 'Hint 2',
  3: 'Hint 3',
};

export function FinishStep({
  topic,
  firstDraft,
  finalText,
  whatIChanged,
  hintsUsed,
  maxHintLevel,
  supportLevel,
  evaluation,
  saved,
  saving,
  onChangeNote,
  onBack,
  onSave,
  onViewRecords,
  onStartNextTopic,
}: FinishStepProps) {
  const [showSample, setShowSample] = useState(false);

  const recommendedLevel = evaluation?.recommendedNextLevel ?? supportLevel;

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-5 pb-28 sm:px-6 sm:pb-10">
      <div className="mb-4">
        <p className="text-xs font-semibold text-emerald-700">Step 5 · Finish</p>
        <h1 className="font-display mt-0.5 text-xl font-bold text-slate-900 sm:text-2xl">
          Before &amp; After
        </h1>
      </div>

      {evaluation && (
        <div
          role="status"
          className="mb-4 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-950"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
          <p className="font-medium">
            {evaluation.encouragement}{' '}
            <span className="text-xs text-emerald-800">(Next: Level {recommendedLevel})</span>
          </p>
        </div>
      )}

      {/* Before / After Comparison */}
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold text-slate-500">Before</p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 sm:text-base">
            {firstDraft}
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-white p-4">
          <p className="text-xs font-semibold text-emerald-700">After</p>
          <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-900 sm:text-base">
            {finalText}
          </p>
        </section>
      </div>

      {/* What I changed & AI helped me with */}
      <div className="mt-4 grid grid-cols-1 gap-3.5 md:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-7">
          <label htmlFor="what-i-changed" className="block text-sm font-semibold text-slate-900">
            What I changed
          </label>
          <textarea
            id="what-i-changed"
            rows={2}
            value={whatIChanged}
            onChange={(e) => onChangeNote(e.target.value)}
            placeholder="e.g. I changed 'help' to 'helped'."
            className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
          />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-5">
          <p className="text-sm font-semibold text-slate-900">AI helped me with</p>
          <dl className="mt-2 space-y-1.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-slate-600">Hints used</dt>
              <dd className="font-tabular font-semibold text-slate-900">
                {hintsUsed} ({HINT_LABELS[maxHintLevel]})
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-slate-600">Support level</dt>
              <dd className="font-tabular font-semibold text-slate-900">Level {supportLevel}</dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Step 5 Only: See a sample */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-slate-900">Sample paragraph</span>
          <button
            type="button"
            onClick={() => setShowSample((prev) => !prev)}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
            <span>{showSample ? 'Hide sample' : 'See a sample'}</span>
          </button>
        </div>

        {showSample && (
          <p className="mt-3 border-t border-slate-100 pt-3 text-sm leading-relaxed text-slate-800 sm:text-base">
            {topic.sampleParagraph}
          </p>
        )}
      </div>

      {saved && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">Saved to My Records!</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onViewRecords}
              className="min-h-[42px] rounded-xl border border-emerald-300 bg-white px-3.5 py-2 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
            >
              My Records
            </button>
            <button
              type="button"
              onClick={() => onStartNextTopic(recommendedLevel)}
              className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Next Topic (Level {recommendedLevel})</span>
            </button>
          </div>
        </div>
      )}

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
            onClick={onSave}
            disabled={saving || saved}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60 sm:flex-none sm:px-8"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>{saved ? 'Saved' : saving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
