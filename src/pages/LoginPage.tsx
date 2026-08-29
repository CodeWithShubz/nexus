import { useState } from 'react';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { useToast } from '@/components/ui/Toast';
import { EVENT, DEMO_ACCOUNTS } from '@/data/mockData';
import { cn } from '@/utils/cn';

export function LoginPage() {
  const { login } = useStore();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    // Simulate a brief auth delay for realism.
    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        toast(`Welcome back! Signed in as ${email.split('@')[0]}.`, 'success');
      } else {
        setError('Invalid credentials. Try a demo account below.');
        setLoading(false);
      }
    }, 600);
  };

  const fillDemo = (acct: typeof DEMO_ACCOUNTS[number]) => {
    setEmail(acct.email);
    setPassword(acct.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-surface-0 flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="lg:flex-1 flex flex-col justify-between p-8 lg:p-14 lg:border-r border-surface-300/40 relative overflow-hidden">
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-accent-500 flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-5.5 h-5.5" fill="none">
              <path d="M9 22V10l14 12V10" stroke="#08090c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="text-base font-bold text-surface-900 tracking-tight">NEXUS</p>
            <p className="text-[11px] text-surface-700 uppercase tracking-wider">Smart Event Management</p>
          </div>
        </div>

        <div className="relative my-12 lg:my-0">
          <h1 className="text-3xl lg:text-5xl font-bold text-surface-900 tracking-tight leading-[1.1]">
            One event.<br />One command center.<br /><span className="text-accent-400">Zero chaos.</span>
          </h1>
          <p className="mt-5 text-surface-700 text-sm lg:text-base max-w-md leading-relaxed">
            The unified platform for managing large-scale hackathons, tech fests, and conferences — from registration to live leaderboard.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="px-3.5 py-2 rounded-lg bg-surface-100 border border-surface-300/50">
              <p className="text-[10px] text-surface-700 uppercase tracking-wider">Event</p>
              <p className="text-sm font-semibold text-surface-900 mt-0.5">{EVENT.name}</p>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-surface-100 border border-surface-300/50">
              <p className="text-[10px] text-surface-700 uppercase tracking-wider">Location</p>
              <p className="text-sm font-semibold text-surface-900 mt-0.5">{EVENT.location}</p>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-surface-100 border border-surface-300/50">
              <p className="text-[10px] text-surface-700 uppercase tracking-wider">Status</p>
              <p className="text-sm font-semibold text-success-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success-400 animate-pulse-ring" />
                {EVENT.status}
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-[11px] text-surface-600 hidden lg:block">{EVENT.dates}</p>
      </div>

      {/* Right form panel */}
      <div className="lg:flex-1 flex items-center justify-center p-6 lg:p-14">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-surface-900">Sign in to NEXUS</h2>
            <p className="text-sm text-surface-700 mt-1.5">Access your event command center.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@nexushack.com"
                  className="input pl-10"
                  autoComplete="email"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-800 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-700" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-danger-400 bg-danger-500/10 border border-danger-500/20 rounded-lg px-3 py-2 animate-fade-in">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-surface-0/30 border-t-surface-0 rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-surface-300/50" />
            <span className="text-[11px] text-surface-600 uppercase tracking-wider">or</span>
            <div className="flex-1 h-px bg-surface-300/50" />
          </div>

          <button
            onClick={() => { setEmail('organizer@nexushack.com'); setPassword('demo1234'); toast('Google sign-in is mocked in this demo.', 'info'); }}
            className="btn-secondary w-full"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Demo accounts */}
          <div className="mt-6">
            <div className="flex items-center gap-1.5 mb-3">
              <Zap className="w-3.5 h-3.5 text-warning-400" />
              <p className="text-[11px] font-semibold text-warning-400 uppercase tracking-wider">Demo Accounts — click to fill</p>
            </div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acct) => (
                <button
                  key={acct.email}
                  onClick={() => fillDemo(acct)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface-100 border border-surface-300/50 hover:border-accent-500/40 hover:bg-surface-200 transition-all text-left group'
                  )}
                >
                  <div>
                    <p className="text-xs font-medium text-surface-900 capitalize">{acct.role}</p>
                    <p className="text-[11px] text-surface-700">{acct.email}</p>
                  </div>
                  <span className="text-[10px] text-surface-600 group-hover:text-accent-400 transition-colors">password: demo1234</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
