import { Megaphone } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

const priorityConfig = {
  normal: { label: 'Normal', variant: 'neutral' as const, dot: 'bg-accent-400' },
  important: { label: 'Important', variant: 'warning' as const, dot: 'bg-warning-400' },
  critical: { label: 'Critical', variant: 'danger' as const, dot: 'bg-danger-400' },
};

export function ParticipantAnnouncementsPage() {
  const { announcements } = useStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Announcements</h1>
        <p className="text-sm text-surface-700 mt-1">Stay updated with the latest from the organizers.</p>
      </div>

      {announcements.length === 0 ? (
        <Card>
          <CardBody>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Megaphone className="w-12 h-12 text-surface-600 mb-3" />
              <p className="text-sm text-surface-700">No announcements yet. Check back later.</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const cfg = priorityConfig[a.priority];
            return (
              <Card key={a.id} className="hover:border-surface-400/60 transition-colors">
                <CardBody>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                      <h3 className="text-sm font-semibold text-surface-900">{a.title}</h3>
                    </div>
                    <Badge variant={cfg.variant} className="capitalize shrink-0">{cfg.label}</Badge>
                  </div>
                  <p className="text-sm text-surface-700 leading-relaxed">{a.message}</p>
                  <p className="text-[11px] text-surface-600 mt-3">{a.createdAt} · by {a.author}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
