export type FFmpegErrorCode =
  | 'MISSING_FFMPEG'
  | 'INVALID_INPUT'
  | 'INVALID_PATH'
  | 'PERMISSION_DENIED'
  | 'DISK_FULL'
  | 'UNSUPPORTED_MEDIA'
  | 'OUTPUT_COLLISION'
  | 'FFMPEG_FAILURE'
  | 'UNEXPECTED_EXIT'
  | 'CANCELLED'

export interface FFmpegFailure {
  success: false
  error: {
    code: FFmpegErrorCode
    message: string
  }
  outputFolder: string
  executionTimeMs: number
}

export interface FFmpegSuccess {
  success: true
  filesCreated: string[]
  outputFolder: string
  totalClips: number
  executionTimeMs: number
}

export type FFmpegResult = FFmpegSuccess | FFmpegFailure

export interface FFmpegSplitRequest {
  inputPath: string
  outputFolder: string
  projectName: string
  clipDurationSeconds: number
  /** Full duration of the source video – used to compute progress percentage. */
  totalDurationSeconds: number
}

/**
 * Structured progress data computed inside FFmpegService from raw FFmpeg output.
 * Never exposed to the renderer; ProcessingService converts this to SplitProgressEvent.
 */
export interface FFmpegProgressEvent {
  processedSeconds: number
  percentage: number     // 0–99, capped before 'done'
  currentClip: number    // 1-based estimate
  totalClips: number     // estimated from duration / clipDuration
}

export type FFmpegProgressCallback = (event: FFmpegProgressEvent) => void
