import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, LogOut, ChevronDown, Zap } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { EVENT } from '@/data/mockData';
import { cn } from '@/utils/cn';

interface TopbarProps {
  onOpenMobile: () => void;
  onSwitchRole: (role: 'organizer' | 'judge' | 'participant') => void;
}

export function Topbar({ onOpenMobile, onSwitchRole }: TopbarProps) {
  const { currentUser, logout, switchRole, announcements } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!currentUser) return null;

  const roleBadge = {
    organizer: { label: 'Organizer', variant: 'accent' as const },
    judge: { label: 'Judge', variant: 'warning' as const },
    participant: { label: 'Participant', variant: 'neutral' as const },
  }[currentUser.role];

  return (
    <header className="sticky top-0 z-20 h-16 bg-surface-50/80 backdrop-blur-md border-b border-surface-300/50 flex items-center justify-between px-4 lg:px-6">
      {/* Left: mobile menu + event name */}
      <div className="flex items-center gap-3">
        <button onClick={onOpenMobile} className="lg:hidden text-surface-700 hover:text-surface-900">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5">
          <h1 className="text-sm font-semibold text-surface-900">{EVENT.name}</h1>
          <Badge variant="success" className="!py-0">
            <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse-ring" />
            {EVENT.status}
          </Badge>
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2">
        {/* Demo role switcher */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-warning-500/10 border border-warning-500/20">
          <Zap className="w-3.5 h-3.5 text-warning-400" />
          <span className="text-[11px] font-medium text-warning-400">DEMO</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="relative p-2 rounded-lg text-surface-700 hover:bg-surface-200 hover:text-surface-900 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-500 ring-2 ring-surface-50" />
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-surface-100 border border-surface-300/60 rounded-xl shadow-elevated animate-slide-up overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-300/50">
                <p className="text-sm font-semibold text-surface-900">Notifications</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {announcements.slice(0, 5).map((a) => (
                  <div key={a.id} className="px-4 py-3 border-b border-surface-300/30 hover:bg-surface-200/50 transition-colors">
                    <div className="flex items-start gap-2">
                      <span className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0',
                        a.priority === 'critical' ? 'bg-danger-400' : a.priority === 'important' ? 'bg-warning-400' : 'bg-accent-400')} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-surface-900 truncate">{a.title}</p>
                        <p className="text-xs text-surface-700 mt-0.5 line-clamp-2">{a.message}</p>
                        <p className="text-[10px] text-surface-600 mt-1">{a.createdAt}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-lg hover:bg-surface-200 transition-colors"
          >
            <Avatar name={currentUser.name} color={currentUser.avatarColor} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-surface-900">{currentUser.name}</p>
              <p className="text-[10px] text-surface-700">{roleBadge.label}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-surface-700 hidden sm:block" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-14 w-64 bg-surface-100 border border-surface-300/60 rounded-xl shadow-elevated animate-slide-up overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-300/50">
                <div className="flex items-center gap-3">
                  <Avatar name={currentUser.name} color={currentUser.avatarColor} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-900 truncate">{currentUser.name}</p>
                    <p className="text-xs text-surface-700 truncate">{currentUser.email}</p>
                  </div>
                </div>
                <div className="mt-2.5">
                  <Badge variant={roleBadge.variant}>{roleBadge.label}</Badge>
                </div>
              </div>
              <div className="p-2">
                <p className="px-2 py-1.5 text-[10px] font-semibold text-surface-600 uppercase tracking-wider">Demo Role Switch</p>
                {(['organizer', 'judge', 'participant'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => { switchRole(r); onSwitchRole(r); setMenuOpen(false); }}
                    className={cn(
                      'w-full text-left px-2 py-2 rounded-lg text-sm capitalize transition-colors',
                      currentUser.role === r ? 'bg-accent-500/10 text-accent-300' : 'text-surface-800 hover:bg-surface-200'
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="p-2 border-t border-surface-300/50">
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-danger-400 hover:bg-danger-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
