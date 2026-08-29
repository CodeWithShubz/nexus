import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { eventPulse } from '@/data/mockData';
import { cn } from '@/utils/cn';

// Event Pulse — a radial-style health gauge with per-metric breakdown.
export function EventPulse() {
  const { overall, label, metrics } = eventPulse;

  const pulseColor = overall >= 90 ? 'text-success-400' : overall >= 75 ? 'text-accent-400' : 'text-warning-400';
  const ringColor = overall >= 90 ? 'stroke-success-400' : overall >= 75 ? 'stroke-accent-400' : 'stroke-warning-400';

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (overall / 100) * circumference;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Event Pulse</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="flex items-center gap-6">
          {/* Radial gauge */}
          <div className="relative w-32 h-32 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" strokeWidth="8" className="stroke-surface-300/40" />
              <circle
                cx="60" cy="60" r="52" fill="none" strokeWidth="8"
                className={ringColor}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={cn('text-3xl font-bold', pulseColor)}>{overall}</span>
              <span className="text-[10px] font-semibold text-surface-700 uppercase tracking-wider">{label}</span>
            </div>
          </div>

          {/* Metric bars */}
          <div className="flex-1 space-y-3 min-w-0">
            {metrics.map((m) => (
              <div key={m.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-surface-800">{m.name}</span>
                  <span className="text-xs font-semibold text-surface-900">{m.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-300/40 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent-500 transition-all duration-500"
                    style={{ width: `${m.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
