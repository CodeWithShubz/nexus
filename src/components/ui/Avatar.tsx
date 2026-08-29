import { cn } from '@/utils/cn';

const colorMap: Record<string, string> = {
  cyan: 'from-cyan-500/30 to-cyan-700/30 text-cyan-300',
  violet: 'from-violet-500/30 to-violet-700/30 text-violet-300',
  emerald: 'from-emerald-500/30 to-emerald-700/30 text-emerald-300',
  sky: 'from-sky-500/30 to-sky-700/30 text-sky-300',
  rose: 'from-rose-500/30 to-rose-700/30 text-rose-300',
  amber: 'from-amber-500/30 to-amber-700/30 text-amber-300',
  teal: 'from-teal-500/30 to-teal-700/30 text-teal-300',
  indigo: 'from-indigo-500/30 to-indigo-700/30 text-indigo-300',
  pink: 'from-pink-500/30 to-pink-700/30 text-pink-300',
  lime: 'from-lime-500/30 to-lime-700/30 text-lime-300',
  orange: 'from-orange-500/30 to-orange-700/30 text-orange-300',
  blue: 'from-blue-500/30 to-blue-700/30 text-blue-300',
  purple: 'from-purple-500/30 to-purple-700/30 text-purple-300',
  fuchsia: 'from-fuchsia-500/30 to-fuchsia-700/30 text-fuchsia-300',
  green: 'from-green-500/30 to-green-700/30 text-green-300',
};

export function Avatar({ name, color = 'cyan', size = 'md' }: { name: string; color?: string; size?: 'sm' | 'md' | 'lg' }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' };
  return (
    <div className={cn('rounded-full bg-gradient-to-br flex items-center justify-center font-semibold shrink-0', colorMap[color] ?? colorMap.cyan, sizes[size])}>
      {initials}
    </div>
  );
}
