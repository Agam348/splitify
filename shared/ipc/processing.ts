import type {
  DurationSplitRequest,
  DurationSplitResult,
  SplitProgressEvent,
} from '../processing/processing.types'

export const processingChannels = {
  splitByDuration: 'processing:split-by-duration',
  splitProgress: 'processing:split-progress',
  cancelProcessing: 'processing:cancel',
} as const

export interface ProcessingApi {
  splitByDuration: (
    request: DurationSplitRequest,
  ) => Promise<DurationSplitResult>
  cancel: () => Promise<void>
  onProgress: (callback: (event: SplitProgressEvent) => void) => void
  offProgress: (callback: (event: SplitProgressEvent) => void) => void
}
