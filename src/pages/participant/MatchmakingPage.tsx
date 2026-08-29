import { useState } from 'react';
import { UserPlus, Check, Sparkles, X } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { matchmakingPool } from '@/data/mockData';
import { cn } from '@/utils/cn';

interface Recommendation {
  id: string;
  name: string;
  avatarColor: string;
  skills: string[];
  role: string;
  interests: string[];
  match: number;
}

// Simple mock compatibility: overlap between current user's skills/interests and candidate's.
function computeMatch(userSkills: string[], userInterests: string[], candidate: Recommendation): number {
  const skillOverlap = candidate.skills.filter((s) => userSkills.some((us) => us.toLowerCase() === s.toLowerCase())).length;
  const interestOverlap = candidate.interests.filter((i) => userInterests.some((ui) => ui.toLowerCase() === i.toLowerCase())).length;
  const base = candidate.match;
  const bonus = (skillOverlap * 3) + (interestOverlap * 2);
  return Math.min(99, base + bonus);
}

export function MatchmakingPage() {
  const { currentUser } = useStore();
  const { toast } = useToast();
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Recommendation | null>(null);

  if (!currentUser) return null;

  const recommendations = matchmakingPool
    .map((r) => ({
      ...r,
      avatarColor: currentUser.avatarColor === r.id ? 'cyan' : ['rose', 'teal', 'indigo', 'amber', 'sky'][matchmakingPool.indexOf(r) % 5],
      match: computeMatch(currentUser.skills, currentUser.interests, r as Recommendation),
    }))
    .sort((a, b) => b.match - a.match);

  const handleConnect = (rec: Recommendation) => {
    setConnected((prev) => new Set(prev).add(rec.id));
    toast(`Connection request sent to ${rec.name}!`, 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Smart Matchmaking</h1>
        <p className="text-sm text-surface-700 mt-1">Find teammates based on skills, roles, and project interests.</p>
      </div>

      {/* Your profile summary */}
      <Card>
        <CardBody>
          <div className="flex items-start gap-4 flex-wrap">
            <Avatar name={currentUser.name} color={currentUser.avatarColor} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900">{currentUser.name}</p>
              <p className="text-xs text-surface-700">{currentUser.preferredRole}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentUser.skills.map((s) => (
                  <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-accent-500/10 text-accent-300 border border-accent-500/20">{s}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {currentUser.interests.map((i) => (
                  <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-surface-200 text-surface-700">{i}</span>
                ))}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-accent-400" />
          <h2 className="text-sm font-semibold text-surface-900">Recommended Teammates</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recommendations.map((rec) => {
            const isConnected = connected.has(rec.id);
            return (
              <Card key={rec.id} className="hover:border-surface-400/60 transition-colors">
                <CardBody>
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={rec.name} color={rec.avatarColor} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-surface-900">{rec.name}</p>
                      <p className="text-xs text-surface-700">{rec.role}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={cn(
                        'text-lg font-bold',
                        rec.match >= 80 ? 'text-success-400' : rec.match >= 70 ? 'text-accent-400' : 'text-warning-400'
                      )}>{rec.match}%</p>
                      <p className="text-[10px] text-surface-600 uppercase tracking-wider">Match</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {rec.skills.map((s) => (
                      <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-surface-200 text-surface-700">{s}</span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {rec.interests.map((i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-surface-300/40 text-surface-800">{i}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    {isConnected ? (
                      <span className="flex items-center gap-1.5 text-sm text-success-400 font-medium">
                        <Check className="w-4 h-4" /> Request Sent
                      </span>
                    ) : (
                      <button onClick={() => handleConnect(rec)} className="btn-primary w-full !py-2">
                        <UserPlus className="w-4 h-4" />
                        Connect
                      </button>
                    )}
                    <button onClick={() => setSelected(rec)} className="btn-ghost !px-3 !py-2 text-xs">
                      View
                    </button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Profile detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? selected.name : ''} maxWidth="max-w-md">
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} color={selected.avatarColor} size="lg" />
              <div>
                <p className="text-base font-semibold text-surface-900">{selected.name}</p>
                <p className="text-sm text-surface-700">{selected.role}</p>
                <Badge variant="accent" className="mt-1.5">{selected.match}% Match</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-surface-200 text-surface-800">{s}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-2">Project Interests</p>
              <div className="flex flex-wrap gap-1.5">
                {selected.interests.map((i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-surface-300/40 text-surface-800">{i}</span>
                ))}
              </div>
            </div>
            {connected.has(selected.id) ? (
              <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-success-500/10 border border-success-500/20 text-success-400 text-sm font-medium">
                <Check className="w-4 h-4" /> Connection request sent
              </div>
            ) : (
              <button onClick={() => { handleConnect(selected); setSelected(null); }} className="btn-primary w-full">
                <UserPlus className="w-4 h-4" /> Send Connection Request
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
