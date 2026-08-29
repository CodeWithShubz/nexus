import { useState } from 'react';
import { BarChart3, CheckCircle2, Clock, Star, ChevronRight, Gavel } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';
import type { Team, RubricScore } from '@/types';

const rubricItems = [
  { key: 'innovation', label: 'Innovation', max: 25, description: 'Originality and creativity of the solution.' },
  { key: 'technical', label: 'Technical Excellence', max: 25, description: 'Code quality, architecture, and complexity.' },
  { key: 'impact', label: 'Impact', max: 25, description: 'Real-world value and potential reach.' },
  { key: 'presentation', label: 'Presentation', max: 25, description: 'Clarity, demo quality, and communication.' },
] as const;

export function JudgePortalPage() {
  const { teams, evaluations, currentUser } = useStore();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  if (!currentUser) return null;

  const myEvals = evaluations.filter((e) => e.judgeId === currentUser.id);
  const assigned = 12;
  const evaluated = myEvals.length;
  const remaining = assigned - evaluated;
  const avg = myEvals.length > 0
    ? myEvals.reduce((sum, e) => sum + e.scores.innovation + e.scores.technical + e.scores.impact + e.scores.presentation, 0) / myEvals.length
    : 0;

  const evaluatedTeamIds = new Set(myEvals.map((e) => e.submissionId));
  const pendingTeams = teams.filter((t) => !evaluatedTeamIds.has(t.id));
  const evaluatedTeams = teams.filter((t) => evaluatedTeamIds.has(t.id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">Judge Portal</h1>
        <p className="text-sm text-surface-700 mt-1">Evaluate submissions and track your progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-surface-700 uppercase tracking-wider">Assigned</p>
              <p className="text-2xl font-bold text-surface-900 mt-1">{assigned}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-300/40 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-surface-800" /></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-surface-700 uppercase tracking-wider">Evaluated</p>
              <p className="text-2xl font-bold text-success-400 mt-1">{evaluated}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-success-500/10 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-success-400" /></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-surface-700 uppercase tracking-wider">Remaining</p>
              <p className="text-2xl font-bold text-warning-400 mt-1">{remaining}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-warning-500/10 flex items-center justify-center"><Clock className="w-5 h-5 text-warning-400" /></div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-surface-700 uppercase tracking-wider">Avg Score</p>
              <p className="text-2xl font-bold text-accent-400 mt-1">{avg.toFixed(1)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-accent-500/10 flex items-center justify-center"><Star className="w-5 h-5 text-accent-400" /></div>
          </div>
        </Card>
      </div>

      {/* Pending evaluations */}
      <div>
        <h2 className="text-sm font-semibold text-surface-900 mb-3">Pending Evaluations ({pendingTeams.length})</h2>
        <div className="space-y-3">
          {pendingTeams.length === 0 ? (
            <Card><CardBody><p className="text-sm text-surface-700 text-center py-6">All assigned submissions have been evaluated. Great work!</p></CardBody></Card>
          ) : (
            pendingTeams.map((team) => (
              <Card key={team.id} className="hover:border-accent-500/40 transition-colors cursor-pointer group">
                <button onClick={() => setSelectedTeam(team)} className="w-full text-left">
                  <CardBody>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-warning-500/10 flex items-center justify-center shrink-0">
                          <Gavel className="w-5 h-5 text-warning-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-surface-900">{team.name}</p>
                          <p className="text-xs text-surface-700 truncate">{team.projectName}</p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {team.technologies.slice(0, 4).map((t) => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-surface-200 text-surface-700">{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <Badge variant="warning">Evaluate</Badge>
                        <ChevronRight className="w-5 h-5 text-surface-700 group-hover:text-surface-900 transition-colors" />
                      </div>
                    </div>
                  </CardBody>
                </button>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Completed evaluations */}
      {evaluatedTeams.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-surface-900 mb-3">Completed Evaluations ({evaluatedTeams.length})</h2>
          <div className="space-y-3">
            {evaluatedTeams.map((team) => {
              const eval_ = myEvals.find((e) => e.submissionId === team.id);
              const total = eval_ ? eval_.scores.innovation + eval_.scores.technical + eval_.scores.impact + eval_.scores.presentation : 0;
              return (
                <Card key={team.id} className="hover:border-surface-400/60 transition-colors">
                  <CardBody>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-success-500/10 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-success-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-surface-900">{team.name}</p>
                          <p className="text-xs text-surface-700 truncate">{team.projectName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-lg font-bold text-accent-400">{total.toFixed(1)}</span>
                        <Badge variant="success">Done</Badge>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Evaluation modal */}
      <EvaluationModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// EVALUATION MODAL — the core scoring interface.
// Scores flow into the global store → leaderboard recalculates.
// ──────────────────────────────────────────────────────────────

function EvaluationModal({ team, onClose }: { team: Team | null; onClose: () => void }) {
  const { addEvaluation, currentUser } = useStore();
  const { toast } = useToast();
  const [scores, setScores] = useState<RubricScore>({ innovation: 20, technical: 20, impact: 20, presentation: 20 });
  const [feedback, setFeedback] = useState('');
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!team || !currentUser) return null;

  const total = scores.innovation + scores.technical + scores.impact + scores.presentation;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!feedback.trim()) newErrors.feedback = 'Feedback is required.';
    if (!strengths.trim()) newErrors.strengths = 'Strengths are required.';
    if (!improvements.trim()) newErrors.improvements = 'Improvements are required.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      addEvaluation({
        submissionId: team.id,
        judgeId: currentUser.id,
        judgeName: currentUser.name,
        scores,
        feedback: feedback.trim(),
        strengths: strengths.trim(),
        improvements: improvements.trim(),
      });
      toast(`Evaluation submitted for ${team.name}. Leaderboard updated!`, 'success');
      setSubmitting(false);
      // Reset form state
      setScores({ innovation: 20, technical: 20, impact: 20, presentation: 20 });
      setFeedback('');
      setStrengths('');
      setImprovements('');
      setErrors({});
      onClose();
    }, 500);
  };

  return (
    <Modal open={!!team} onClose={onClose} title={`Evaluate: ${team.name}`} maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Project info */}
        <div className="p-4 rounded-lg bg-surface-200/50 border border-surface-300/40">
          <p className="text-sm font-semibold text-surface-900">{team.projectName}</p>
          <p className="text-xs text-surface-700 mt-1 leading-relaxed">{team.description}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {team.technologies.map((t) => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-surface-300/40 text-surface-800">{t}</span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rubric sliders */}
          <div>
            <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-3">Evaluation Rubric</h4>
            <div className="space-y-4">
              {rubricItems.map((item) => {
                const value = scores[item.key];
                return (
                  <div key={item.key}>
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="text-sm font-medium text-surface-900">{item.label}</span>
                        <span className="text-xs text-surface-600 ml-2">/ {item.max}</span>
                      </div>
                      <span className={cn(
                        'text-sm font-bold',
                        value >= 22 ? 'text-success-400' : value >= 18 ? 'text-accent-400' : 'text-warning-400'
                      )}>{value}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={item.max}
                      value={value}
                      onChange={(e) => setScores((p) => ({ ...p, [item.key]: Number(e.target.value) }))}
                      className="w-full accent-accent-500 cursor-pointer"
                    />
                    <p className="text-[11px] text-surface-600 mt-0.5">{item.description}</p>
                  </div>
                );
              })}
            </div>
            {/* Total */}
            <div className="flex items-center justify-between mt-4 px-4 py-3 rounded-lg bg-accent-500/10 border border-accent-500/20">
              <span className="text-sm font-semibold text-surface-900">Total Score</span>
              <span className="text-xl font-bold text-accent-400">{total} / 100</span>
            </div>
          </div>

          {/* Feedback fields */}
          <div>
            <h4 className="text-xs font-semibold text-surface-700 uppercase tracking-wider mb-3">Feedback</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-surface-800 mb-1.5">Overall Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => { setFeedback(e.target.value); setErrors((p) => { const n = { ...p }; delete n.feedback; return n; }); }}
                  placeholder="Provide your overall assessment..."
                  rows={3}
                  className={cn('input resize-none', errors.feedback && 'border-danger-500/50')}
                />
                {errors.feedback && <p className="text-xs text-danger-400 mt-1">{errors.feedback}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-800 mb-1.5">Strengths</label>
                <textarea
                  value={strengths}
                  onChange={(e) => { setStrengths(e.target.value); setErrors((p) => { const n = { ...p }; delete n.strengths; return n; }); }}
                  placeholder="What did the team do well?"
                  rows={2}
                  className={cn('input resize-none', errors.strengths && 'border-danger-500/50')}
                />
                {errors.strengths && <p className="text-xs text-danger-400 mt-1">{errors.strengths}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-800 mb-1.5">Improvement Suggestions</label>
                <textarea
                  value={improvements}
                  onChange={(e) => { setImprovements(e.target.value); setErrors((p) => { const n = { ...p }; delete n.improvements; return n; }); }}
                  placeholder="What could be improved?"
                  rows={2}
                  className={cn('input resize-none', errors.improvements && 'border-danger-500/50')}
                />
                {errors.improvements && <p className="text-xs text-danger-400 mt-1">{errors.improvements}</p>}
              </div>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-surface-0/30 border-t-surface-0 rounded-full animate-spin" />
                Submitting...
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Submit Evaluation
              </>
            )}
          </button>
        </form>
      </div>
    </Modal>
  );
}
