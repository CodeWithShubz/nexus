import { cn } from '@/utils/cn';

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'accent' | 'neutral';

const variants: Record<Variant, string> = {
  default: 'bg-surface-300/50 text-surface-800 border border-surface-400/40',
  success: 'bg-success-500/10 text-success-400 border border-success-500/30',
  warning: 'bg-warning-500/10 text-warning-400 border border-warning-500/30',
  danger: 'bg-danger-500/10 text-danger-400 border border-danger-500/30',
  accent: 'bg-accent-500/10 text-accent-400 border border-accent-500/30',
  neutral: 'bg-surface-200 text-surface-700 border border-surface-400/40',
};

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: Variant; className?: string }) {
  return <span className={cn('badge', variants[variant], className)}>{children}</span>;
}
