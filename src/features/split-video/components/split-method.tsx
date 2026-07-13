import { Clock3, Layers3 } from 'lucide-react'

import type { SplitMethod as SplitMethodValue } from '../../../../shared/validation/validation.types'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { cn } from '../../../lib/utils'
import { durationPresets } from '../data/placeholders'

interface SplitMethodProps {
  durationError?: string
  durationInput: string
  equalPartsError?: string
  equalPartsInput: string
  isCustomDuration: boolean
  splitMethod: SplitMethodValue
  onDurationChange: (value: string) => void
  onDurationPresetChange: (value: number | null) => void
  onEqualPartsChange: (value: string) => void
  onSplitMethodChange: (value: SplitMethodValue) => void
}

export function SplitMethod({
  durationError,
  durationInput,
  equalPartsError,
  equalPartsInput,
  isCustomDuration,
  splitMethod,
  onDurationChange,
  onDurationPresetChange,
  onEqualPartsChange,
  onSplitMethodChange,
}: SplitMethodProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-semibold text-foreground">
        Split Method
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className={cn(
          'flex cursor-pointer gap-3 rounded-xl border bg-white p-4',
          splitMethod === 'duration' && 'border-2 border-primary bg-blue-50/60',
        )}>
          <input
            type="radio"
            name="split-method"
            className="mt-1 accent-blue-600"
            checked={splitMethod === 'duration'}
            onChange={() => onSplitMethodChange('duration')}
          />

          <Clock3 className="mt-0.5 size-5 text-primary" />

          <span>
            <span className="block text-sm font-semibold">By duration</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Create clips of a fixed length
            </span>
          </span>
        </label>

        <label className={cn(
          'flex cursor-pointer gap-3 rounded-xl border bg-white p-4',
          splitMethod === 'equal-parts' && 'border-2 border-primary bg-blue-50/60',
        )}>
          <input
            type="radio"
            name="split-method"
            className="mt-1 accent-blue-600"
            checked={splitMethod === 'equal-parts'}
            onChange={() => onSplitMethodChange('equal-parts')}
          />

          <Layers3 className="mt-0.5 size-5 text-slate-500" />

          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Equal parts</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Divide into a set number of clips
            </span>
          </span>

          <Input
            aria-label="Number of equal parts"
            type="number"
            min="2"
            max="1000"
            className="h-8 w-20 px-2 text-center"
            value={equalPartsInput}
            disabled={splitMethod !== 'equal-parts'}
            aria-invalid={Boolean(equalPartsError)}
            onChange={(event) => onEqualPartsChange(event.target.value)}
          />
        </label>
      </div>

      {splitMethod === 'equal-parts' && equalPartsError && (
        <p className="text-xs text-red-600">{equalPartsError}</p>
      )}

      <div className="space-y-2.5">
        <Label>Clip duration</Label>

        <div className="flex flex-wrap gap-2">
          {durationPresets.map((preset) => {
            const isSelected = preset.value === null
              ? isCustomDuration
              : !isCustomDuration && durationInput === String(preset.value)

            return (
              <Button
                key={preset.label}
                type="button"
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                className="min-w-16"
                disabled={splitMethod !== 'duration'}
                onClick={() => onDurationPresetChange(preset.value)}
              >
                {preset.label}
              </Button>
            )
          })}
        </div>

        {isCustomDuration && splitMethod === 'duration' && (
          <Input
            type="number"
            min="0.1"
            step="0.1"
            value={durationInput}
            placeholder="Duration in seconds"
            aria-label="Custom clip duration in seconds"
            aria-invalid={Boolean(durationError)}
            onChange={(event) => onDurationChange(event.target.value)}
          />
        )}

        {splitMethod === 'duration' && durationError && (
          <p className="text-xs text-red-600">{durationError}</p>
        )}
      </div>
    </fieldset>
  )
}
