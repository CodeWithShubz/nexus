import { useState, useMemo } from 'react';
import { Search, QrCode, CheckCircle2, Circle, X } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';
import type { User } from '@/types';

type Filter = 'all' | 'checked-in' | 'not-checked-in' | 'judges' | 'mentors' | 'participants';

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'checked-in', label: 'Checked In' },
  { id: 'not-checked-in', label: 'Not Checked In' },
  { id: 'judges', label: 'Judges' },
  { id: 'mentors', label: 'Mentors' },
  { id: 'participants', label: 'Participants' },
];

const roleBadge = {
  organizer: { label: 'Organizer', variant: 'accent' as const },
  judge: { label: 'Judge', variant: 'warning' as const },
  participant: { label: 'Participant', variant: 'neutral' as const },
};

export function AttendeesPage() {
  const { users, checkIn } = useStore();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [scannerOpen, setScannerOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = users;
    if (filter === 'checked-in') list = list.filter((u) => u.checkedIn);
    else if (filter === 'not-checked-in') list = list.filter((u) => !u.checkedIn);
    else if (filter === 'judges') list = list.filter((u) => u.role === 'judge');
    else if (filter === 'mentors') list = list.filter((u) => u.preferredRole === 'Mentor');
    else if (filter === 'participants') list = list.filter((u) => u.role === 'participant');

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.skills.some((s) => s.toLowerCase().includes(q)));
    }
    return list;
  }, [users, filter, search]);

  const handleScan = (user: User) => {
    if (user.checkedIn) {
      toast(`${user.name} is already checked in.`, 'info');
    } else {
      checkIn(user.id);
      toast(`${user.name} checked in successfully!`, 'success');
    }
    setScannerOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Attendees</h1>
          <p className="text-sm text-surface-700 mt-1">{users.length} registered · {users.filter((u) => u.checkedIn).length} checked in</p>
        </div>
        <button onClick={() => setScannerOpen(true)} className="btn-primary">
          <QrCode className="w-4 h-4" />
          Scan QR
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700" />
          <input
            type="text"
            placeholder="Search by name, email, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === f.id
                ? 'bg-accent-500/10 text-accent-300 border border-accent-500/20'
                : 'bg-surface-100 text-surface-700 border border-surface-300/50 hover:bg-surface-200'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-300/50">
                <th className="text-left text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3">Name</th>
                <th className="text-left text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Role</th>
                <th className="text-left text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Skills</th>
                <th className="text-left text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3">Check-in</th>
                <th className="text-left text-[11px] font-semibold text-surface-700 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-300/30">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-surface-700">No attendees match your filters.</td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-200/40 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} color={u.avatarColor} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-surface-900 truncate">{u.name}</p>
                          <p className="text-xs text-surface-700 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <Badge variant={roleBadge[u.role].variant}>{roleBadge[u.role].label}</Badge>
                    </td>
                    <td className="px-5 py-3 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {u.skills.slice(0, 3).map((s) => (
                          <span key={s} className="text-[11px] px-2 py-0.5 rounded bg-surface-200 text-surface-700">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {u.checkedIn ? (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-success-400">
                          <CheckCircle2 className="w-4 h-4" /> Checked In
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-surface-700">
                          <Circle className="w-4 h-4" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-xs text-surface-700 font-mono">{u.checkInTime ?? '—'}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* QR Scanner Modal */}
      <QrScannerModal open={scannerOpen} onClose={() => setScannerOpen(false)} onScan={handleScan} users={users} />
    </div>
  );
}

// Simulated QR scanner — cycles through un-checked-in attendees.
function QrScannerModal({ open, onClose, onScan, users }: { open: boolean; onClose: () => void; onScan: (u: User) => void; users: User[] }) {
  const [scanning, setScanning] = useState(false);
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  const pendingUsers = users.filter((u) => !u.checkedIn && u.role === 'participant');

  const simulateScan = () => {
    setScanning(true);
    setScannedUser(null);
    setTimeout(() => {
      const target = pendingUsers[Math.floor(Math.random() * pendingUsers.length)] ?? users[0];
      setScannedUser(target);
      setScanning(false);
    }, 1500);
  };

  return (
    <Modal open={open} onClose={onClose} title="QR Check-in Scanner" maxWidth="max-w-md">
      <div className="space-y-4">
        {/* Scanner viewport */}
        <div className="relative aspect-square w-full max-w-xs mx-auto rounded-xl bg-surface-200 border-2 border-surface-400/40 overflow-hidden">
          {/* Corner brackets */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-accent-500 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-accent-500 rounded-tr-lg" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-accent-500 rounded-bl-lg" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-accent-500 rounded-br-lg" />

          {scanning && (
            <div className="absolute inset-x-4 top-0 bottom-0">
              <div className="absolute left-0 right-0 h-0.5 bg-accent-400 shadow-glow animate-[pulseRing_1.5s_ease-in-out_infinite]" style={{ top: '50%' }} />
            </div>
          )}

          {scannedUser ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
              <CheckCircle2 className="w-12 h-12 text-success-400" />
              <Avatar name={scannedUser.name} color={scannedUser.avatarColor} size="lg" />
              <div className="text-center">
                <p className="text-sm font-semibold text-surface-900">{scannedUser.name}</p>
                <p className="text-xs text-surface-700">{scannedUser.email}</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <QrCode className={cn('w-16 h-16 text-surface-600', scanning && 'animate-pulse')} />
            </div>
          )}
        </div>

        {scannedUser ? (
          <div className="space-y-3">
            <div className="text-center">
              <Badge variant="success">Scan Successful</Badge>
            </div>
            <button onClick={() => onScan(scannedUser)} className="btn-primary w-full">
              <CheckCircle2 className="w-4 h-4" />
              Confirm Check-in
            </button>
          </div>
        ) : (
          <button onClick={simulateScan} disabled={scanning} className="btn-primary w-full">
            {scanning ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-surface-0/30 border-t-surface-0 rounded-full animate-spin" />
                Scanning...
              </span>
            ) : (
              <>
                <QrCode className="w-4 h-4" />
                Start Scan
              </>
            )}
          </button>
        )}

        <p className="text-[11px] text-surface-600 text-center">
          {pendingUsers.length} attendees awaiting check-in.
        </p>
      </div>
    </Modal>
  );
}
