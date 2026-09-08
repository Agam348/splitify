import { BrowserWindow, ipcMain } from 'electron'

import { processingChannels } from '../../shared/ipc/processing'
import type {
  DurationSplitRequest,
  DurationSplitResult,
  SplitProgressEvent,
} from '../../shared/processing/processing.types'
import { FFmpegService } from '../services/ffmpeg/ffmpeg.service'
import { MediaService } from '../services/media.service'
import { ProcessingService } from '../services/processing.service'
import { isTrustedSender } from './ipc-security'

function isDurationSplitRequest(value: unknown): value is DurationSplitRequest {
  if (!value || typeof value !== 'object') return false

  const request = value as Record<string, unknown>

  const hasBase =
    typeof request.inputPath === 'string' &&
    request.inputPath.length > 0 &&
    request.inputPath.length <= 4096 &&
    !request.inputPath.includes('\0') &&
    typeof request.outputFolder === 'string' &&
    request.outputFolder.length > 0 &&
    request.outputFolder.length <= 4096 &&
    !request.outputFolder.includes('\0') &&
    typeof request.projectName === 'string' &&
    request.projectName.trim().length > 0 &&
    request.projectName.length <= 120 &&
    !request.projectName.includes('\0')

  if (!hasBase) return false

  if (request.splitMethod === 'duration') {
    return (
      typeof request.clipDurationSeconds === 'number' &&
      Number.isFinite(request.clipDurationSeconds) &&
      request.clipDurationSeconds > 0 &&
      request.clipDurationSeconds <= 864000
    )
  }

  if (request.splitMethod === 'equal-parts') {
    return (
      typeof request.equalParts === 'number' &&
      Number.isInteger(request.equalParts) &&
      request.equalParts >= 2 &&
      request.equalParts <= 1000
    )
  }

  return false
}

// Module-level instance so unregister can clear it.
let processingService: ProcessingService | null = null

/**
 * Registers processing IPC handlers.
 *
 * The emitProgress callback is constructed here so that webContents.send
 * stays inside the IPC layer. ProcessingService itself has no Electron dependency.
 */
export function registerProcessingIpc(
  window: BrowserWindow,
  ffmpegService: FFmpegService,
  mediaService: MediaService,
) {
  // The IPC layer owns the Electron-specific send call.
  const emitProgress = (event: SplitProgressEvent) => {
    window.webContents.send(processingChannels.splitProgress, event)
  }

  processingService = new ProcessingService(ffmpegService, mediaService, emitProgress)

  ipcMain.handle(
    processingChannels.splitByDuration,
    async (event, request: unknown): Promise<DurationSplitResult> => {
      if (!isTrustedSender(event, window)) {
        return {
          success: false,
          error: { code: 'INVALID_INPUT', message: 'The request was rejected.' },
          outputFolder: '',
          executionTimeMs: 0,
        }
      }
      if (!isDurationSplitRequest(request)) {
        return {
          success: false,
          error: { code: 'INVALID_INPUT', message: 'The request is invalid.' },
          outputFolder: '',
          executionTimeMs: 0,
        }
      }

      return processingService!.splitByDuration(request)
    },
  )
  ipcMain.handle(
    processingChannels.cancelProcessing,
    (event): void => {
      if (!isTrustedSender(event, window)) return
      processingService?.cancel()
    },
  )
}

export function unregisterProcessingIpc() {
  ipcMain.removeHandler(processingChannels.splitByDuration)
  ipcMain.removeHandler(processingChannels.cancelProcessing)
  processingService = null
}
