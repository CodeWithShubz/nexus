import { createContext, useContext, useReducer, useCallback, useMemo, type ReactNode } from 'react';
import type { User, Team, Evaluation, Announcement, Activity, LeaderboardEntry, RubricScore } from '@/types';
import {
  initialUsers, initialTeams, initialEvaluations, initialAnnouncements, initialActivity,
} from '@/data/mockData';

// ──────────────────────────────────────────────────────────────
// STATE SHAPE
// ──────────────────────────────────────────────────────────────

interface State {
  users: User[];
  teams: Team[];
  evaluations: Evaluation[];
  announcements: Announcement[];
  activity: Activity[];
  currentUserId: string | null;
}

const initialState: State = {
  users: initialUsers,
  teams: initialTeams,
  evaluations: initialEvaluations,
  announcements: initialAnnouncements,
  activity: initialActivity,
  currentUserId: null,
};

// ──────────────────────────────────────────────────────────────
// ACTIONS
// ──────────────────────────────────────────────────────────────

type Action =
  | { type: 'LOGIN'; userId: string }
  | { type: 'LOGOUT' }
  | { type: 'SWITCH_ROLE'; role: 'organizer' | 'judge' | 'participant' }
  | { type: 'CHECK_IN'; userId: string }
  | { type: 'ADD_ANNOUNCEMENT'; announcement: Announcement }
  | { type: 'ADD_EVALUATION'; evaluation: Evaluation }
  | { type: 'ADD_ACTIVITY'; activity: Activity };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, currentUserId: action.userId };

    case 'LOGOUT':
      return { ...state, currentUserId: null };

    case 'SWITCH_ROLE': {
      // Find the demo account for the target role and log in as it.
      const demoUser = state.users.find((u) => u.role === action.role);
      return demoUser ? { ...state, currentUserId: demoUser.id } : state;
    }

    case 'CHECK_IN': {
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const user = state.users.find((u) => u.id === action.userId);
      if (!user || user.checkedIn) return state;
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.userId ? { ...u, checkedIn: true, checkInTime: time } : u
        ),
        activity: [
          { id: `act-${Date.now()}`, message: `${user.name} checked in`, timestamp: Date.now(), icon: 'check-circle' },
          ...state.activity,
        ],
      };
    }

    case 'ADD_ANNOUNCEMENT': {
      const act: Activity = {
        id: `act-${Date.now()}`,
        message: `New announcement published: ${action.announcement.title}`,
        timestamp: Date.now(),
        icon: 'megaphone',
      };
      return {
        ...state,
        announcements: [action.announcement, ...state.announcements],
        activity: [act, ...state.activity],
      };
    }

    case 'ADD_EVALUATION': {
      const team = state.teams.find((t) => t.id === action.evaluation.submissionId);
      const act: Activity = {
        id: `act-${Date.now()}`,
        message: `Judge ${action.evaluation.judgeName} evaluated ${team?.name ?? 'a project'}`,
        timestamp: Date.now(),
        icon: 'gavel',
      };
      return {
        ...state,
        evaluations: [...state.evaluations, action.evaluation],
        teams: state.teams.map((t) =>
          t.id === action.evaluation.submissionId ? { ...t, status: 'evaluated' } : t
        ),
        activity: [act, ...state.activity],
      };
    }

    case 'ADD_ACTIVITY':
      return { ...state, activity: [action.activity, ...state.activity] };

    default:
      return state;
  }
}

// ──────────────────────────────────────────────────────────────
// CONTEXT TYPE
// ──────────────────────────────────────────────────────────────

interface StoreContextValue extends State {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: 'organizer' | 'judge' | 'participant') => void;
  checkIn: (userId: string) => void;
  addAnnouncement: (a: Omit<Announcement, 'id' | 'createdAt'>) => void;
  addEvaluation: (e: Omit<Evaluation, 'id' | 'submittedAt'>) => void;
  leaderboard: LeaderboardEntry[];
  // Derived stats
  stats: {
    attendees: number;
    checkedIn: number;
    teams: number;
    submissions: number;
  };
}

const StoreContext = createContext<StoreContextValue | null>(null);

// ──────────────────────────────────────────────────────────────
// LEADERBOARD COMPUTATION
// Averages all evaluations per team and ranks them.
// This is the single source of truth — every evaluation flows here.
// ──────────────────────────────────────────────────────────────

function computeLeaderboard(teams: Team[], evaluations: Evaluation[]): LeaderboardEntry[] {
  const rows = teams
    .map((team) => {
      const teamEvals = evaluations.filter((e) => e.submissionId === team.id);
      if (teamEvals.length === 0) return null;
      const avg = teamEvals.reduce(
        (acc, e) => {
          acc.innovation += e.scores.innovation;
          acc.technical += e.scores.technical;
          acc.impact += e.scores.impact;
          acc.presentation += e.scores.presentation;
          return acc;
        },
        { innovation: 0, technical: 0, impact: 0, presentation: 0 }
      ) as RubricScore;
      const n = teamEvals.length;
      const scores: RubricScore = {
        innovation: avg.innovation / n,
        technical: avg.technical / n,
        impact: avg.impact / n,
        presentation: avg.presentation / n,
      };
      const total = scores.innovation + scores.technical + scores.impact + scores.presentation;
      const entry: LeaderboardEntry = {
        teamId: team.id,
        teamName: team.name,
        projectName: team.projectName,
        total,
        scores,
        evaluations: n,
        trend: 'same',
      };
      return entry;
    })
    .filter((r): r is LeaderboardEntry => r !== null);

  rows.sort((a, b) => b.total - a.total);
  // Assign trend based on rank change vs previous render — simplified to 'same' for prototype.
  return rows;
}

// ──────────────────────────────────────────────────────────────
// PROVIDER
// ──────────────────────────────────────────────────────────────

let idCounter = 0;
const nextId = () => `gen-${Date.now()}-${idCounter++}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = useCallback((email: string, password: string) => {
    const user = state.users.find((u) => u.email === email);
    if (user && password === 'demo1234') {
      dispatch({ type: 'LOGIN', userId: user.id });
      return true;
    }
    return false;
  }, [state.users]);

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);

  const switchRole = useCallback((role: 'organizer' | 'judge' | 'participant') => {
    dispatch({ type: 'SWITCH_ROLE', role });
  }, []);

  const checkIn = useCallback((userId: string) => {
    dispatch({ type: 'CHECK_IN', userId });
  }, []);

  const addAnnouncement = useCallback((a: Omit<Announcement, 'id' | 'createdAt'>) => {
    dispatch({
      type: 'ADD_ANNOUNCEMENT',
      announcement: {
        ...a,
        id: nextId(),
        createdAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    });
  }, []);

  const addEvaluation = useCallback((e: Omit<Evaluation, 'id' | 'submittedAt'>) => {
    dispatch({
      type: 'ADD_EVALUATION',
      evaluation: {
        ...e,
        id: nextId(),
        submittedAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
    });
  }, []);

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId]
  );

  const leaderboard = useMemo(
    () => computeLeaderboard(state.teams, state.evaluations),
    [state.teams, state.evaluations]
  );

  const stats = useMemo(() => ({
    attendees: state.users.length,
    checkedIn: state.users.filter((u) => u.checkedIn).length,
    teams: state.teams.length,
    submissions: state.teams.filter((t) => t.status !== 'pending').length,
  }), [state.users, state.teams]);

  const value: StoreContextValue = {
    ...state,
    currentUser,
    login,
    logout,
    switchRole,
    checkIn,
    addAnnouncement,
    addEvaluation,
    leaderboard,
    stats,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
