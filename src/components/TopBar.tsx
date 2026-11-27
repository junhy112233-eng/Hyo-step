import { Home, LogOut, User } from 'lucide-react';
import type { AppScreen, SupportLevel, UserSession, WritingStep } from '../types/hyo.ts';

interface TopBarProps {
  screen: AppScreen;
  step: WritingStep;
  supportLevel: SupportLevel;
  session: UserSession | null;
  onNavigate: (screen: AppScreen) => void;
  onGoHome: () => void;
  onSelectStep: (step: WritingStep) => void;
  onOpenSignIn: () => void;
  onSignOut: () => void;
}

const STEP_LABELS: Array<{ id: WritingStep; label: string }> = [
  { id: 1, label: 'Plan' },
  { id: 2, label: 'Draft' },
  { id: 3, label: 'Hint' },
  { id: 4, label: 'Rewrite' },
  { id: 5, label: 'Finish' },
];

export function TopBar({
  screen,
  step,
  supportLevel,
  session,
  onNavigate,
  onGoHome,
  onOpenSignIn,
  onSignOut,
}: TopBarProps) {
  if (screen === 'writing') {
    return (
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <button
            type="button"
            onClick={onGoHome}
            aria-label="Go to Home"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline whitespace-nowrap">Home</span>
          </button>

          <nav aria-label="Writing steps" className="flex flex-1 items-center justify-center gap-1.5 sm:gap-2.5">
            {STEP_LABELS.map((item) => {
              const isCurrent = item.id === step;
              const isDone = item.id < step;
              return (
                <div
                  key={item.id}
                  aria-current={isCurrent ? 'step' : undefined}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold font-tabular transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {item.id}
                  </span>
                  <span
                    className={`hidden text-xs font-medium whitespace-nowrap md:inline ${
                      isCurrent ? 'text-slate-900' : isDone ? 'text-emerald-700' : 'text-slate-500'
                    }`}
                  >
                    {item.label}
                  </span>
                  {item.id < 5 && (
                    <span
                      aria-hidden="true"
                      className={`hidden h-px w-3 sm:inline-block lg:w-5 ${
                        isDone ? 'bg-emerald-400' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="shrink-0 text-right">
            <span className="inline-flex min-h-[36px] items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-800 whitespace-nowrap font-tabular">
              Level {supportLevel}
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:gap-8 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate('start')}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          HYO Steps
        </button>

        <nav aria-label="Main navigation" className="flex items-center gap-5 sm:gap-6">
          <button
            type="button"
            onClick={() => onNavigate('start')}
            className={`min-h-[44px] text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              screen === 'start'
                ? 'text-blue-600 underline decoration-2 underline-offset-8'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => onNavigate('records')}
            className={`min-h-[44px] text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
              screen === 'records'
                ? 'text-blue-600 underline decoration-2 underline-offset-8'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Records
          </button>
          {session?.isTeacher && (
            <button
              type="button"
              onClick={() => onNavigate('teacher')}
              className={`min-h-[44px] text-sm font-medium whitespace-nowrap shrink-0 transition-colors ${
                screen === 'teacher'
                  ? 'text-blue-600 underline decoration-2 underline-offset-8'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Teacher View
            </button>
          )}
        </nav>

        <div className="flex items-center shrink-0">
          {session ? (
            <button
              type="button"
              onClick={onSignOut}
              title={`Signed in as ${session.email}. Click to sign out.`}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 whitespace-nowrap shrink-0 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <User className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span className="max-w-[96px] truncate sm:max-w-[140px]">{session.name}</span>
              <LogOut className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenSignIn}
              className="inline-flex min-h-[44px] items-center rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap shrink-0 transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
