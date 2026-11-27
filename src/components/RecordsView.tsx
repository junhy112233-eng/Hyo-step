import { useMemo, useState } from 'react';
import { BookOpen, Eye, Loader2, Search } from 'lucide-react';
import type { UserSession, WritingRecord } from '../types/hyo.ts';

interface RecordsViewProps {
  mode: 'mine' | 'teacher';
  session: UserSession | null;
  records: WritingRecord[];
  loading: boolean;
  onOpenSignIn: () => void;
  onStartWriting: () => void;
}

function formatRecordDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function RecordsView({
  mode,
  session,
  records,
  loading,
  onOpenSignIn,
  onStartWriting,
}: RecordsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | '1' | '2' | '3'>('all');

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((rec) => {
      if (levelFilter !== 'all' && String(rec.supportLevel) !== levelFilter) {
        return false;
      }
      if (!q) return true;
      return (
        rec.studentName.toLowerCase().includes(q) ||
        rec.topicTitle.toLowerCase().includes(q) ||
        rec.finalText.toLowerCase().includes(q)
      );
    });
  }, [records, searchQuery, levelFilter]);

  if (!session) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-blue-600" aria-hidden="true" />
          <h1 className="font-display mt-3 text-xl font-bold text-slate-900">
            Sign in to view your records
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Your saved drafts, rewrites, and reflection notes are kept under your account.
          </p>
          <button
            type="button"
            onClick={onOpenSignIn}
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Sign in
          </button>
        </div>
      </main>
    );
  }

  const isTeacherView = mode === 'teacher' && session.isTeacher;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
            {isTeacherView && <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
            <span>{isTeacherView ? 'Teacher View · Read-Only' : 'Student Portfolio'}</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {isTeacherView ? 'All Student Writing Records' : 'My Writing Records'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isTeacherView
              ? 'Read-only overview of student drafts, final rewrites, support levels, and hints used.'
              : 'Review your first drafts, final rewrites, and what you learned each time.'}
          </p>
        </div>

        {!isTeacherView && (
          <button
            type="button"
            onClick={onStartWriting}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            New Writing
          </button>
        )}
      </div>

      {/* Filters */}
      {records.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isTeacherView ? 'Search student or topic...' : 'Search topic or text...'}
              className="min-h-[44px] w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div
            className="flex items-center gap-1 rounded-xl bg-slate-100 p-1"
            role="group"
            aria-label="Filter by support level"
          >
            {(['all', '1', '2', '3'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={`min-h-[36px] rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  levelFilter === lvl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl === 'all' ? 'All Levels' : `Level ${lvl}`}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" aria-hidden="true" />
          <span>Loading records...</span>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-base font-semibold text-slate-900">No saved records yet</p>
          <p className="mt-1 text-sm text-slate-600">
            {isTeacherView
              ? 'Student writing records will appear here once students complete Step 5 and save.'
              : 'Complete the 5 writing steps and click Save on Step 5 to see your record here.'}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {filteredRecords.map((rec) => (
            <article
              key={rec.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              {/* Unboxed Metadata Row */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-display text-base font-semibold text-slate-900">
                    {rec.topicTitle}
                  </h2>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-slate-500">
                    {isTeacherView && (
                      <>
                        <span className="font-semibold text-slate-800">{rec.studentName}</span>
                        <span aria-hidden="true">·</span>
                      </>
                    )}
                    <span className="font-tabular">{formatRecordDate(rec.date)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-tabular">Level {rec.supportLevel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-tabular">
                      {rec.hintsUsed} {rec.hintsUsed === 1 ? 'hint' : 'hints'} (Hint {rec.maxHintLevel})
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-slate-500">First Draft</p>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {rec.firstDraft}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-emerald-700">Final Text</p>
                  <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-slate-900">
                    {rec.finalText}
                  </p>
                </div>
              </div>

              {rec.whatIChanged && (
                <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">What the student changed: </span>
                  {rec.whatIChanged}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
