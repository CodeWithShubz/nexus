import { LayoutDashboard, Users, UsersRound, FileCode2, Gavel, Trophy, Megaphone, Settings, BarChart3 } from 'lucide-react';
import type { Role } from '@/types';

export interface NavItem {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

// Single source of truth for navigation — each item declares which roles can see it.
export const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, roles: ['organizer'] },
  { id: 'attendees', label: 'Attendees', icon: Users, roles: ['organizer'] },
  { id: 'teams', label: 'Teams', icon: UsersRound, roles: ['organizer'] },
  { id: 'submissions', label: 'Submissions', icon: FileCode2, roles: ['organizer'] },
  { id: 'judging', label: 'Judging', icon: Gavel, roles: ['organizer'] },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, roles: ['organizer', 'judge'] },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, roles: ['organizer'] },
  { id: 'judge-portal', label: 'Judge Portal', icon: BarChart3, roles: ['judge'] },
  { id: 'participant-dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['participant'] },
  { id: 'matchmaking', label: 'Matchmaking', icon: UsersRound, roles: ['participant'] },
  { id: 'my-submission', label: 'My Submission', icon: FileCode2, roles: ['participant'] },
  { id: 'participant-announcements', label: 'Announcements', icon: Megaphone, roles: ['participant'] },
  { id: 'settings', label: 'Settings', icon: Settings, roles: ['organizer'] },
];
