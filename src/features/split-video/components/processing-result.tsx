import { CheckCircle2, AlertTriangle, FolderCheck, Clock } from 'lucide-react'
import type { DurationSplitResult } from '../../../../shared/processing/processing.types'

interface ProcessingResultProps {
  result: DurationSplitResult | null
}

export function ProcessingResult({ result }: ProcessingResultProps) {
  if (!result) return null

  if (!result.success) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-800 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="size-5 text-red-600 shrink-0" />
          <p className="font-bold">Splitting Failed</p>
        </div>
        <p className="mt-1.5 text-xs text-red-700 pl-7">{result.error.message}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-emerald-50/60 to-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/20">
            <CheckCircle2 className="size-5.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Splitting Complete
            </h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-800">
                {result.totalClips} clip{result.totalClips === 1 ? '' : 's'} created
              </span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                <Clock className="size-3 text-slate-400" />
                {(result.executionTimeMs / 1000).toFixed(1)}s
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50/80 border border-slate-200/60 p-2.5 text-xs text-slate-600">
        <FolderCheck className="size-4 text-emerald-600 shrink-0" />
        <span className="truncate font-mono text-[11px] text-slate-700">
          {result.outputFolder}
        </span>
      </div>
    </div>
  )
}

