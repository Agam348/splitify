import { Loader2, XCircle } from 'lucide-react'
import type { SplitProgressEvent } from '../../../../shared/processing/processing.types'

interface ProgressSectionProps {
  isProcessing: boolean
  progress: SplitProgressEvent | null
  onCancel: () => void
}

export function ProgressSection({
  isProcessing,
  progress,
  onCancel,
}: ProgressSectionProps) {
  if (!isProcessing) return null

  const percentage = progress?.percentage ?? 0
  const state = progress?.state ?? 'processing'
  const currentClip = progress?.currentClip ?? 1
  const totalClips = progress?.totalClips ?? 0

  const isCancelling = state === 'cancelled'
  const isDone = state === 'done'

  const statusLabel = isDone
    ? 'Finalizing exported clips…'
    : isCancelling
      ? 'Cancelling operation…'
      : totalClips > 0
        ? `Cutting clip ${currentClip} of ${totalClips}`
        : 'Initializing FFmpeg pipeline…'

  return (
    <section
      aria-label="Processing progress"
      className="rounded-2xl border border-emerald-100/80 bg-gradient-to-b from-emerald-50/50 via-white to-white p-5 shadow-card"
    >
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <Loader2 className="size-4 animate-spin text-emerald-600 shrink-0" />
          <p className="truncate text-xs font-bold text-slate-800">
            {statusLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {totalClips > 0 && (
            <span className="rounded-md bg-emerald-100/70 px-2 py-0.5 font-mono text-[11px] font-semibold text-emerald-700">
              {currentClip}/{totalClips}
            </span>
          )}
          <span className="font-mono text-sm font-bold tabular-nums text-emerald-600">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Progress bar container */}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200/50"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-[width] duration-300 ease-out shadow-xs"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Footer row */}
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-[11px] text-slate-400">
          Fast copy mode enabled • Lossless stream cutting
        </p>

        {!isDone && !isCancelling && (
          <button
            id="cancel-processing-btn"
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/20"
          >
            <XCircle className="size-3.5" />
            <span>Cancel</span>
          </button>
        )}
      </div>
    </section>
  )
}

