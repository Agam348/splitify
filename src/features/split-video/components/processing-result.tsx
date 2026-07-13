import type { DurationSplitResult } from '../../../../shared/processing/processing.types'

interface ProcessingResultProps {
  result: DurationSplitResult | null
}

export function ProcessingResult({ result }: ProcessingResultProps) {
  if (!result) return null

  if (!result.success) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
        <p className="font-semibold">Split failed</p>
        <p className="mt-1">{result.error.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
      <p className="font-semibold">
        Created {result.totalClips} clip{result.totalClips === 1 ? '' : 's'}
      </p>
      <p className="mt-1 truncate">{result.outputFolder}</p>
      <p className="mt-1 text-xs text-emerald-700">
        Completed in {(result.executionTimeMs / 1000).toFixed(1)} seconds
      </p>
    </div>
  )
}
