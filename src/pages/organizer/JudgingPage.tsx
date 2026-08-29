import { useStore } from '@/store/StoreContext';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/utils/cn';

export function JudgingPage() {
  const { teams, evaluations, users } = useStore();
  const judges = users.filter((u) => u.role === 'judge');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Judging</h1>
        <p className="text-sm text-surface-700 mt-1">Overview of evaluation progress across all judges.</p>
      </div>

      {/* Judge stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {judges.map((judge) => {
          const judgeEvals = evaluations.filter((e) => e.judgeId === judge.id);
          const assigned = 12;
          const evaluated = judgeEvals.length;
          const remaining = assigned - evaluated;
          const avg = judgeEvals.length > 0
            ? judgeEvals.reduce((sum, e) => sum + e.scores.innovation + e.scores.technical + e.scores.impact + e.scores.presentation, 0) / judgeEvals.length
            : 0;

          return (
            <Card key={judge.id}>
              <CardBody>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar name={judge.name} color={judge.avatarColor} size="md" />
                  <div>
                    <p className="text-sm font-semibold text-surface-900">{judge.name}</p>
                    <Badge variant="warning" className="mt-0.5">Judge</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-surface-700 uppercase tracking-wider">Assigned</p>
                    <p className="text-lg font-bold text-surface-900">{assigned}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-surface-700 uppercase tracking-wider">Evaluated</p>
                    <p className="text-lg font-bold text-success-400">{evaluated}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-surface-700 uppercase tracking-wider">Remaining</p>
                    <p className="text-lg font-bold text-warning-400">{remaining}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-surface-700 uppercase tracking-wider">Avg Score</p>
                    <p className="text-lg font-bold text-accent-400">{avg.toFixed(1)}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Submission evaluation status */}
      <Card>
        <CardHeader>
          <CardTitle>Evaluation Status by Team</CardTitle>
        </CardHeader>
        <CardBody className="!p-0">
          <div className="divide-y divide-surface-300/30">
            {teams.map((team) => {
              const teamEvals = evaluations.filter((e) => e.submissionId === team.id);
              const evaluated = teamEvals.length > 0;
              return (
                <div key={team.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      evaluated ? 'bg-success-500/10' : 'bg-surface-300/40')}>
                      {evaluated ? <CheckCircle2 className="w-4 h-4 text-success-400" /> : <Clock className="w-4 h-4 text-surface-700" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{team.name}</p>
                      <p className="text-xs text-surface-700 truncate">{team.projectName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {teamEvals.length > 0 ? (
                      <>
                        <span className="text-xs text-surface-700">{teamEvals.length} eval{teamEvals.length > 1 ? 's' : ''}</span>
                        <Badge variant="success">Evaluated</Badge>
                      </>
                    ) : (
                      <Badge variant="neutral">Pending</Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
