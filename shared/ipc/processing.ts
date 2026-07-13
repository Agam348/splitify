import type {
  DurationSplitRequest,
  DurationSplitResult,
} from '../processing/processing.types'

export const processingChannels = {
  splitByDuration: 'processing:split-by-duration',
} as const

export interface ProcessingApi {
  splitByDuration: (
    request: DurationSplitRequest,
  ) => Promise<DurationSplitResult>
}
