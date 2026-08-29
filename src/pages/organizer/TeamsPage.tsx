import { useStore } from '@/store/StoreContext';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { FileCode2, Users } from 'lucide-react';

const statusBadge = {
  submitted: { label: 'Submitted', variant: 'accent' as const },
  evaluated: { label: 'Evaluated', variant: 'success' as const },
  pending: { label: 'Pending', variant: 'neutral' as const },
};

export function TeamsPage() {
  const { teams, users } = useStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Teams</h1>
        <p className="text-sm text-surface-700 mt-1">{teams.length} teams registered for NEXUS HACK 2026.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teams.map((team) => {
          const members = team.memberIds.map((id) => users.find((u) => u.id === id)).filter(Boolean);
          return (
            <Card key={team.id} className="hover:border-surface-400/60 transition-colors">
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-surface-900">{team.name}</h3>
                    <p className="text-xs text-surface-700 mt-0.5">{team.projectName}</p>
                  </div>
                  <Badge variant={statusBadge[team.status].variant}>{statusBadge[team.status].label}</Badge>
                </div>
                <p className="text-xs text-surface-700 line-clamp-2 mb-3">{team.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {team.technologies.map((t) => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-surface-200 text-surface-700">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {members.slice(0, 4).map((m) => m && <Avatar key={m.id} name={m.name} color={m.avatarColor} size="sm" />)}
                    {members.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-surface-300 flex items-center justify-center text-[10px] font-semibold text-surface-800 border-2 border-surface-100">
                        +{members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-surface-700">
                    <Users className="w-3.5 h-3.5" />
                    {members.length} {members.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
