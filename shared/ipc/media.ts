export const mediaChannels = {
  getVideoMetadata: 'media:get-video-metadata',
} as const

export interface VideoMetadata {
  fileName: string
  durationSeconds: number
  width: number
  height: number
  frameRate: number
  fileSizeBytes: number
  containerFormat: string
}

export interface MediaApi {
  getVideoMetadata: (filePath: string) => Promise<VideoMetadata>
}
