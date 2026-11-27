import { useState } from 'react';
import { ArrowLeft, ArrowRight, HelpCircle, ShieldAlert, Sparkles } from 'lucide-react';
import type { HyoTopic, PlanAnswers, SupportLevel } from '../types/hyo.ts';
import { LEVEL_SUPPORT_COPY } from '../utils/fallbackHints.ts';

interface DraftStepProps {
  topic: HyoTopic;
  plan: PlanAnswers;
  supportLevel: SupportLevel;
  draft: string;
  privacyWarning: string;
  onChangeDraft: (text: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export function DraftStep({
  topic,
  plan,
  supportLevel,
  draft,
  privacyWarning,
  onChangeDraft,
  onBack,
  onNext,
}: DraftStepProps) {
  const [showKoreanHelp, setShowKoreanHelp] = useState(false);
  const [koreanText, setKoreanText] = useState('');
  const [loadingKorean, setLoadingKorean] = useState(false);

  const levelCopy = LEVEL_SUPPORT_COPY[supportLevel];
  const words = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const sentences = draft.trim()
    ? draft
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean).length
    : 0;

  const hasPlanNotes = Boolean(plan.who || plan.what || plan.when || plan.feeling);

  async function handleToggleKoreanHelp() {
    if (showKoreanHelp) {
      setShowKoreanHelp(false);
      return;
    }
    setShowKoreanHelp(true);
    if (koreanText) return;

    setLoadingKorean(true);
    try {
      const res = await fetch('/api/coach/korean-draft-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft,
          plan,
          supportLevel,
          topicTitle: topic.title,
        }),
      });
      const data = await res.json();
      setKoreanText(
        data.koreanHelp ||
          data.fallbackKorean ||
          '계획한 내용을 바탕으로 5문장 정도 써 보세요. and, because, so를 활용하면 좋아요.'
      );
    } catch {
      setKoreanText(
        '계획한 단어들을 이어 5문장 정도 써 보세요. 과거에 한 일은 과거형 동사를 써 보세요.'
      );
    } finally {
      setLoadingKorean(false);
    }
  }

  function handleInsertFrame() {
    if (!levelCopy.starterTemplate) return;
    if (!draft.trim()) {
      onChangeDraft(levelCopy.starterTemplate);
    } else {
      onChangeDraft(`${draft.trim()}\n${levelCopy.starterTemplate}`);
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-5 pb-28 sm:px-6 sm:pb-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-600">Step 2 · Draft</p>
          <h1 className="font-display mt-0.5 text-xl font-bold text-slate-900 sm:text-2xl">
            {topic.title}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleToggleKoreanHelp}
          className="inline-flex min-h-[42px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <HelpCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
          <span>한국어 도움</span>
        </button>
      </div>

      {showKoreanHelp && (
        <div
          role="region"
          aria-label="한국어 글쓰기 도움"
          className="mb-3.5 rounded-2xl border border-blue-200 bg-blue-50/70 p-3.5 text-sm text-slate-800"
        >
          {loadingKorean
            ? '불러오는 중...'
            : koreanText || '계획표 내용을 바탕으로 5문장 정도 써 보세요.'}
        </div>
      )}

      {/* Compact Support Card */}
      <section className="mb-3.5 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold text-slate-800">
            {levelCopy.label} · {levelCopy.koreanLabel}
          </p>
          {supportLevel === 1 && levelCopy.starterTemplate && (
            <button
              type="button"
              onClick={handleInsertFrame}
              className="inline-flex min-h-[34px] items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Use frame</span>
            </button>
          )}
        </div>

        {supportLevel === 1 && levelCopy.frames && (
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            {levelCopy.frames.slice(0, 3).join(' · ')}
          </p>
        )}

        {supportLevel === 2 && levelCopy.keywords && (
          <p className="mt-1.5 text-xs font-medium text-slate-600">
            Keywords: {levelCopy.keywords.join(' · ')}
          </p>
        )}

        {supportLevel === 3 && (
          <p className="mt-1.5 text-xs text-slate-600">
            Write ~5 sentences using connectors (and, because, so).
          </p>
        )}

        {hasPlanNotes && (
          <p className="mt-2 border-t border-slate-100 pt-2 text-xs text-slate-500">
            <strong className="text-slate-700">Plan: </strong>
            {[plan.who, plan.what, plan.when, plan.feeling].filter(Boolean).join(' · ')}
          </p>
        )}
      </section>

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
        <label htmlFor="draft-textarea" className="sr-only">
          Write your English paragraph here
        </label>
        <textarea
          id="draft-textarea"
          rows={6}
          value={draft}
          onChange={(e) => onChangeDraft(e.target.value)}
          placeholder="Write about 5 sentences here..."
          className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-base leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
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
            disabled={!draft.trim()}
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none sm:px-8"
          >
            <span>Next · Hint</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
