import { useCallback, useState } from 'react'

import type { VideoMetadata } from '../../../../shared/ipc/media'

export function useVideoPicker() {
  const [selectedVideoPath, setSelectedVideoPath] = useState<string | null>(null)
  const [isSelectingVideo, setIsSelectingVideo] = useState(false)
  const [isReadingMetadata, setIsReadingMetadata] = useState(false)
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null)
  const [metadataError, setMetadataError] = useState<string | null>(null)

  const selectVideo = useCallback(async () => {
    if (!window.splitify?.dialogs) {
      setMetadataError('Video selection requires the Splitify desktop application.')
      return
    }

    setIsSelectingVideo(true)

    let filePath: string | null = null

    try {
      const result = await window.splitify.dialogs.selectVideo()
      filePath = result?.filePath ?? null
    } finally {
      setIsSelectingVideo(false)
    }

    if (!filePath) return

    setSelectedVideoPath(filePath)
    setMetadata(null)
    setMetadataError(null)
    setIsReadingMetadata(true)

    try {
      setMetadata(await window.splitify.media.getVideoMetadata(filePath))
    } catch {
      setMetadataError('Unable to read video metadata.')
    } finally {
      setIsReadingMetadata(false)
    }
  }, [])

  return {
    isReadingMetadata,
    isSelectingVideo,
    metadata,
    metadataError,
    selectedVideoPath,
    selectVideo,
  }
}
