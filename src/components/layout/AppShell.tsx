import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useStore } from '@/store/StoreContext';

interface AppShellProps {
  activePage: string;
  onNavigate: (page: string) => void;
  children: React.ReactNode;
}

export function AppShell({ activePage, onNavigate, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { switchRole } = useStore();

  return (
    <div className="flex min-h-screen bg-surface-0">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenMobile={() => setMobileOpen(true)}
          onSwitchRole={(role) => {
            switchRole(role);
            // Navigate to the default page for the new role.
            const defaults: Record<string, string> = {
              organizer: 'overview',
              judge: 'judge-portal',
              participant: 'participant-dashboard',
            };
            onNavigate(defaults[role]);
          }}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
