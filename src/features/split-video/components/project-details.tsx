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
    <div className="space-y-2">
      <Label htmlFor="project-name">
        Project Name
      </Label>

      <Input
        id="project-name"
        value={projectName}
        placeholder="e.g. Summer Campaign"
        aria-invalid={Boolean(error)}
        onChange={(event) => onProjectNameChange(event.target.value)}
      />

      <p className={error ? 'text-xs text-red-600' : 'text-xs text-muted-foreground'}>
        {error ?? 'Clips will use this name followed by their part number.'}
      </p>
    </div>
  )
}
