import {
  FileVideo2,
  UploadCloud,
} from 'lucide-react'

import { Button } from '../../../components/ui/button'

interface VideoDropzoneProps {
  error?: string
  isReadingMetadata: boolean
  isSelectingVideo: boolean
  selectedVideoPath: string | null
  onBrowseVideo: () => void
}

export function VideoDropzone({
  error,
  isReadingMetadata,
  isSelectingVideo,
  selectedVideoPath,
  onBrowseVideo,
}: VideoDropzoneProps) {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-9 text-center shadow-sm">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-primary">
        <UploadCloud className="size-6" />
      </div>

      <h2 className="mt-4 text-base font-semibold text-slate-900">
        Drop your video here
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        MP4, MOV, MKV, AVI, or WEBM
      </p>

      <Button
        type="button"
        className="mt-5 gap-2"
        disabled={isSelectingVideo || isReadingMetadata}
        onClick={onBrowseVideo}
      >
        <FileVideo2 className="size-4" />
        {isSelectingVideo
          ? 'Opening...'
          : isReadingMetadata
            ? 'Reading video...'
            : 'Browse Video'}
      </Button>

      <p className="mt-3 truncate text-xs text-slate-400">
        {selectedVideoPath ?? 'Your files never leave this device'}
      </p>

      {error && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}
    </section>
  )
}
