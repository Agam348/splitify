import { Film, Info, Sparkles } from 'lucide-react'

import type { VideoMetadata } from '../../../../shared/ipc/media'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card'
import { getVideoDetails } from '../utils/metadata-formatters'

interface VideoInformationProps {
  isLoading: boolean
  metadata: VideoMetadata | null
  error: string | null
}

const emptyDetails = [
  { label: 'Duration', value: '—' },
  { label: 'Resolution', value: '—' },
  { label: 'Frame rate', value: '—' },
  { label: 'File size', value: '—' },
  { label: 'Container', value: '—' },
]

export function VideoInformation({
  isLoading,
  metadata,
  error,
}: VideoInformationProps) {
  const details = metadata ? getVideoDetails(metadata) : emptyDetails
  const description = isLoading
    ? 'Extracting streams, codecs, and keyframes...'
    : error ?? (metadata ? 'Stream inspection complete' : 'Awaiting video selection')

  return (
    <Card className="border-slate-200/80 bg-white">
      <CardHeader className="flex-row items-center justify-between border-b border-slate-100/90 py-3.5 px-6 space-y-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
            <Film className="size-4" />
          </div>

          <div className="min-w-0">
            <CardTitle className="text-sm font-bold truncate text-slate-900">
              {metadata?.fileName ?? 'Media Inspector'}
            </CardTitle>
            <p className="text-xs text-slate-400 truncate">
              {description}
            </p>
          </div>
        </div>

        {metadata && (
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200/60">
            <Sparkles className="size-3" />
            <span>Lossless Compatible</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {details.map((detail) => (
            <div
              key={detail.label}
              className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/70 p-3 transition-colors hover:border-slate-200 hover:bg-white"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {detail.label}
              </p>

              <p className="mt-1 truncate font-mono text-sm font-semibold tabular-nums text-slate-800">
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200">
            <Info className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

