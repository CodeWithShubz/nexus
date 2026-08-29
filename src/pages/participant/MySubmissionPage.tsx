import { useState } from 'react';
import { FileCode2, Upload, CheckCircle2, Clock } from 'lucide-react';
import { useStore } from '@/store/StoreContext';
import { useToast } from '@/components/ui/Toast';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/cn';

const techOptions = ['React', 'TypeScript', 'Node.js', 'Python', 'PyTorch', 'FastAPI', 'Go', 'Rust', 'Solidity', 'MongoDB', 'Postgres', 'GraphQL', 'Docker', 'Kubernetes', 'AWS', 'Figma'];

export function MySubmissionPage() {
  const { currentUser, teams, users } = useStore();
  const { toast } = useToast();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!currentUser) return null;

  const team = teams.find((t) => t.id === currentUser.teamId);
  const teammates = team ? team.memberIds.map((id) => users.find((u) => u.id === id)).filter(Boolean) : [];
  const isSubmitted = team?.status === 'submitted' || team?.status === 'evaluated';

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) => prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!projectName.trim()) newErrors['projectName'] = 'Project name is required.';
    if (!description.trim()) newErrors['description'] = 'Description is required.';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    toast('Project submitted successfully! Judges can now evaluate your work.', 'success');
    setProjectName('');
    setDescription('');
    setSelectedTechs([]);
    setErrors({});
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-surface-900">My Submission</h1>
        <p className="text-sm text-surface-700 mt-1">Manage your team's project submission.</p>
      </div>

      {team ? (
        <>
          {/* Current submission status */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team: {team.name}</CardTitle>
                {isSubmitted ? (
                  <Badge variant="success"><CheckCircle2 className="w-3 h-3" /> Submitted</Badge>
                ) : (
                  <Badge variant="warning"><Clock className="w-3 h-3" /> Not Submitted</Badge>
                )}
              </div>
            </CardHeader>
            <CardBody>
              <div className="flex items-start gap-4 mb-5">
                <div className="w-12 h-12 rounded-lg bg-accent-500/10 flex items-center justify-center shrink-0">
                  <FileCode2 className="w-6 h-6 text-accent-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-surface-900">{team.projectName}</p>
                  <p className="text-xs text-surface-700 mt-1 leading-relaxed">{team.description}</p>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-[10px] font-semibold text-surface-700 uppercase tracking-wider mb-2">Technologies</p>
                <div className="flex flex-wrap gap-1.5">
                  {team.technologies.map((t) => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-lg bg-surface-200 text-surface-800">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-surface-700 uppercase tracking-wider mb-2">Team Members</p>
                <div className="flex flex-wrap gap-3">
                  {teammates.map((m) => m && (
                    <div key={m.id} className="flex items-center gap-2">
                      <Avatar name={m.name} color={m.avatarColor} size="sm" />
                      <span className="text-xs text-surface-800">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Submit form (only if not yet submitted) */}
          {!isSubmitted && (
            <Card>
              <CardHeader><CardTitle>Submit Your Project</CardTitle></CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-surface-800 mb-1.5">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={(e) => { setProjectName(e.target.value); setErrors((p) => { const n = { ...p }; delete n.projectName; return n; }); }}
                      placeholder="e.g. NeuralForge Studio"
                      className={cn('input', errors.projectName && 'border-danger-500/50')}
                    />
                    {errors.projectName && <p className="text-xs text-danger-400 mt-1">{errors.projectName}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-800 mb-1.5">Project Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => { setDescription(e.target.value); setErrors((p) => { const n = { ...p }; delete n.description; return n; }); }}
                      placeholder="Describe your project in a few sentences..."
                      rows={4}
                      className={cn('input resize-none', errors.description && 'border-danger-500/50')}
                    />
                    {errors.description && <p className="text-xs text-danger-400 mt-1">{errors.description}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-surface-800 mb-1.5">Technologies Used</label>
                    <div className="flex flex-wrap gap-2">
                      {techOptions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => toggleTech(t)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                            selectedTechs.includes(t)
                              ? 'bg-accent-500/10 text-accent-300 border-accent-500/30'
                              : 'bg-surface-200 text-surface-700 border-surface-300/40 hover:bg-surface-300/30'
                          )}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    <Upload className="w-4 h-4" />
                    Submit Project
                  </button>
                </form>
              </CardBody>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardBody>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileCode2 className="w-12 h-12 text-surface-600 mb-3" />
              <p className="text-sm font-medium text-surface-900">No team yet</p>
              <p className="text-xs text-surface-700 mt-1 max-w-sm">Join a team or find teammates through Matchmaking to submit a project.</p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
