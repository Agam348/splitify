import { BrowserWindow, ipcMain } from 'electron'

import {
  mediaChannels,
  type VideoMetadata,
} from '../../shared/ipc/media'
import { MediaService } from '../services/media.service'
import { isTrustedSender } from './ipc-security'

export function registerMediaIpc(
  window: BrowserWindow,
  mediaService: MediaService,
) {
  ipcMain.handle(
    mediaChannels.getVideoMetadata,
    async (event, filePath: unknown): Promise<VideoMetadata> => {
      if (!isTrustedSender(event, window)) {
        throw new Error('Blocked media request from an untrusted frame.')
      }

      if (typeof filePath !== 'string') {
        throw new Error('Invalid video path.')
      }

      try {
        return await mediaService.getVideoMetadata(filePath)
      } catch {
        throw new Error('Unable to read video metadata.')
      }
    },
  )
}

export function unregisterMediaIpc() {
  ipcMain.removeHandler(mediaChannels.getVideoMetadata)
}
