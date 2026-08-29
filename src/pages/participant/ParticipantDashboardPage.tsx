import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Circle, Calendar, Megaphone, Users, FileCode2, MapPin } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EVENT, schedule } from '@/data/mockData';
import { cn } from '@/utils/cn';

export function ParticipantDashboardPage() {
  const { currentUser, users, teams, announcements } = useStore();
  if (!currentUser) return null;

  const team = teams.find((t) => t.id === currentUser.teamId);
  const teammates = team ? team.memberIds.map((id) => users.find((u) => u.id === id)).filter((u) => u && u.id !== currentUser.id) : [];

  // QR payload — would be scanned by the organizer's scanner.
  const qrValue = JSON.stringify({
    eventId: 'nexus-hack-2026',
    userId: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-surface-900">Welcome, {currentUser.name.split(' ')[0]}!</h1>
        <p className="text-sm text-surface-700 mt-1">{EVENT.name} · {EVENT.location} · {EVENT.dates}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* QR Code — prominent */}
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Check-in QR Code</CardTitle></CardHeader>
          <CardBody className="flex flex-col items-center gap-4">
            <div className={cn(
              'p-5 rounded-xl border-2',
              currentUser.checkedIn ? 'bg-success-500/5 border-success-500/30' : 'bg-surface-200 border-surface-400/40'
            )}>
              <QRCodeSVG
                value={qrValue}
                size={180}
                bgColor="#161922"
                fgColor="#a8aec6"
                level="M"
                includeMargin={false}
              />
            </div>
            {currentUser.checkedIn ? (
              <div className="flex items-center gap-2 text-success-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-semibold">CHECKED IN</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-surface-700">
                <Circle className="w-5 h-5" />
                <span className="text-sm font-semibold">Not Checked In</span>
              </div>
            )}
            <p className="text-[11px] text-surface-600 text-center max-w-xs">
              Present this code at the registration desk to check in.
            </p>
          </CardBody>
        </Card>

        {/* Event info + status */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Event Information</CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="p-3 rounded-lg bg-surface-200/50 border border-surface-300/40">
                <div className="flex items-center gap-2 text-surface-700 mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider">Location</span>
                </div>
                <p className="text-sm font-semibold text-surface-900">{EVENT.location}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-200/50 border border-surface-300/40">
                <div className="flex items-center gap-2 text-surface-700 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] uppercase tracking-wider">Dates</span>
                </div>
                <p className="text-sm font-semibold text-surface-900">{EVENT.dates}</p>
              </div>
            </div>

            {/* Team info */}
            {team ? (
              <div className="p-4 rounded-lg bg-accent-500/5 border border-accent-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-accent-400" />
                  <span className="text-sm font-semibold text-surface-900">Your Team: {team.name}</span>
                  <Badge variant="accent" className="ml-auto">{team.projectName}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {teammates.map((m) => m && (
                    <div key={m.id} className="flex items-center gap-2">
                      <Avatar name={m.name} color={m.avatarColor} size="sm" />
                      <span className="text-xs text-surface-800">{m.name}</span>
                    </div>
                  ))}
                  {teammates.length === 0 && <span className="text-xs text-surface-700">Solo team</span>}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-surface-200/50 border border-surface-300/40">
                <p className="text-sm text-surface-700">You haven't joined a team yet. Visit Matchmaking to find teammates.</p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Schedule + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Schedule</CardTitle></CardHeader>
          <CardBody className="!p-0">
            <div className="divide-y divide-surface-300/30">
              {schedule.map((item) => (
                <div key={item.time} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-xs font-mono text-surface-700 w-12 shrink-0">{item.time}</span>
                  <span className="text-sm text-surface-900 flex-1">{item.title}</span>
                  {item.status === 'done' && <span className="text-[11px] text-surface-600">Done</span>}
                  {item.status === 'live' && (
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-success-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse-ring" />LIVE
                    </span>
                  )}
                  {item.status === 'upcoming' && <span className="text-[11px] text-surface-700">Upcoming</span>}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-surface-700" />
              <CardTitle>Announcements</CardTitle>
            </div>
          </CardHeader>
          <CardBody className="!p-0">
            {announcements.length === 0 ? (
              <div className="py-10 text-center text-sm text-surface-700">No announcements yet.</div>
            ) : (
              <div className="divide-y divide-surface-300/30 max-h-80 overflow-y-auto">
                {announcements.slice(0, 5).map((a) => (
                  <div key={a.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-surface-900">{a.title}</p>
                      <Badge variant={a.priority === 'critical' ? 'danger' : a.priority === 'important' ? 'warning' : 'neutral'} className="capitalize">{a.priority}</Badge>
                    </div>
                    <p className="text-xs text-surface-700">{a.message}</p>
                    <p className="text-[10px] text-surface-600 mt-1">{a.createdAt}</p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
