import { FolderOpen } from 'lucide-react'

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
    <div className="space-y-2">
      <Label htmlFor="output-folder">
        Output Folder
      </Label>

      <div className="flex gap-2">
        <Input
          id="output-folder"
          value={isLoading ? 'Loading saved folder...' : outputFolder ?? ''}
          placeholder="Choose an output folder"
          readOnly
        />

        <Button
          type="button"
          variant="outline"
          className="shrink-0 gap-2"
          disabled={isLoading || isSelecting}
          onClick={onChoose}
        >
          <FolderOpen className="size-4" />
          {isSelecting ? 'Choosing...' : 'Choose'}
        </Button>
      </div>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
