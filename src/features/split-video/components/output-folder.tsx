import { FolderOpen, FolderCheck, AlertCircle } from 'lucide-react'

import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'

interface OutputFolderProps {
  error: string | null
  isLoading: boolean
  isSelecting: boolean
  outputFolder: string | null
  onChoose: () => void
}

export function OutputFolder({
  error,
  isLoading,
  isSelecting,
  outputFolder,
  onChoose,
}: OutputFolderProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <Label htmlFor="output-folder" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <FolderOpen className="size-3.5 text-indigo-500" />
          <span>Output Destination</span>
        </Label>
        
        {outputFolder && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
            <FolderCheck className="size-3" />
            <span>Ready</span>
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          id="output-folder"
          value={isLoading ? 'Loading saved destination...' : outputFolder ?? ''}
          placeholder="Select an export directory"
          readOnly
          className="font-mono text-xs text-slate-700 bg-slate-50/50"
        />

        <Button
          type="button"
          variant="outline"
          className="shrink-0 gap-2 font-medium"
          disabled={isLoading || isSelecting}
          onClick={onChoose}
        >
          <FolderOpen className="size-4 text-indigo-600" />
          {isSelecting ? 'Selecting...' : 'Browse...'}
        </Button>
      </div>

      {error ? (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          All generated segments will be saved losslessly into this folder.
        </p>
      )}
    </div>
  )
}

