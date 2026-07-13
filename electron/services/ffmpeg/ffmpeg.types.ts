import type { DurationSplitRequest } from '../../../shared/processing/processing.types'

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
export type FFmpegSplitRequest = DurationSplitRequest
