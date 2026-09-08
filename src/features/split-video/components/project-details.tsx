import { Tag } from 'lucide-react'
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
  return (
    <div className="space-y-2.5">
      <Label htmlFor="project-name" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
        <Tag className="size-3.5 text-emerald-600" />
        <span>Project Name / Prefix</span>
      </Label>

      <Input
        id="project-name"
        value={projectName}
        placeholder="e.g. Tutorial_Part or Highlights"
        aria-invalid={Boolean(error)}
        onChange={(event) => onProjectNameChange(event.target.value)}
        className="font-medium text-slate-900"
      />

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

