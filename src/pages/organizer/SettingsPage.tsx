import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EVENT } from '@/data/mockData';

export function SettingsPage() {
  const { currentUser } = useStore();
  if (!currentUser) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Settings</h1>
        <p className="text-sm text-surface-700 mt-1">Manage your account and event configuration.</p>
      </div>

      <Card>
        <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
        <CardBody>
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={currentUser.name} color={currentUser.avatarColor} size="lg" />
            <div>
              <p className="text-base font-semibold text-surface-900">{currentUser.name}</p>
              <p className="text-sm text-surface-700">{currentUser.email}</p>
              <Badge variant="accent" className="mt-1.5 capitalize">{currentUser.role}</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Full Name</label>
              <input type="text" defaultValue={currentUser.name} className="input" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Email</label>
              <input type="email" defaultValue={currentUser.email} className="input" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Preferred Role</label>
              <input type="text" defaultValue={currentUser.preferredRole} className="input" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Skills</label>
              <input type="text" defaultValue={currentUser.skills.join(', ')} className="input" readOnly />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader><CardTitle>Event Configuration</CardTitle></CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Event Name</label>
              <input type="text" defaultValue={EVENT.name} className="input" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Location</label>
              <input type="text" defaultValue={EVENT.location} className="input" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Dates</label>
              <input type="text" defaultValue={EVENT.dates} className="input" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Status</label>
              <input type="text" defaultValue={EVENT.status} className="input" readOnly />
            </div>
          </div>
          <p className="text-xs text-surface-600 mt-4">Event configuration is read-only in this prototype.</p>
        </CardBody>
      </Card>
    </div>
  );
}
