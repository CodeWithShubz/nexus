import { Users, CheckCircle2, UsersRound, FileCode2 } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { KpiCard } from '@/components/shared/KpiCard';
import { ActivityFeed } from '@/components/shared/ActivityFeed';
import { RecentAnnouncements } from '@/components/shared/RecentAnnouncements';
import { EventPulse } from '@/components/shared/EventPulse';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { attendanceData, submissionProgressData, schedule } from '@/data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';

const tooltipStyle = {
  backgroundColor: '#11131a',
  border: '1px solid #252a3d',
  borderRadius: '8px',
  fontSize: '12px',
  color: '#a8aec6',
};

export function OverviewPage() {
  const { stats } = useStore();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Command Center</h1>
        <p className="text-sm text-surface-700 mt-1">Real-time overview of NEXUS HACK 2026.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Attendees" value={stats.attendees.toLocaleString()} icon={<Users className="w-5 h-5" />} accent="accent" trend="+24 today" />
        <KpiCard label="Checked In" value={stats.checkedIn.toLocaleString()} icon={<CheckCircle2 className="w-5 h-5" />} accent="success" trend={`${Math.round((stats.checkedIn / stats.attendees) * 100)}% of total`} />
        <KpiCard label="Teams" value={stats.teams} icon={<UsersRound className="w-5 h-5" />} accent="neutral" trend="186 registered" />
        <KpiCard label="Submissions" value={stats.submissions} icon={<FileCode2 className="w-5 h-5" />} accent="warning" trend="142 expected" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Attendance</CardTitle>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="checkedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2030" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#5b6385' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5b6385' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="checked" stroke="#22d3ee" strokeWidth={2} fill="url(#checkedGrad)" name="Checked In" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission Progress</CardTitle>
          </CardHeader>
          <CardBody>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={submissionProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c2030" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#5b6385' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#5b6385' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="submissions" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Submissions" />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* Pulse + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <EventPulse />
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Event Schedule</CardTitle>
          </CardHeader>
          <CardBody className="!p-0">
            <div className="divide-y divide-surface-300/30">
              {schedule.map((item) => (
                <div key={item.time} className="flex items-center gap-4 px-5 py-3">
                  <span className="text-xs font-mono text-surface-700 w-12 shrink-0">{item.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-surface-900">{item.title}</p>
                  </div>
                  {item.status === 'done' && <span className="text-xs text-surface-600">Completed</span>}
                  {item.status === 'live' && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-success-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse-ring" />
                      LIVE
                    </span>
                  )}
                  {item.status === 'upcoming' && <span className="text-xs text-surface-700">Upcoming</span>}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Activity + Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActivityFeed />
        <RecentAnnouncements />
      </div>
    </div>
  );
}
