import { BrowserWindow, ipcMain } from 'electron'

import { processingChannels } from '../../shared/ipc/processing'
import type {
  DurationSplitRequest,
  DurationSplitResult,
} from '../../shared/processing/processing.types'
import { ProcessingService } from '../services/processing.service'
import { isTrustedSender } from './ipc-security'

function isDurationSplitRequest(value: unknown): value is DurationSplitRequest {
  if (!value || typeof value !== 'object') return false

  const request = value as Record<string, unknown>

  return (
    typeof request.inputPath === 'string' &&
    typeof request.outputFolder === 'string' &&
    typeof request.projectName === 'string' &&
    typeof request.clipDurationSeconds === 'number'
  )
}

export function registerProcessingIpc(
  window: BrowserWindow,
  processingService: ProcessingService,
) {
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

      return processingService.splitByDuration(request)
    },
  )
}

export function unregisterProcessingIpc() {
  ipcMain.removeHandler(processingChannels.splitByDuration)
}
