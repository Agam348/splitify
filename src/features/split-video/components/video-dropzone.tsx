import {
  FileVideo2,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  FileCheck2,
  AlertCircle,
} from 'lucide-react'

import { Button } from '../../../components/ui/button'

interface VideoDropzoneProps {
  error?: string
  isReadingMetadata: boolean
  isSelectingVideo: boolean
  selectedVideoPath: string | null
  onBrowseVideo: () => void
}

const SUPPORTED_FORMATS = ['MP4', 'MOV', 'MKV', 'AVI', 'WEBM']

export function VideoDropzone({
  error,
  isReadingMetadata,
  isSelectingVideo,
  selectedVideoPath,
  onBrowseVideo,
}: VideoDropzoneProps) {
  const fileName = selectedVideoPath
    ? selectedVideoPath.split(/[/\\]/).pop()
    : null

  if (selectedVideoPath) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 via-white to-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/25">
              <FileCheck2 className="size-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-indigo-700">
                  Master Source
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="size-3.5" />
                  Loaded
                </span>
              </div>
              <h3 className="mt-1 truncate text-sm font-bold text-slate-900">
                {fileName}
              </h3>
              <p className="mt-0.5 truncate font-mono text-[11px] text-slate-500" title={selectedVideoPath}>
                {selectedVideoPath}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5 self-end sm:self-center"
            disabled={isSelectingVideo || isReadingMetadata}
            onClick={onBrowseVideo}
          >
            <RefreshCw className="size-3.5" />
            {isSelectingVideo ? 'Opening...' : 'Change Video'}
          </Button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 border border-red-200">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </section>
    )
  }

  return (
    <section className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200/90 bg-gradient-to-b from-white via-slate-50/40 to-slate-50/80 px-6 py-10 text-center shadow-card transition-all duration-200 hover:border-indigo-400 hover:bg-slate-50/60">
      <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50/50 shadow-2xs transition-transform duration-200 group-hover:scale-105">
        <UploadCloud className="size-7" />
      </div>

      <h2 className="mt-4 text-base font-bold tracking-tight text-slate-900">
        Drop master video to split
      </h2>

      <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
        Lossless splitting without quality loss. All video frames are preserved offline on your device.
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5">
        {SUPPORTED_FORMATS.map((ext) => (
          <span
            key={ext}
            className="rounded-md border border-slate-200/70 bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-slate-500 shadow-2xs"
          >
            {ext}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <Button
          type="button"
          size="default"
          className="gap-2 shadow-sm"
          disabled={isSelectingVideo || isReadingMetadata}
          onClick={onBrowseVideo}
        >
          <FileVideo2 className="size-4" />
          {isSelectingVideo
            ? 'Opening file picker...'
            : isReadingMetadata
              ? 'Inspecting video...'
              : 'Browse Video File'}
        </Button>
      </div>

      {error && (
        <div className="mx-auto mt-4 max-w-md flex items-center justify-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700 border border-red-200">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </section>
  )
}

