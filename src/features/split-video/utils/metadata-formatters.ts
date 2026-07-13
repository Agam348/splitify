import type { VideoMetadata } from '../../../../shared/ipc/media'

export function formatDuration(durationSeconds: number) {
  const totalSeconds = Math.round(durationSeconds)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':')
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / 1024 ** unitIndex

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

export function getVideoDetails(metadata: VideoMetadata) {
  return [
    { label: 'Duration', value: formatDuration(metadata.durationSeconds) },
    { label: 'Resolution', value: `${metadata.width} × ${metadata.height}` },
    {
      label: 'Frame rate',
      value: `${Number(metadata.frameRate.toFixed(2))} fps`,
    },
    { label: 'File size', value: formatFileSize(metadata.fileSizeBytes) },
    { label: 'Container', value: metadata.containerFormat },
  ]
}
