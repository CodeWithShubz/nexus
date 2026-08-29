import { useState } from 'react';
import { Megaphone, Send } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';
import type { Priority } from '@/types';

const priorityConfig: Record<Priority, { label: string; variant: 'neutral' | 'warning' | 'danger'; dot: string }> = {
  normal: { label: 'Normal', variant: 'neutral', dot: 'bg-accent-400' },
  important: { label: 'Important', variant: 'warning', dot: 'bg-warning-400' },
  critical: { label: 'Critical', variant: 'danger', dot: 'bg-danger-400' },
};

export function AnnouncementsPage() {
  const { announcements, addAnnouncement, currentUser } = useStore();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [errors, setErrors] = useState<{ title?: string; message?: string }>({});

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!title.trim()) newErrors.title = 'Title is required.';
    if (!message.trim()) newErrors.message = 'Message is required.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    addAnnouncement({
      title: title.trim(),
      message: message.trim(),
      priority,
      author: currentUser?.name ?? 'Organizer',
    });
    toast(`Announcement "${title}" published successfully!`, 'success');
    setTitle('');
    setMessage('');
    setPriority('normal');
    setErrors({});
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Announcement Center</h1>
        <p className="text-sm text-surface-700 mt-1">Publish announcements to all participants in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Compose form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Compose Announcement</CardTitle>
            </CardHeader>
            <CardBody>
              <form onSubmit={handlePublish} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-surface-800 mb-1.5">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
                    placeholder="Announcement title..."
                    className={cn('input', errors.title && 'border-danger-500/50')}
                  />
                  {errors.title && <p className="text-xs text-danger-400 mt-1">{errors.title}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-800 mb-1.5">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => { setMessage(e.target.value); setErrors((p) => ({ ...p, message: undefined })); }}
                    placeholder="Write your announcement..."
                    rows={4}
                    className={cn('input resize-none', errors.message && 'border-danger-500/50')}
                  />
                  {errors.message && <p className="text-xs text-danger-400 mt-1">{errors.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-surface-800 mb-1.5">Priority</label>
                  <div className="flex gap-2">
                    {(Object.keys(priorityConfig) as Priority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={cn(
                          'flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all capitalize',
                          priority === p
                            ? 'bg-surface-300/40 text-surface-900 border-surface-400/60'
                            : 'bg-surface-200 text-surface-700 border-surface-300/40 hover:bg-surface-300/30'
                        )}
                      >
                        {priorityConfig[p].label}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full">
                  <Send className="w-4 h-4" />
                  Publish Announcement
                </button>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Feed */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Announcement Feed ({announcements.length})</CardTitle>
            </CardHeader>
            <CardBody className="!p-0">
              {announcements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-surface-700">
                  <Megaphone className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm">No announcements yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-surface-300/30">
                  {announcements.map((a) => {
                    const cfg = priorityConfig[a.priority];
                    return (
                      <div key={a.id} className="px-5 py-4 hover:bg-surface-200/40 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                            <h4 className="text-sm font-semibold text-surface-900">{a.title}</h4>
                          </div>
                          <Badge variant={cfg.variant} className="capitalize shrink-0">{cfg.label}</Badge>
                        </div>
                        <p className="text-sm text-surface-700 leading-relaxed">{a.message}</p>
                        <p className="text-[11px] text-surface-600 mt-2">{a.createdAt} · by {a.author}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
