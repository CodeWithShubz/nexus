import { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '@/store/StoreContext';
import { ToastProvider } from '@/components/ui/Toast';
import { AppShell } from '@/components/layout/AppShell';
import { LoginPage } from '@/pages/LoginPage';
import { OverviewPage } from '@/pages/organizer/OverviewPage';
import { AttendeesPage } from '@/pages/organizer/AttendeesPage';
import { TeamsPage } from '@/pages/organizer/TeamsPage';
import { SubmissionsPage } from '@/pages/organizer/SubmissionsPage';
import { JudgingPage } from '@/pages/organizer/JudgingPage';
import { LeaderboardPage } from '@/pages/shared/LeaderboardPage';
import { AnnouncementsPage } from '@/pages/organizer/AnnouncementsPage';
import { SettingsPage } from '@/pages/organizer/SettingsPage';
import { JudgePortalPage } from '@/pages/judge/JudgePortalPage';
import { ParticipantDashboardPage } from '@/pages/participant/ParticipantDashboardPage';
import { MatchmakingPage } from '@/pages/participant/MatchmakingPage';
import { MySubmissionPage } from '@/pages/participant/MySubmissionPage';
import { ParticipantAnnouncementsPage } from '@/pages/participant/ParticipantAnnouncementsPage';

// Default landing page per role after login.
const defaultPage: Record<string, string> = {
  organizer: 'overview',
  judge: 'judge-portal',
  participant: 'participant-dashboard',
};

function AppContent() {
  const { currentUser } = useStore();
  const [page, setPage] = useState(defaultPage[currentUser?.role ?? 'organizer'] ?? 'overview');

  // When the user changes (login, role switch), jump to that role's default page.
  useEffect(() => {
    if (currentUser) {
      setPage(defaultPage[currentUser.role] ?? 'overview');
    }
  }, [currentUser?.id, currentUser?.role]);

  if (!currentUser) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (page) {
      // Organizer
      case 'overview': return <OverviewPage />;
      case 'attendees': return <AttendeesPage />;
      case 'teams': return <TeamsPage />;
      case 'submissions': return <SubmissionsPage />;
      case 'judging': return <JudgingPage />;
      case 'announcements': return <AnnouncementsPage />;
      case 'settings': return <SettingsPage />;
      // Shared
      case 'leaderboard': return <LeaderboardPage />;
      // Judge
      case 'judge-portal': return <JudgePortalPage />;
      // Participant
      case 'participant-dashboard': return <ParticipantDashboardPage />;
      case 'matchmaking': return <MatchmakingPage />;
      case 'my-submission': return <MySubmissionPage />;
      case 'participant-announcements': return <ParticipantAnnouncementsPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <AppShell activePage={page} onNavigate={setPage}>
      {renderPage()}
    </AppShell>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </ToastProvider>
  );
}
