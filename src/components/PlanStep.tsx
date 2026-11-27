import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { HyoTopic, PlanAnswers } from '../types/hyo.ts';

interface PlanStepProps {
  topic: HyoTopic;
  plan: PlanAnswers;
  onChange: (plan: PlanAnswers) => void;
  onBack: () => void;
  onNext: () => void;
}

const PLAN_PROMPTS: Array<{
  key: keyof PlanAnswers;
  title: string;
  korean: string;
  placeholder: string;
  ideas: string[];
}> = [
  {
    key: 'who',
    title: 'Who do you care for?',
    korean: '누구에게?',
    placeholder: 'e.g. my grandmother, my mom...',
    ideas: ['my mom', 'my dad', 'my grandmother', 'my younger brother', 'my family'],
  },
  {
    key: 'what',
    title: 'What do you do?',
    korean: '무엇을?',
    placeholder: 'e.g. carry groceries, wash dishes...',
    ideas: ['wash the dishes', 'carry the groceries', 'clean the table', 'listen carefully'],
  },
  {
    key: 'when',
    title: 'When do you do it?',
    korean: '언제?',
    placeholder: 'e.g. yesterday, after dinner...',
    ideas: ['yesterday', 'after dinner', 'on weekends', 'every day'],
  },
  {
    key: 'feeling',
    title: 'How does it help or feel?',
    korean: '어땠나요?',
    placeholder: 'e.g. she was happy, I felt proud...',
    ideas: ['she was happy', 'I felt proud', 'it helped my family', 'we smiled together'],
  },
];

export function PlanStep({ topic, plan, onChange, onBack, onNext }: PlanStepProps) {
  function appendIdea(key: keyof PlanAnswers, idea: string) {
    const current = plan[key].trim();
    const nextValue = current ? `${current}, ${idea}` : idea;
    onChange({ ...plan, [key]: nextValue });
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col px-4 py-5 pb-28 sm:px-6 sm:pb-10">
      <div className="mb-5">
        <p className="text-xs font-semibold text-blue-600">Step 1 · Plan</p>
        <h1 className="font-display mt-0.5 text-xl font-bold text-slate-900 sm:text-2xl">
          {topic.title}
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">{topic.koreanSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {PLAN_PROMPTS.map((item) => (
          <section
            key={item.key}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div>
              <div className="flex items-baseline justify-between gap-2">
                <label htmlFor={`plan-${item.key}`} className="text-sm font-semibold text-slate-900">
                  {item.title}
                </label>
                <span className="text-xs text-slate-500">{item.korean}</span>
              </div>
              <textarea
                id={`plan-${item.key}`}
                rows={2}
                value={plan[item.key]}
                onChange={(e) => onChange({ ...plan, [item.key]: e.target.value })}
                placeholder={item.placeholder}
                className="mt-2.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="mt-2.5 flex flex-wrap gap-1.5" aria-label={`Quick ideas for ${item.title}`}>
              {item.ideas.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  onClick={() => appendIdea(item.key, idea)}
                  className="min-h-[32px] rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                >
                  + {idea}
                </button>
              ))}
            </div>
          </section>
        ))}
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
            className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 sm:flex-none sm:px-8"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
