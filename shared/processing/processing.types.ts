export interface BaseSplitRequest {
  inputPath: string
  outputFolder: string
  projectName: string
}

export interface SplitByDurationRequest extends BaseSplitRequest {
  splitMethod: 'duration'
  clipDurationSeconds: number
}

export interface SplitByEqualPartsRequest extends BaseSplitRequest {
  splitMethod: 'equal-parts'
  equalParts: number
}

export type DurationSplitRequest = SplitByDurationRequest | SplitByEqualPartsRequest

export type ProcessingErrorCode =
  | 'PROCESSOR_UNAVAILABLE'
  | 'INVALID_INPUT'
  | 'INVALID_PATH'
  | 'PERMISSION_DENIED'
  | 'DISK_FULL'
  | 'UNSUPPORTED_MEDIA'
  | 'OUTPUT_COLLISION'
  | 'PROCESSING_FAILED'
  | 'UNEXPECTED_EXIT'
  | 'PROCESSING_BUSY'
  | 'PROCESSING_CANCELLED'

export interface ProcessingError {
  code: ProcessingErrorCode
  message: string
}

export interface DurationSplitSuccess {
  success: true
  filesCreated: string[]
  outputFolder: string
  totalClips: number
  executionTimeMs: number
}

export interface DurationSplitFailure {
  success: false
  error: ProcessingError
  outputFolder: string
  executionTimeMs: number
}

export type DurationSplitResult =
  | DurationSplitSuccess
  | DurationSplitFailure

export interface SplitProgressEvent {
  /** 0–99 during processing, 100 when done. */
  percentage: number
  /** 1-based index of the clip currently being written. */
  currentClip: number
  /** Estimated total number of clips for this job. */
  totalClips: number
  /** Seconds of input video processed so far. */
  processedSeconds: number
  state: 'processing' | 'done' | 'cancelled'
}
