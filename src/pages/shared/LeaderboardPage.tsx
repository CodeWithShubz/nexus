import { useState } from 'react';
import { Trophy, TrendingUp, TrendingDown, Minus, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';
import type { LeaderboardEntry } from '@/types';

const rankStyles = [
  'bg-warning-500/15 text-warning-400 border-warning-500/30',
  'bg-surface-400/30 text-surface-900 border-surface-400/40',
  'bg-orange-500/15 text-orange-400 border-orange-500/30',
];

const rubricLabels = [
  { key: 'innovation', label: 'Innovation', max: 25 },
  { key: 'technical', label: 'Technical Excellence', max: 25 },
  { key: 'impact', label: 'Impact', max: 25 },
  { key: 'presentation', label: 'Presentation', max: 25 },
] as const;

export function LeaderboardPage() {
  const { leaderboard } = useStore();
  const [selected, setSelected] = useState<LeaderboardEntry | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Live Leaderboard</h1>
        <p className="text-sm text-surface-700 mt-1">Rankings update in real-time as judges submit evaluations.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-300/50">
                <th className="text-left text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3 w-16">Rank</th>
                <th className="text-left text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3">Team</th>
                <th className="text-left text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Project</th>
                <th className="text-right text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3">Score</th>
                <th className="text-center text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Evals</th>
                <th className="text-right text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3">Trend</th>
                <th className="w-10 px-2"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-300/30">
              {leaderboard.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-surface-700">No evaluations submitted yet.</td></tr>
              ) : (
                leaderboard.map((entry, i) => (
                  <tr
                    key={entry.teamId}
                    onClick={() => setSelected(entry)}
                    className="hover:bg-surface-200/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold border',
                        i < 3 ? rankStyles[i] : 'bg-surface-200 text-surface-700 border-surface-300/40'
                      )}>
                        {i + 1}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-surface-900">{entry.teamName}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <p className="text-xs text-surface-700 truncate max-w-xs">{entry.projectName}</p>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="text-base font-bold text-surface-900">{entry.total.toFixed(1)}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell text-center">
                      <span className="text-xs text-surface-700">{entry.evaluations}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {entry.trend === 'up' ? <TrendingUp className="w-4 h-4 text-success-400 inline" /> :
                       entry.trend === 'down' ? <TrendingDown className="w-4 h-4 text-danger-400 inline" /> :
                       <Minus className="w-4 h-4 text-surface-600 inline" />}
                    </td>
                    <td className="px-2 py-3.5">
                      <ChevronRight className="w-4 h-4 text-surface-700 group-hover:text-surface-900 transition-colors" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Score breakdown modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.teamName} — Score Breakdown` : ''} maxWidth="max-w-lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-accent-500/10 border border-accent-500/20">
              <div>
                <p className="text-xs text-surface-700 uppercase tracking-wider">Total Score</p>
                <p className="text-3xl font-bold text-accent-400 mt-1">{selected.total.toFixed(1)}</p>
              </div>
              <Trophy className="w-10 h-10 text-accent-400/60" />
            </div>

            <div className="space-y-3">
              {rubricLabels.map((r) => {
                const score = selected.scores[r.key];
                const pct = (score / r.max) * 100;
                return (
                  <div key={r.key}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-surface-800">{r.label}</span>
                      <span className="text-sm font-semibold text-surface-900">{score.toFixed(1)}<span className="text-surface-600">/{r.max}</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-300/40 overflow-hidden">
                      <div className="h-full rounded-full bg-accent-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Badge variant="neutral">{selected.evaluations} evaluation{selected.evaluations !== 1 ? 's' : ''}</Badge>
              <Badge variant="accent">{selected.projectName}</Badge>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
