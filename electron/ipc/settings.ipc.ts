import { BrowserWindow, dialog, ipcMain } from 'electron'

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
    (event, directory: unknown): void => {
      if (!isTrustedSender(event, window)) {
        throw new Error('Blocked settings request from an untrusted frame.')
      }

      if (typeof directory !== 'string') {
        throw new Error('Invalid output directory.')
      }

      settingsService.updateLastOutputDirectory(directory)
    },
  )
}

export function unregisterSettingsIpc() {
  ipcMain.removeHandler(settingsChannels.selectOutputDirectory)
  ipcMain.removeHandler(settingsChannels.getLastOutputDirectory)
  ipcMain.removeHandler(settingsChannels.updateLastOutputDirectory)
}
