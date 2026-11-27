import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check, Dices, HelpCircle, Lock, RotateCw, ShieldAlert } from 'lucide-react';
import type { HyoTopic, SupportLevel } from '../types/hyo.ts';
import { LEVEL_SUPPORT_COPY } from '../utils/fallbackHints.ts';

export type PopupStage = 'intro' | 'roulette' | null;

interface OnboardingPopupProps {
  stage: PopupStage;
  topics: HyoTopic[];
  initialLevel: SupportLevel;
  onChangeStage: (stage: PopupStage) => void;
  onConfirmSelection: (topic: HyoTopic, level: SupportLevel) => void;
}

const COMPACT_LEVEL_SUB: Record<SupportLevel, string> = {
  1: '문장 틀 빈칸 채우기',
  2: '핵심 단어 보고 쓰기',
  3: '도움 없이 자유롭게 쓰기',
};

export function OnboardingPopup({
  stage,
  topics,
  initialLevel,
  onChangeStage,
  onConfirmSelection,
}: OnboardingPopupProps) {
  const [candidates, setCandidates] = useState<HyoTopic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [reSpinsLeft, setReSpinsLeft] = useState<number>(3);
  const [hasSpunOnce, setHasSpunOnce] = useState<boolean>(false);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [reelTopic, setReelTopic] = useState<HyoTopic>(topics[0]);
  const [chosenLevel, setChosenLevel] = useState<SupportLevel>(initialLevel);

  const spinTimerRef = useRef<number | null>(null);
  const prevStageRef = useRef<PopupStage>(stage);

  useEffect(() => {
    if (stage === 'roulette') {
      setChosenLevel(initialLevel);
      if (prevStageRef.current === null) {
        setCandidates([]);
        setSelectedTopicId(null);
        setReSpinsLeft(3);
        setHasSpunOnce(false);
        setIsSpinning(false);
        setReelTopic(topics[Math.floor(Math.random() * topics.length)]);
      }
    }
    prevStageRef.current = stage;
  }, [stage, initialLevel, topics]);

  useEffect(() => {
    return () => {
      if (spinTimerRef.current !== null) {
        window.clearTimeout(spinTimerRef.current);
      }
    };
  }, []);

  if (!stage) return null;

  function pickRandomTopic(excludeIds: Set<string>): HyoTopic {
    const pool = topics.filter((t) => !excludeIds.has(t.id));
    const source = pool.length > 0 ? pool : topics;
    return source[Math.floor(Math.random() * source.length)];
  }

  function handleSpin(isRespin: boolean) {
    if (isSpinning) return;
    if (isRespin && reSpinsLeft <= 0) return;

    setIsSpinning(true);
    const exclude = new Set(candidates.map((c) => c.id));
    const finalTarget = pickRandomTopic(exclude);

    const totalTicks = 14;
    let tick = 0;

    const runTick = () => {
      tick += 1;
      if (tick < totalTicks) {
        const preview = topics[Math.floor(Math.random() * topics.length)];
        setReelTopic(preview);
        spinTimerRef.current = window.setTimeout(runTick, 45 + tick * 12);
      } else {
        setReelTopic(finalTarget);
        setIsSpinning(false);

        setCandidates((prev) => {
          if (prev.length < 3) {
            return [...prev, finalTarget];
          }
          const replaceIdx = prev.findIndex((t) => t.id !== selectedTopicId);
          const idxToReplace = replaceIdx === -1 ? 0 : replaceIdx;
          const next = [...prev];
          next[idxToReplace] = finalTarget;
          return next;
        });

        if (!hasSpunOnce) {
          setHasSpunOnce(true);
        } else if (isRespin) {
          setReSpinsLeft((prev) => Math.max(0, prev - 1));
        }
      }
    };

    runTick();
  }

  function handleResetRouletteAndOpen() {
    setCandidates([]);
    setSelectedTopicId(null);
    setReSpinsLeft(3);
    setHasSpunOnce(false);
    setIsSpinning(false);
    setReelTopic(topics[Math.floor(Math.random() * topics.length)]);
    onChangeStage('roulette');
  }

  const selectedTopic = candidates.find((c) => c.id === selectedTopicId) ?? null;
  const canConfirm = Boolean(selectedTopic) && !isSpinning;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/55 p-3 backdrop-blur-xs sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-popup-title"
    >
      {stage === 'intro' ? (
        <div className="my-auto w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-7">
          <h2
            id="onboarding-popup-title"
            className="font-display text-2xl font-bold text-slate-900"
          >
            💛 HYO Steps 시작하기
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            가족에게 전하는 작은 감사와 배려(<strong>HYO</strong>)를 영어로 써 보는 5단계 코칭
            앱이에요.
          </p>

          <ul className="mt-4 space-y-2.5 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
            <li className="flex items-start gap-2.5">
              <span aria-hidden="true">📝</span>
              <div>
                <strong className="font-semibold text-slate-900">5단계 쓰기</strong>
                <p className="text-xs text-slate-600">계획 → 초안 → 힌트 → 고쳐 쓰기 → 완료</p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 border-t border-slate-200 pt-2.5">
              <span aria-hidden="true">🦉</span>
              <div>
                <strong className="font-semibold text-slate-900">AI 코치 Hyo-Co</strong>
                <p className="text-xs text-slate-600">
                  정답 대신 <strong>칭찬 1 · 힌트 1 · 질문 1</strong>만 줘요
                </p>
              </div>
            </li>
            <li className="flex items-start gap-2.5 border-t border-slate-200 pt-2.5">
              <span aria-hidden="true">🇰🇷</span>
              <div>
                <strong className="font-semibold text-slate-900">한국어 도움 &amp; 맞춤 단계</strong>
                <p className="text-xs text-slate-600">막힐 땐 한국어 도움을 바로 볼 수 있어요</p>
              </div>
            </li>
          </ul>

          <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-2.5 text-xs text-amber-950">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
            <span>실명, 학교, 전화번호, 집 주소는 적지 마세요.</span>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={handleResetRouletteAndOpen}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <span>다음 · 주제 룰렛 돌리기</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ) : (
        <div className="my-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2
                id="onboarding-popup-title"
                className="font-display text-xl font-bold text-slate-900"
              >
                🎯 주제 룰렛 &amp; 도움 단계
              </h2>
              <p className="text-xs text-slate-500">100개 HYO 주제 중 뽑고, 1개를 최종 선택하세요</p>
            </div>
            <button
              type="button"
              onClick={() => onChangeStage('intro')}
              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-200 px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>앱 설명</span>
            </button>
          </div>

          {/* Roulette Spinner */}
          <section
            aria-label="Topic roulette spinner"
            className="mt-3.5 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:p-4"
          >
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>100 HYO Topics</span>
              <span className="font-tabular font-semibold text-slate-800">
                {hasSpunOnce ? `재선택 ${reSpinsLeft}/3회 남음` : '룰렛을 돌려 주세요'}
              </span>
            </div>

            <div
              className={`mt-2.5 rounded-xl border bg-white p-3.5 transition-colors ${
                isSpinning ? 'border-blue-400 bg-blue-50/40' : 'border-slate-200'
              }`}
            >
              {hasSpunOnce || isSpinning ? (
                <div>
                  <p className="font-display text-base font-bold text-slate-900">{reelTopic.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{reelTopic.koreanSubtitle}</p>
                </div>
              ) : (
                <p className="py-1.5 text-center text-sm font-medium text-slate-600">
                  버튼을 눌러 오늘의 주제를 뽑아 보세요! (최대 3회 다시 뽑기)
                </p>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              {!hasSpunOnce ? (
                <button
                  type="button"
                  onClick={() => handleSpin(false)}
                  disabled={isSpinning}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60 sm:w-auto"
                >
                  <Dices className={`h-4 w-4 ${isSpinning ? 'animate-spin' : ''}`} aria-hidden="true" />
                  <span>{isSpinning ? '돌리는 중...' : '룰렛 돌리기'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSpin(true)}
                  disabled={isSpinning || reSpinsLeft <= 0}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RotateCw
                    className={`h-4 w-4 ${isSpinning ? 'animate-spin text-blue-600' : ''}`}
                    aria-hidden="true"
                  />
                  <span>{reSpinsLeft > 0 ? `다시 돌리기 (${reSpinsLeft}회)` : '기회 모두 사용'}</span>
                </button>
              )}

              {hasSpunOnce && (
                <span className="text-xs text-slate-500">아래 카드 중 1개 클릭</span>
              )}
            </div>
          </section>

          {/* Drawn Candidates (Pick 1 of up to 3) */}
          {candidates.length > 0 && (
            <div className="mt-3.5">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {candidates.map((topic, idx) => {
                  const isSelected = topic.id === selectedTopicId;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedTopicId(topic.id)}
                      disabled={isSpinning}
                      className={`flex min-h-[96px] flex-col justify-between rounded-xl border p-3 text-left transition-colors ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-600/20'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-tabular text-[11px] font-semibold text-slate-400">
                            후보 {idx + 1}
                          </span>
                          {isSelected && (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-blue-700">
                              <Check className="h-3 w-3" aria-hidden="true" />
                              선택됨
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs font-semibold leading-snug text-slate-900">
                          {topic.title}
                        </p>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-snug text-slate-500">
                        {topic.koreanSubtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Support Level Tabs */}
          <div className="mt-4 border-t border-slate-200 pt-3.5">
            <p className="text-xs font-bold text-slate-700">도움 단계 (Support Level)</p>
            <div
              className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3"
              role="tablist"
              aria-label="Support level selection"
            >
              {([1, 2, 3] as SupportLevel[]).map((lvl) => {
                const copy = LEVEL_SUPPORT_COPY[lvl];
                const active = chosenLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setChosenLevel(lvl)}
                    className={`rounded-xl border p-2.5 text-left transition-colors ${
                      active
                        ? 'border-blue-600 bg-blue-50/70 text-slate-900 ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-blue-700">
                        {copy.label} · {copy.koreanLabel}
                      </span>
                      {active && <Check className="h-3.5 w-3.5 text-blue-700" aria-hidden="true" />}
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600">{COMPACT_LEVEL_SUB[lvl]}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mandatory Final Selection Gate */}
          <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-200 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              {!canConfirm ? (
                <>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-amber-600" aria-hidden="true" />
                  <span>주제 1개를 클릭해 최종 선택하세요</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{LEVEL_SUPPORT_COPY[chosenLevel].koreanLabel} 선택됨</span>
                </>
              )}
            </div>

            <button
              type="button"
              disabled={!canConfirm}
              onClick={() => {
                if (selectedTopic) {
                  onConfirmSelection(selectedTopic, chosenLevel);
                }
              }}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
            >
              <span>선택 완료 · 글쓰기 시작</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
