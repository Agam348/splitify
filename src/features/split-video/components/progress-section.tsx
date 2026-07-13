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
    ? 'Finishing up…'
    : isCancelling
      ? 'Cancelling…'
      : totalClips > 0
        ? `Writing clip ${currentClip} of ${totalClips}`
        : 'Starting…'

  return (
    <section
      aria-label="Processing progress"
      className="rounded-xl border border-blue-100 bg-blue-50/60 p-5"
    >
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <p className="truncate text-sm font-semibold text-slate-700">
          {statusLabel}
        </p>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-primary">
          {percentage}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 w-full overflow-hidden rounded-full bg-blue-100"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Footer row: clip counter + cancel button */}
      <div className="mt-3 flex items-center justify-between gap-4">
        {totalClips > 0 ? (
          <p className="text-xs text-muted-foreground">
            {isDone
              ? `${totalClips} clip${totalClips === 1 ? '' : 's'} ready`
              : `Clip ${currentClip} of ${totalClips}`}
          </p>
        ) : (
          <span />
        )}

        {/* Cancel is hidden once we're in done/cancelling state */}
        {!isDone && !isCancelling && (
          <button
            id="cancel-processing-btn"
            type="button"
            onClick={onCancel}
            className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-red-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </section>
  )
}
