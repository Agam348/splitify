import { BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'node:path'

import {
  dialogChannels,
  type SelectVideoResult,
} from '../../shared/ipc/dialog'
import { supportedVideoExtensions } from '../../shared/media/video-formats'
import { isTrustedSender } from './ipc-security'

const videoFileFilters: Electron.FileFilter[] = [
  {
    name: 'Video files',
    extensions: [...supportedVideoExtensions],
  },
]

function isSupportedVideoFile(filePath: string) {
  const extension = path.extname(filePath).slice(1).toLowerCase()

  return supportedVideoExtensions.some(
    (supportedExtension) => supportedExtension === extension,
  )
}

export function registerDialogIpc(window: BrowserWindow) {
  ipcMain.handle(
    dialogChannels.selectVideo,
    async (event): Promise<SelectVideoResult> => {
      if (!isTrustedSender(event, window)) {
        throw new Error('Blocked dialog request from an untrusted frame.')
      }

      const result = await dialog.showOpenDialog(window, {
        title: 'Select a video',
        properties: ['openFile'],
        filters: videoFileFilters,
      })

      if (result.canceled || result.filePaths.length === 0) {
        return null
      }

      const [filePath] = result.filePaths

      if (!isSupportedVideoFile(filePath)) {
        throw new Error('Unsupported video file type.')
      }

      return { filePath }
    },
  )
}

export function unregisterDialogIpc() {
  ipcMain.removeHandler(dialogChannels.selectVideo)
}
