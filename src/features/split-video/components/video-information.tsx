import { Film } from 'lucide-react'

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
  'Duration',
  'Resolution',
  'Frame rate',
  'File size',
  'Container',
].map((label) => ({ label, value: '—' }))

export function VideoInformation({
  isLoading,
  metadata,
  error,
}: VideoInformationProps) {
  const details = metadata ? getVideoDetails(metadata) : emptyDetails
  const description = isLoading
    ? 'Reading video information...'
    : error ?? (metadata ? 'Video information' : 'Select a video to view its details')

  return (
    <Card>
      <CardHeader className="flex-row items-center gap-3 space-y-0 border-b border-slate-100 py-4">
        <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Film className="size-4" />
        </div>

        <div className="min-w-0">
          <CardTitle className="truncate">
            {metadata?.fileName ?? 'No video selected'}
          </CardTitle>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 pt-5 sm:grid-cols-5">
        {details.map((detail) => (
          <div key={detail.label} className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              {detail.label}
            </p>

            <p className="mt-1 truncate text-sm font-semibold text-slate-800">
              {detail.value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
