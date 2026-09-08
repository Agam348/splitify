import { Tag, Sparkles } from 'lucide-react'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'

interface ProjectDetailsProps {
  error?: string
  projectName: string
  onProjectNameChange: (value: string) => void
}

export function ProjectDetails({
  error,
  projectName,
  onProjectNameChange,
}: ProjectDetailsProps) {
  const previewName = projectName.trim() ? projectName.trim() : 'clip'

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label htmlFor="project-name" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Tag className="size-3.5 text-indigo-500" />
          <span>Project Name / Prefix</span>
        </Label>
        
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
          <Sparkles className="size-3 text-indigo-400" />
          <span>Pattern: <span className="text-slate-600 font-medium">{previewName}_001.ext</span></span>
        </div>
      </div>

      <Input
        id="project-name"
        value={projectName}
        placeholder="e.g. Tutorial_Part or Highlights"
        aria-invalid={Boolean(error)}
        onChange={(event) => onProjectNameChange(event.target.value)}
        className="font-medium text-slate-900"
      />

      <p className={error ? 'text-xs text-red-600' : 'text-xs text-slate-400'}>
        {error ?? 'Each split clip is saved with this prefix followed by its segment index.'}
      </p>
    </div>
  )
}

