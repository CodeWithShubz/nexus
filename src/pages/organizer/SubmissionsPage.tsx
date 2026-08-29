import { useState } from 'react';
import { FileCode2, ChevronRight } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import type { Team } from '@/types';

const statusBadge = {
  submitted: { label: 'Submitted', variant: 'accent' as const },
  evaluated: { label: 'Evaluated', variant: 'success' as const },
  pending: { label: 'Pending', variant: 'neutral' as const },
};

export function SubmissionsPage() {
  const { teams, users, evaluations } = useStore();
  const [selected, setSelected] = useState<Team | null>(null);

  const submitted = teams.filter((t) => t.status !== 'pending');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Submissions</h1>
        <p className="text-sm text-surface-700 mt-1">{submitted.length} projects submitted.</p>
      </div>

      <div className="space-y-3">
        {submitted.map((team) => {
          const members = team.memberIds.map((id) => users.find((u) => u.id === id)).filter(Boolean);
          const teamEvals = evaluations.filter((e) => e.submissionId === team.id);
          return (
            <Card key={team.id} className="hover:border-surface-400/60 transition-colors cursor-pointer" >
              <button onClick={() => setSelected(team)} className="w-full text-left">
                <CardBody>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center shrink-0">
                        <FileCode2 className="w-5 h-5 text-accent-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-surface-900">{team.name}</h3>
                          <Badge variant={statusBadge[team.status].variant}>{statusBadge[team.status].label}</Badge>
                          {teamEvals.length > 0 && <span className="text-[11px] text-surface-600">{teamEvals.length} evaluation{teamEvals.length > 1 ? 's' : ''}</span>}
                        </div>
                        <p className="text-xs text-surface-700 mt-0.5 truncate">{team.projectName} — {team.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {team.technologies.map((t) => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-surface-200 text-surface-700">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex -space-x-2">
                        {members.slice(0, 3).map((m) => m && <Avatar key={m.id} name={m.name} color={m.avatarColor} size="sm" />)}
                      </div>
                      <ChevronRight className="w-5 h-5 text-surface-700" />
                    </div>
                  </div>
                </CardBody>
              </button>
            </Card>
          );
        })}
      </div>

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.name} — ${selected.projectName}` : ''} maxWidth="max-w-2xl">
        {selected && (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-sm text-surface-900 leading-relaxed">{selected.description}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">Technologies</h4>
              <div className="flex flex-wrap gap-1.5">
                {selected.technologies.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-surface-200 text-surface-800">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">Team Members</h4>
              <div className="space-y-2">
                {selected.memberIds.map((id) => {
                  const m = users.find((u) => u.id === id);
                  if (!m) return null;
                  return (
                    <div key={id} className="flex items-center gap-3">
                      <Avatar name={m.name} color={m.avatarColor} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-surface-900">{m.name}</p>
                        <p className="text-xs text-surface-700">{m.preferredRole}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">Evaluations</h4>
              {evaluations.filter((e) => e.submissionId === selected.id).length === 0 ? (
                <p className="text-sm text-surface-700">No evaluations yet.</p>
              ) : (
                <div className="space-y-2">
                  {evaluations.filter((e) => e.submissionId === selected.id).map((e) => {
                    const total = e.scores.innovation + e.scores.technical + e.scores.impact + e.scores.presentation;
                    return (
                      <div key={e.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-200/50 border border-surface-300/40">
                        <div>
                          <p className="text-sm font-medium text-surface-900">{e.judgeName}</p>
                          <p className="text-xs text-surface-700">{e.feedback}</p>
                        </div>
                        <span className="text-lg font-bold text-accent-400">{total.toFixed(1)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
