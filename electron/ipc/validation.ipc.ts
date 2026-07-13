import { BrowserWindow, ipcMain } from 'electron'

import {
  validationChannels,
} from '../../shared/ipc/validation'
import type {
  SplitValidationInput,
  ValidationResult,
} from '../../shared/validation/validation.types'
import { ValidationService } from '../../shared/validation/validation.service'
import { isTrustedSender } from './ipc-security'

function isNullableNumber(value: unknown) {
  return value === null || typeof value === 'number'
}

function isNullableString(value: unknown) {
  return value === null || typeof value === 'string'
}

function isSplitValidationInput(value: unknown): value is SplitValidationInput {
  if (!value || typeof value !== 'object') return false

  const input = value as Record<string, unknown>

  return (
    isNullableString(input.videoPath) &&
    isNullableNumber(input.videoDurationSeconds) &&
    typeof input.projectName === 'string' &&
    (input.splitMethod === 'duration' || input.splitMethod === 'equal-parts') &&
    isNullableNumber(input.splitDurationSeconds) &&
    isNullableNumber(input.equalParts) &&
    isNullableString(input.outputFolder)
  )
}

export function registerValidationIpc(
  window: BrowserWindow,
  validationService: ValidationService,
) {
  ipcMain.handle(
    validationChannels.validateSplitConfiguration,
    async (event, input: unknown): Promise<ValidationResult> => {
      if (!isTrustedSender(event, window)) {
        throw new Error('Blocked validation request from an untrusted frame.')
      }

      if (!isSplitValidationInput(input)) {
        throw new Error('Invalid validation input.')
      }

      return validationService.validate(input)
    },
  )
}

export function unregisterValidationIpc() {
  ipcMain.removeHandler(validationChannels.validateSplitConfiguration)
}
