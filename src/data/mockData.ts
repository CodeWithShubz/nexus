import type {
  User, Team, Evaluation, Announcement, Activity, ScheduleItem,
} from '@/types';

// ──────────────────────────────────────────────────────────────
// EVENT META
// ──────────────────────────────────────────────────────────────

export const EVENT = {
  name: 'NEXUS HACK 2026',
  tagline: 'One event. One command center. Zero chaos.',
  location: 'Mumbai',
  dates: 'August 29–30, 2026',
  status: 'LIVE' as const,
};

// ──────────────────────────────────────────────────────────────
// DEMO ACCOUNTS — password is "demo1234" for all
// ──────────────────────────────────────────────────────────────

export const DEMO_ACCOUNTS = [
  { email: 'organizer@nexushack.com', password: 'demo1234', role: 'organizer' as const },
  { email: 'judge@nexushack.com', password: 'demo1234', role: 'judge' as const },
  { email: 'participant@nexushack.com', password: 'demo1234', role: 'participant' as const },
];

// ──────────────────────────────────────────────────────────────
// USERS / ATTENDEES
// ──────────────────────────────────────────────────────────────

export const initialUsers: User[] = [
  { id: 'u-organizer', name: 'Arjun Mehta', email: 'organizer@nexushack.com', role: 'organizer', avatarColor: 'cyan', skills: ['Operations', 'Logistics'], preferredRole: 'Organizer', interests: ['Hackathons'], teamId: null, checkedIn: true, checkInTime: '08:42 AM' },
  { id: 'u-judge', name: 'Priya Iyer', email: 'judge@nexushack.com', role: 'judge', avatarColor: 'violet', skills: ['AI/ML', 'Product Strategy'], preferredRole: 'Judge', interests: ['Mentoring', 'Startups'], teamId: null, checkedIn: true, checkInTime: '08:50 AM' },
  { id: 'u-participant', name: 'Aarav Sharma', email: 'participant@nexushack.com', role: 'participant', avatarColor: 'emerald', skills: ['React', 'UI/UX', 'Firebase'], preferredRole: 'Frontend Lead', interests: ['AI Tooling', 'DevTools'], teamId: 't-neuralforge', checkedIn: true, checkInTime: '09:05 AM' },

  { id: 'u-2', name: 'Rahul Sharma', email: 'rahul.s@nexushack.com', role: 'participant', avatarColor: 'sky', skills: ['Python', 'ML', 'Data'], preferredRole: 'ML Engineer', interests: ['AI', 'Healthcare'], teamId: 't-quantumx', checkedIn: true, checkInTime: '09:02 AM' },
  { id: 'u-3', name: 'Priya Shah', email: 'priya.shah@nexushack.com', role: 'participant', avatarColor: 'rose', skills: ['Python', 'ML', 'Data'], preferredRole: 'Data Scientist', interests: ['AI', 'Finance'], teamId: 't-quantumx', checkedIn: true, checkInTime: '09:03 AM' },
  { id: 'u-4', name: 'Kabir Singh', email: 'kabir.s@nexushack.com', role: 'participant', avatarColor: 'amber', skills: ['Node.js', 'GraphQL', 'AWS'], preferredRole: 'Backend Lead', interests: ['Cloud', 'DevTools'], teamId: 't-bytebuilders', checkedIn: true, checkInTime: '09:08 AM' },
  { id: 'u-5', name: 'Ananya Rao', email: 'ananya.r@nexushack.com', role: 'participant', avatarColor: 'teal', skills: ['React', 'TypeScript', 'Tailwind'], preferredRole: 'Frontend', interests: ['Design Systems'], teamId: 't-bytebuilders', checkedIn: true, checkInTime: '09:10 AM' },
  { id: 'u-6', name: 'Vivaan Gupta', email: 'vivaan.g@nexushack.com', role: 'participant', avatarColor: 'indigo', skills: ['Solidity', 'Web3', 'Rust'], preferredRole: 'Blockchain Dev', interests: ['DeFi', 'Crypto'], teamId: 't-nova', checkedIn: false, checkInTime: null },
  { id: 'u-7', name: 'Diya Patel', email: 'diya.p@nexushack.com', role: 'participant', avatarColor: 'pink', skills: ['Go', 'Kubernetes', 'Docker'], preferredRole: 'DevOps', interests: ['Infra', 'Cloud'], teamId: 't-codestorm', checkedIn: true, checkInTime: '09:15 AM' },
  { id: 'u-8', name: 'Arjun Nair', email: 'arjun.n@nexushack.com', role: 'participant', avatarColor: 'lime', skills: ['Figma', 'UI/UX', 'Motion'], preferredRole: 'Designer', interests: ['Creative Tools'], teamId: 't-pixelpulse', checkedIn: false, checkInTime: null },
  { id: 'u-9', name: 'Saanvi Reddy', email: 'saanvi.r@nexushack.com', role: 'participant', avatarColor: 'orange', skills: ['Python', 'Pandas', 'SQL'], preferredRole: 'Data Analyst', interests: ['Analytics', 'BI'], teamId: 't-dataminds', checkedIn: true, checkInTime: '09:20 AM' },
  { id: 'u-10', name: 'Reyansh Kumar', email: 'reyansh.k@nexushack.com', role: 'participant', avatarColor: 'cyan', skills: ['React', 'Node.js', 'MongoDB'], preferredRole: 'Fullstack', interests: ['SaaS'], teamId: null, checkedIn: false, checkInTime: null },
  { id: 'u-11', name: 'Myra Joshi', email: 'myra.j@nexushack.com', role: 'participant', avatarColor: 'fuchsia', skills: ['Swift', 'iOS', 'CoreML'], preferredRole: 'Mobile Dev', interests: ['Mobile AI'], teamId: null, checkedIn: false, checkInTime: null },

  { id: 'u-j2', name: 'Dr. Vikram Rao', email: 'vikram.r@nexushack.com', role: 'judge', avatarColor: 'blue', skills: ['Systems', 'Architecture'], preferredRole: 'Judge', interests: ['Research'], teamId: null, checkedIn: true, checkInTime: '08:55 AM' },
  { id: 'u-j3', name: 'Neha Kapoor', email: 'neha.k@nexushack.com', role: 'judge', avatarColor: 'purple', skills: ['Product', 'Growth'], preferredRole: 'Judge', interests: ['Startups'], teamId: null, checkedIn: true, checkInTime: '08:58 AM' },

  { id: 'u-m1', name: 'Rohan Desai', email: 'rohan.d@nexushack.com', role: 'participant', avatarColor: 'green', skills: ['Mentoring', 'Architecture'], preferredRole: 'Mentor', interests: ['EdTech'], teamId: null, checkedIn: true, checkInTime: '09:00 AM' },
];

// ──────────────────────────────────────────────────────────────
// TEAMS / SUBMISSIONS
// ──────────────────────────────────────────────────────────────

export const initialTeams: Team[] = [
  { id: 't-neuralforge', name: 'NeuralForge', projectName: 'NeuralForge Studio', description: 'A no-code platform for fine-tuning and deploying custom AI models with a visual drag-and-drop pipeline builder.', technologies: ['React', 'PyTorch', 'FastAPI', 'Postgres'], memberIds: ['u-participant', 'u-10', 'u-11'], status: 'submitted' },
  { id: 't-quantumx', name: 'QuantumX', projectName: 'Quantum Insights', description: 'Real-time quantum-inspired portfolio optimization engine for retail investors, with explainable AI risk scoring.', technologies: ['Python', 'TensorFlow', 'NumPy', 'Streamlit'], memberIds: ['u-2', 'u-3'], status: 'submitted' },
  { id: 't-bytebuilders', name: 'ByteBuilders', projectName: 'ByteSync', description: 'Collaborative real-time code editor with AI pair-programming and live conflict resolution for distributed teams.', technologies: ['Node.js', 'GraphQL', 'WebSocket', 'Redis'], memberIds: ['u-4', 'u-5'], status: 'submitted' },
  { id: 't-nova', name: 'Nova', projectName: 'NovaChain', description: 'A gasless cross-chain bridge with zero-knowledge proofs for secure, low-cost asset transfers between L2 networks.', technologies: ['Solidity', 'Rust', 'Foundry'], memberIds: ['u-6'], status: 'submitted' },
  { id: 't-codestorm', name: 'CodeStorm', projectName: 'StormOps', description: 'Self-healing Kubernetes operator that auto-remediates infrastructure incidents using LLM-driven runbooks.', technologies: ['Go', 'Kubernetes', 'Docker', 'Prometheus'], memberIds: ['u-7'], status: 'submitted' },
  { id: 't-pixelpulse', name: 'PixelPulse', projectName: 'Pulse Design', description: 'A motion-design system generator that turns static Figma frames into production-ready animated React components.', technologies: ['Figma API', 'React', 'Framer Motion'], memberIds: ['u-8'], status: 'submitted' },
  { id: 't-dataminds', name: 'DataMinds', projectName: 'InsightStream', description: 'Streaming analytics dashboard for real-time business intelligence with natural-language query generation.', technologies: ['Python', 'Pandas', 'DuckDB', 'Next.js'], memberIds: ['u-9'], status: 'submitted' },
];

// ──────────────────────────────────────────────────────────────
// EVALUATIONS — seeded so the leaderboard starts populated
// ──────────────────────────────────────────────────────────────

export const initialEvaluations: Evaluation[] = [
  { id: 'e-1', submissionId: 't-neuralforge', judgeId: 'u-judge', judgeName: 'Priya Iyer', scores: { innovation: 24, technical: 23, impact: 24, presentation: 23 }, feedback: 'Excellent no-code approach with strong UX.', strengths: 'Great UX, clear value prop.', improvements: 'Add more model types.', submittedAt: '10:15 AM' },
  { id: 'e-2', submissionId: 't-quantumx', judgeId: 'u-j2', judgeName: 'Dr. Vikram Rao', scores: { innovation: 23, technical: 24, impact: 22, presentation: 24 }, feedback: 'Strong technical depth in the optimization engine.', strengths: 'Deep math, good demo.', improvements: 'Mobile UI needs work.', submittedAt: '10:30 AM' },
  { id: 'e-3', submissionId: 't-bytebuilders', judgeId: 'u-judge', judgeName: 'Priya Iyer', scores: { innovation: 22, technical: 23, impact: 23, presentation: 22 }, feedback: 'Solid real-time collaboration tool.', strengths: 'Conflict resolution is novel.', improvements: 'Needs better onboarding.', submittedAt: '10:45 AM' },
  { id: 'e-4', submissionId: 't-nova', judgeId: 'u-j3', judgeName: 'Neha Kapoor', scores: { innovation: 23, technical: 22, impact: 22, presentation: 22 }, feedback: 'Ambitious ZK bridge implementation.', strengths: 'Strong crypto fundamentals.', improvements: 'Demo was rushed.', submittedAt: '11:00 AM' },
  { id: 'e-5', submissionId: 't-codestorm', judgeId: 'u-j2', judgeName: 'Dr. Vikram Rao', scores: { innovation: 21, technical: 23, impact: 22, presentation: 21 }, feedback: 'Practical infra automation.', strengths: 'Solves a real pain point.', improvements: 'More LLM guardrails needed.', submittedAt: '11:15 AM' },
  { id: 'e-6', submissionId: 't-pixelpulse', judgeId: 'u-j3', judgeName: 'Neha Kapoor', scores: { innovation: 22, technical: 21, impact: 21, presentation: 21 }, feedback: 'Beautiful design tool concept.', strengths: 'Motion system is impressive.', improvements: 'Limited component library.', submittedAt: '11:30 AM' },
  { id: 'e-7', submissionId: 't-dataminds', judgeId: 'u-judge', judgeName: 'Priya Iyer', scores: { innovation: 20, technical: 21, impact: 21, presentation: 20 }, feedback: 'Good analytics foundation.', strengths: 'NL query is useful.', improvements: 'Needs more chart types.', submittedAt: '11:45 AM' },
];

// ──────────────────────────────────────────────────────────────
// ANNOUNCEMENTS
// ──────────────────────────────────────────────────────────────

export const initialAnnouncements: Announcement[] = [
  { id: 'a-1', title: 'Hacking Phase Begins', message: 'The 24-hour hacking window is now open. Build boldly!', priority: 'important', createdAt: '10:00 AM', author: 'Arjun Mehta' },
  { id: 'a-2', title: 'Mentor Hours at 6PM', message: 'Senior mentors will be available at the main stage from 6 PM to 8 PM.', priority: 'normal', createdAt: '09:30 AM', author: 'Arjun Mehta' },
  { id: 'a-3', title: 'Submit by 2 PM Tomorrow', message: 'Final submissions close at 2:00 PM sharp. No extensions.', priority: 'critical', createdAt: '09:00 AM', author: 'Arjun Mehta' },
];

// ──────────────────────────────────────────────────────────────
// ACTIVITY FEED
// ──────────────────────────────────────────────────────────────

const now = Date.now();
const min = 60_000;

export const initialActivity: Activity[] = [
  { id: 'act-1', message: 'Rahul Sharma checked in', timestamp: now - 2 * min, icon: 'check-circle' },
  { id: 'act-2', message: 'Team QuantumX submitted a project', timestamp: now - 5 * min, icon: 'upload' },
  { id: 'act-3', message: 'Judge Priya completed evaluation', timestamp: now - 8 * min, icon: 'gavel' },
  { id: 'act-4', message: 'New announcement published', timestamp: now - 12 * min, icon: 'megaphone' },
  { id: 'act-5', message: 'Kabir Singh checked in', timestamp: now - 18 * min, icon: 'check-circle' },
  { id: 'act-6', message: 'Team NeuralForge submitted a project', timestamp: now - 25 * min, icon: 'upload' },
];

// ──────────────────────────────────────────────────────────────
// SCHEDULE
// ──────────────────────────────────────────────────────────────

export const schedule: ScheduleItem[] = [
  { time: '09:00', title: 'Registration & Check-in', status: 'done' },
  { time: '10:00', title: 'Opening Ceremony', status: 'done' },
  { time: '11:00', title: 'Hacking Begins', status: 'live' },
  { time: '13:00', title: 'Lunch', status: 'upcoming' },
  { time: '18:00', title: 'Mentor Checkpoint', status: 'upcoming' },
  { time: '22:00', title: 'Midnight Challenge', status: 'upcoming' },
];

// ──────────────────────────────────────────────────────────────
// CHART DATA — attendance over time
// ──────────────────────────────────────────────────────────────

export const attendanceData = [
  { time: '9 AM', checked: 412, registered: 1248 },
  { time: '10 AM', checked: 680, registered: 1248 },
  { time: '11 AM', checked: 815, registered: 1248 },
  { time: '12 PM', checked: 880, registered: 1248 },
  { time: '1 PM', checked: 910, registered: 1248 },
  { time: '2 PM', checked: 936, registered: 1248 },
];

export const submissionProgressData = [
  { time: '10 AM', submissions: 0 },
  { time: '11 AM', submissions: 12 },
  { time: '12 PM', submissions: 28 },
  { time: '1 PM', submissions: 64 },
  { time: '2 PM', submissions: 98 },
  { time: '3 PM', submissions: 142 },
];

// ──────────────────────────────────────────────────────────────
// EVENT PULSE
// ──────────────────────────────────────────────────────────────

export const eventPulse = {
  overall: 92,
  label: 'EXCELLENT',
  metrics: [
    { name: 'Attendance', value: 94 },
    { name: 'Engagement', value: 87 },
    { name: 'Judging', value: 78 },
    { name: 'Submissions', value: 91 },
  ],
};

// ──────────────────────────────────────────────────────────────
// MATCHMAKING POOL — participants available for team matching
// ──────────────────────────────────────────────────────────────

export const matchmakingPool = [
  { id: 'u-10', name: 'Reyansh Kumar', skills: ['React', 'Node.js', 'MongoDB'], role: 'Fullstack', interests: ['SaaS'], match: 85 },
  { id: 'u-11', name: 'Myra Joshi', skills: ['Swift', 'iOS', 'CoreML'], role: 'Mobile Dev', interests: ['Mobile AI'], match: 81 },
  { id: 'u-3', name: 'Priya Shah', skills: ['Python', 'ML', 'Data'], role: 'Data Scientist', interests: ['AI', 'Finance'], match: 78 },
  { id: 'u-5', name: 'Ananya Rao', skills: ['React', 'TypeScript', 'Tailwind'], role: 'Frontend', interests: ['Design Systems'], match: 74 },
  { id: 'u-7', name: 'Diya Patel', skills: ['Go', 'Kubernetes', 'Docker'], role: 'DevOps', interests: ['Infra', 'Cloud'], match: 69 },
];
