import type {
  DurationSplitRequest,
  DurationSplitResult,
  ProcessingErrorCode,
  SplitProgressEvent,
} from '../../shared/processing/processing.types'
import { FFmpegService } from './ffmpeg/ffmpeg.service'
import { MediaService } from './media.service'
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
  CANCELLED: 'PROCESSING_CANCELLED',
}

/**
 * Callback injected by the IPC layer so ProcessingService can forward
 * progress events without depending on Electron's webContents API.
 */
export type EmitProgressFn = (event: SplitProgressEvent) => void

export class ProcessingService {
  private isProcessing = false
  private currentAbortController: AbortController | null = null

  constructor(
    private readonly ffmpegService: FFmpegService,
    private readonly mediaService: MediaService,
    private readonly emitProgress?: EmitProgressFn,
  ) {}

  /**
   * Cancels the current processing job, if one is running.
   * Cleanup of temporary files is handled inside FFmpegService's catch block.
   */
  cancel(): void {
    this.currentAbortController?.abort()
  }

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
    this.currentAbortController = new AbortController()

    try {
      // Always fetch metadata:
      //  – for 'equal-parts': needed to compute clipDurationSeconds
      //  – for both modes: needed to supply totalDurationSeconds to FFmpegService
      //    so it can calculate progress percentage.
      const metadata = await this.mediaService.getVideoMetadata(request.inputPath)
      const { durationSeconds: totalDurationSeconds } = metadata

      const clipDurationSeconds =
        request.splitMethod === 'duration'
          ? request.clipDurationSeconds
          : totalDurationSeconds / request.equalParts

      // ── Build progress callback ─────────────────────────────────────────
      const onFFmpegProgress = this.emitProgress
        ? (ffmpegEvent: {
            processedSeconds: number
            percentage: number
            currentClip: number
            totalClips: number
          }) => {
            this.emitProgress!({
              percentage: ffmpegEvent.percentage,
              currentClip: ffmpegEvent.currentClip,
              totalClips: ffmpegEvent.totalClips,
              processedSeconds: ffmpegEvent.processedSeconds,
              state: 'processing',
            })
          }
        : undefined

      const result = await this.ffmpegService.splitByDuration(
        {
          inputPath: request.inputPath,
          outputFolder: request.outputFolder,
          projectName: request.projectName,
          clipDurationSeconds,
          totalDurationSeconds,
        },
        onFFmpegProgress,
        this.currentAbortController.signal,
      )

      // ── Success: emit final 'done' event before returning ───────────────
      if (result.success) {
        const estimatedTotalClips = Math.max(
          1,
          Math.ceil(totalDurationSeconds / clipDurationSeconds),
        )
        this.emitProgress?.({
          percentage: 100,
          currentClip: result.totalClips,
          totalClips: estimatedTotalClips,
          processedSeconds: totalDurationSeconds,
          state: 'done',
        })
        return result
      }

      // ── Failure: map internal code to public code ────────────────────────
      const code = publicErrorCodes[result.error.code]

      // Emit a 'cancelled' progress event so the renderer can reset.
      if (code === 'PROCESSING_CANCELLED') {
        this.emitProgress?.({
          percentage: 0,
          currentClip: 0,
          totalClips: 0,
          processedSeconds: 0,
          state: 'cancelled',
        })
        return {
          success: false,
          error: { code, message: 'Processing was cancelled.' },
          outputFolder: request.outputFolder,
          executionTimeMs: result.executionTimeMs,
        }
      }

      const message =
        code === 'PROCESSOR_UNAVAILABLE'
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
      this.currentAbortController = null
    }
  }
}
