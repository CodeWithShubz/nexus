import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

// Card — elevated surface container used across the app.
export function Card({ children, className, elevated }: { children: ReactNode; className?: string; elevated?: boolean }) {
  return (
    <div className={cn(elevated ? 'card-elevated' : 'card', className)}>{children}</div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4 border-b border-surface-300/50', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('text-sm font-semibold text-surface-900', className)}>{children}</h3>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
