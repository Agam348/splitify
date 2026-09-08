import { Clock3, Layers3, Sliders, AlertCircle } from 'lucide-react'

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
  const isDuration = splitMethod === 'duration'
  const isEqualParts = splitMethod === 'equal-parts'

  return (
    <fieldset className="space-y-4">
      <div className="flex items-center justify-between">
        <legend className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Sliders className="size-3.5 text-blue-600" />
          <span>Splitting Strategy</span>
        </legend>
        <span className="text-xs text-slate-400">Choose interval mode</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* By Duration Card */}
        <label
          className={cn(
            'group relative flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all duration-150 select-none',
            isDuration
              ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
              : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50',
          )}
        >
          <input
            type="radio"
            name="split-method"
            className="sr-only"
            checked={isDuration}
            onChange={() => onSplitMethodChange('duration')}
          />

          <div
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded-full border transition-all',
              isDuration
                ? 'border-blue-600 bg-blue-600'
                : 'border-slate-300 bg-white group-hover:border-slate-400',
            )}
          >
            {isDuration && <div className="size-1.5 rounded-full bg-white" />}
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Clock3 className="size-4.5" />
          </div>

          <div className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-slate-900">
              Fixed Duration
            </span>
          </div>
        </label>

        {/* Equal Parts Card */}
        <label
          className={cn(
            'group relative flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-all duration-150 select-none',
            isEqualParts
              ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-1 ring-blue-500/20'
              : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50',
          )}
        >
          <input
            type="radio"
            name="split-method"
            className="sr-only"
            checked={isEqualParts}
            onChange={() => onSplitMethodChange('equal-parts')}
          />

          <div
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded-full border transition-all',
              isEqualParts
                ? 'border-blue-600 bg-blue-600'
                : 'border-slate-300 bg-white group-hover:border-slate-400',
            )}
          >
            {isEqualParts && <div className="size-1.5 rounded-full bg-white" />}
          </div>

          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            <Layers3 className="size-4.5" />
          </div>

          <div className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-slate-900">
              Equal Segments
            </span>

            {isEqualParts && (
              <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Input
                  aria-label="Number of equal parts"
                  type="number"
                  min="2"
                  max="1000"
                  className="h-8 w-20 px-2 text-center font-mono font-semibold"
                  value={equalPartsInput}
                  disabled={!isEqualParts}
                  aria-invalid={Boolean(equalPartsError)}
                  onChange={(event) => onEqualPartsChange(event.target.value)}
                />
                <span className="text-xs font-semibold text-slate-600">clips</span>
              </div>
            )}
          </div>
        </label>
      </div>

      {isEqualParts && equalPartsError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{equalPartsError}</span>
        </div>
      )}

      {/* Duration configuration sub-panel */}
      {isDuration && (
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Clip Length Presets
          </Label>

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
                  className={cn(
                    'min-w-16 font-mono text-xs',
                    isSelected && 'shadow-xs',
                  )}
                  onClick={() => onDurationPresetChange(preset.value)}
                >
                  {preset.label}
                </Button>
              )
            })}
          </div>

          {isCustomDuration && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2 max-w-xs">
                <Input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={durationInput}
                  placeholder="e.g. 15.5"
                  aria-label="Custom clip duration in seconds"
                  aria-invalid={Boolean(durationError)}
                  onChange={(event) => onDurationChange(event.target.value)}
                  className="font-mono text-sm"
                />
                <span className="text-xs font-semibold text-slate-500">seconds</span>
              </div>
            </div>
          )}

          {durationError && (
            <div className="flex items-center gap-1.5 text-xs text-red-600">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{durationError}</span>
            </div>
          )}
        </div>
      )}
    </fieldset>
  )
}

