import { navItems } from '@/config/navigation';
import { useStore } from '@/store/StoreContext';
import { cn } from '@/utils/cn';
import { EVENT } from '@/data/mockData';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ activePage, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  const { currentUser } = useStore();
  if (!currentUser) return null;

  const items = navItems.filter((item) => item.roles.includes(currentUser.role));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={onCloseMobile} />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-surface-50 border-r border-surface-300/50 flex flex-col transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-surface-300/50">
          <div className="w-8 h-8 rounded-lg bg-accent-500 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
              <path d="M9 22V10l14 12V10" stroke="#08090c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-surface-900 tracking-tight">NEXUS</p>
            <p className="text-[10px] text-surface-700 uppercase tracking-wider">Command Center</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-accent-500/10 text-accent-300 border border-accent-500/20'
                    : 'text-surface-800 hover:bg-surface-200 hover:text-surface-900 border border-transparent'
                )}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Event footer */}
        <div className="px-3 py-4 border-t border-surface-300/50">
          <div className="px-3 py-3 rounded-lg bg-surface-200/50 border border-surface-300/40">
            <p className="text-xs font-semibold text-surface-900">{EVENT.name}</p>
            <p className="text-[11px] text-surface-700 mt-0.5">{EVENT.location} · {EVENT.dates}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse-ring" />
              <span className="text-[10px] font-semibold text-success-400 tracking-wider">{EVENT.status}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
