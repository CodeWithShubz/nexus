// Centralized type definitions for the NEXUS platform.
// Keeping these in one place makes the data model easy to study and extend.

export type Role = 'organizer' | 'judge' | 'participant';

export type Priority = 'normal' | 'important' | 'critical';

export type SubmissionStatus = 'pending' | 'evaluated' | 'submitted';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarColor: string; // tailwind gradient seed for avatar
  skills: string[];
  preferredRole: string;
  interests: string[];
  teamId: string | null;
  checkedIn: boolean;
  checkInTime: string | null;
}

export interface Team {
  id: string;
  name: string;
  projectName: string;
  description: string;
  technologies: string[];
  memberIds: string[];
  status: SubmissionStatus;
}

// A single rubric line item (Innovation, Technical, etc.)
export interface RubricScore {
  innovation: number;
  technical: number;
  impact: number;
  presentation: number;
}

export interface Evaluation {
  id: string;
  submissionId: string; // == team id
  judgeId: string;
  judgeName: string;
  scores: RubricScore;
  feedback: string;
  strengths: string;
  improvements: string;
  submittedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: Priority;
  createdAt: string;
  author: string;
}

export interface Activity {
  id: string;
  message: string;
  timestamp: number; // epoch ms
  icon: string; // lucide icon name key
}

export interface ScheduleItem {
  time: string;
  title: string;
  status: 'done' | 'live' | 'upcoming';
}

// Derived leaderboard row — computed from evaluations, not stored.
export interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  projectName: string;
  total: number;
  scores: RubricScore;
  evaluations: number;
  trend: 'up' | 'down' | 'same';
}
