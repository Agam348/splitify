export interface DurationSplitRequest {
  inputPath: string
  outputFolder: string
  projectName: string
  clipDurationSeconds: number
}

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
