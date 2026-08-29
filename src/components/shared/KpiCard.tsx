import { type ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  accent?: 'accent' | 'success' | 'warning' | 'neutral';
}

const accentClasses = {
  accent: 'text-accent-400 bg-accent-500/10',
  success: 'text-success-400 bg-success-500/10',
  warning: 'text-warning-400 bg-warning-500/10',
  neutral: 'text-surface-800 bg-surface-300/40',
};

export function KpiCard({ label, value, icon, trend, accent = 'accent' }: KpiCardProps) {
  return (
    <Card className="p-5 hover:border-surface-400/60 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-surface-700 uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-surface-900 mt-2 tracking-tight">{value}</p>
          {trend && <p className="text-xs text-surface-700 mt-1">{trend}</p>}
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', accentClasses[accent])}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
