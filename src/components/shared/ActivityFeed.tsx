import { CheckCircle2, Upload, Gavel, Megaphone, UserPlus, Activity as ActivityIcon } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { timeAgo } from '@/utils/cn';

const iconMap: Record<string, typeof CheckCircle2> = {
  'check-circle': CheckCircle2,
  upload: Upload,
  gavel: Gavel,
  megaphone: Megaphone,
  'user-plus': UserPlus,
};

export function ActivityFeed({ maxItems = 8 }: { maxItems?: number }) {
  const { activity } = useStore();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Live Activity</CardTitle>
      </CardHeader>
      <CardBody className="!p-0">
        {activity.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-surface-700">
            <ActivityIcon className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">No activity yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-300/30">
            {activity.slice(0, maxItems).map((act) => {
              const Icon = iconMap[act.icon] ?? ActivityIcon;
              return (
                <div key={act.id} className="flex items-start gap-3 px-5 py-3 hover:bg-surface-200/40 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-surface-300/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5 text-surface-800" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-surface-900">{act.message}</p>
                    <p className="text-[11px] text-surface-600 mt-0.5">{timeAgo(act.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
