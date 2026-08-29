import { Megaphone } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

const priorityVariant = {
  normal: 'neutral',
  important: 'warning',
  critical: 'danger',
} as const;

export function RecentAnnouncements({ maxItems = 4 }: { maxItems?: number }) {
  const { announcements } = useStore();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Announcements</CardTitle>
      </CardHeader>
      <CardBody className="!p-0">
        {announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-surface-700">
            <Megaphone className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No announcements yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-300/30">
            {announcements.slice(0, maxItems).map((a) => (
              <div key={a.id} className="px-5 py-3.5 hover:bg-surface-200/40 transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-surface-900 truncate">{a.title}</p>
                  <Badge variant={priorityVariant[a.priority]} className="capitalize shrink-0">{a.priority}</Badge>
                </div>
                <p className="text-xs text-surface-700 line-clamp-2">{a.message}</p>
                <p className="text-[10px] text-surface-600 mt-1.5">{a.createdAt} · {a.author}</p>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
