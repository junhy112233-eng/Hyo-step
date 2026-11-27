import { useState } from 'react';
import { ArrowRight, BookOpen, Dices, HelpCircle, ShieldAlert } from 'lucide-react';
import type { HyoTopic, SupportLevel, UserSession } from '../types/hyo.ts';
import { LEVEL_SUPPORT_COPY } from '../utils/fallbackHints.ts';

interface StartScreenProps {
  totalTopicCount: number;
  selectedTopic: HyoTopic;
  supportLevel: SupportLevel;
  session: UserSession | null;
  onOpenIntroPopup: () => void;
  onOpenRoulettePopup: () => void;
  onSelectLevel: (level: SupportLevel) => void;
  onStart: () => void;
  onOpenSignIn: () => void;
}

export function StartScreen({
  totalTopicCount,
  selectedTopic,
  supportLevel,
  session,
  onOpenIntroPopup,
  onOpenRoulettePopup,
  onSelectLevel,
  onStart,
  onOpenSignIn,
}: StartScreenProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* Left: Core Story & Topic Card */}
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-semibold text-blue-600">CEFR A2 · Middle School</p>
              <button
                type="button"
                onClick={onOpenIntroPopup}
                className="inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-slate-600 hover:text-blue-600"
              >
                <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                <span>앱 안내</span>
              </button>
            </div>

            <h1 className="font-display mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Write about caring for your family.
            </h1>
            <p className="mt-1.5 text-sm text-slate-600">
              You write, Hyo-Co gives one hint, and you rewrite it yourself.
            </p>

            {/* Topic Card */}
            <section
              aria-labelledby="topic-card-heading"
              className="mt-5 rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span id="topic-card-heading">
                  {selectedTopic.id.toUpperCase()} / {totalTopicCount}
                </span>
                <span>~5 sentences</span>
              </div>
              <h2 className="font-display mt-1.5 text-lg font-semibold text-slate-900 sm:text-xl">
                {selectedTopic.title}
              </h2>
              <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                {selectedTopic.koreanSubtitle}
              </p>

              <button
                type="button"
                onClick={onOpenRoulettePopup}
                className="mt-3.5 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100"
              >
                <Dices className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                <span>주제 다시 뽑기</span>
              </button>
            </section>

            {/* Support Level Selector */}
            <div className="mt-4">
              <p className="text-xs font-medium text-slate-600">도움 단계 (Support Level)</p>
              <div
                className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-xl bg-slate-100 p-1"
                role="tablist"
                aria-label="Choose support level"
              >
                {([1, 2, 3] as SupportLevel[]).map((lvl) => {
                  const active = lvl === supportLevel;
                  const copy = LEVEL_SUPPORT_COPY[lvl];
                  return (
                    <button
                      key={lvl}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => onSelectLevel(lvl)}
                      className={`min-h-[48px] rounded-lg px-2 py-1.5 text-center transition-colors ${
                        active
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="block text-xs font-semibold">Level {lvl}</span>
                      <span className="block text-[11px] text-slate-500">{copy.koreanLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compact Privacy Reminder */}
            <div
              role="note"
              className="mt-4 flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-xs text-amber-950"
            >
              <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
              <span>Do not write your real name, school, phone, or address.</span>
            </div>
          </div>

          {/* Primary Start Action */}
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto"
            >
              <span>Start Writing</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            {!session && (
              <button
                type="button"
                onClick={onOpenSignIn}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
              >
                Sign in
              </button>
            )}
          </div>
        </div>

        {/* Right: Hero Illustration */}
        <div className="lg:col-span-5">
          <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100 lg:h-full lg:min-h-[300px]">
              {!imgFailed ? (
                <img
                  src="/src/assets/images/hyo_family_care_hero_1795142254874.jpg"
                  alt="A middle school student warmly helping her grandmother in a sunlit kitchen"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 p-8 text-center">
                  <BookOpen className="h-10 w-10 text-blue-600" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-slate-800">HYO Steps</p>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 bg-white px-5 py-3 text-xs font-medium text-slate-600">
              Plan → Draft → Hint → Rewrite → Finish
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
