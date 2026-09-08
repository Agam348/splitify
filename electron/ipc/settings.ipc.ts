import { BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'node:path'
import { stat } from 'node:fs/promises'

import {
  settingsChannels,
  type OutputDirectory,
} from '../../shared/ipc/settings'
import { SettingsService } from '../services/settings.service'
import { isTrustedSender } from './ipc-security'

export function registerSettingsIpc(
  window: BrowserWindow,
  settingsService: SettingsService,
) {
  ipcMain.handle(
    settingsChannels.selectOutputDirectory,
    async (event): Promise<OutputDirectory> => {
      if (!isTrustedSender(event, window)) {
        throw new Error('Blocked settings request from an untrusted frame.')
      }

      const result = await dialog.showOpenDialog(window, {
        title: 'Select an output folder',
        defaultPath: settingsService.getLastOutputDirectory() ?? undefined,
        properties: ['openDirectory', 'createDirectory'],
      })

      if (result.canceled || result.filePaths.length === 0) {
        return null
      }

      return result.filePaths[0]
    },
  )

  ipcMain.handle(
    settingsChannels.getLastOutputDirectory,
    (event): OutputDirectory => {
      if (!isTrustedSender(event, window)) {
        throw new Error('Blocked settings request from an untrusted frame.')
      }

      return settingsService.getLastOutputDirectory()
    },
  )

  ipcMain.handle(
    settingsChannels.updateLastOutputDirectory,
    async (event, directory: unknown): Promise<void> => {
      if (!isTrustedSender(event, window)) {
        throw new Error('Blocked settings request from an untrusted frame.')
      }

      if (
        typeof directory !== 'string' ||
        directory.length === 0 ||
        directory.length > 4096 ||
        directory.includes('\0') ||
        !path.isAbsolute(directory)
      ) {
        throw new Error('Invalid output directory.')
      }

      const normalized = path.normalize(directory)
      try {
        const stats = await stat(normalized)
        if (!stats.isDirectory()) {
          throw new Error('Path is not a directory.')
        }
      } catch {
        throw new Error('Output directory is invalid or inaccessible.')
      }

      settingsService.updateLastOutputDirectory(normalized)
    },
  )
}

export function unregisterSettingsIpc() {
  ipcMain.removeHandler(settingsChannels.selectOutputDirectory)
  ipcMain.removeHandler(settingsChannels.getLastOutputDirectory)
  ipcMain.removeHandler(settingsChannels.updateLastOutputDirectory)
}
