import type {
  DurationSplitRequest,
  DurationSplitResult,
  ProcessingErrorCode,
} from '../../shared/processing/processing.types'
import { FFmpegService } from './ffmpeg/ffmpeg.service'
import type { FFmpegErrorCode } from './ffmpeg/ffmpeg.types'

const publicErrorCodes: Record<
  FFmpegErrorCode,
  Exclude<ProcessingErrorCode, 'PROCESSING_BUSY'>
> = {
  MISSING_FFMPEG: 'PROCESSOR_UNAVAILABLE',
  INVALID_INPUT: 'INVALID_INPUT',
  INVALID_PATH: 'INVALID_PATH',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  DISK_FULL: 'DISK_FULL',
  UNSUPPORTED_MEDIA: 'UNSUPPORTED_MEDIA',
  OUTPUT_COLLISION: 'OUTPUT_COLLISION',
  FFMPEG_FAILURE: 'PROCESSING_FAILED',
  UNEXPECTED_EXIT: 'UNEXPECTED_EXIT',
}

export class ProcessingService {
  private isProcessing = false

  constructor(private readonly ffmpegService: FFmpegService) {}

  async splitByDuration(request: DurationSplitRequest): Promise<DurationSplitResult> {
    if (this.isProcessing) {
      return {
        success: false,
        error: {
          code: 'PROCESSING_BUSY',
          message: 'Another video is already being processed.',
        },
        outputFolder: request.outputFolder,
        executionTimeMs: 0,
      }
    }

    this.isProcessing = true

    try {
      const result = await this.ffmpegService.splitByDuration(request)

      if (result.success) return result

      const code = publicErrorCodes[result.error.code]
      const message = code === 'PROCESSOR_UNAVAILABLE'
        ? 'The video processor is unavailable.'
        : code === 'PROCESSING_FAILED'
          ? 'Video processing failed.'
          : result.error.message

      return {
        ...result,
        error: { code, message },
      }
    } finally {
      this.isProcessing = false
    }
  }
}
