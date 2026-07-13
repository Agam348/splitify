import { contextBridge, ipcRenderer } from 'electron'

import {
  dialogChannels,
} from '../shared/ipc/dialog'
import type { SplitifyApi } from '../shared/ipc/api'
import { mediaChannels } from '../shared/ipc/media'
import { settingsChannels } from '../shared/ipc/settings'
import { validationChannels } from '../shared/ipc/validation'
import { processingChannels } from '../shared/ipc/processing'

const splitifyApi: SplitifyApi = {
  dialogs: {
    selectVideo: () => ipcRenderer.invoke(dialogChannels.selectVideo),
  },
  media: {
    getVideoMetadata: (filePath) =>
      ipcRenderer.invoke(mediaChannels.getVideoMetadata, filePath),
  },
  settings: {
    selectOutputDirectory: () =>
      ipcRenderer.invoke(settingsChannels.selectOutputDirectory),
    getLastOutputDirectory: () =>
      ipcRenderer.invoke(settingsChannels.getLastOutputDirectory),
    updateLastOutputDirectory: (directory) =>
      ipcRenderer.invoke(
        settingsChannels.updateLastOutputDirectory,
        directory,
      ),
  },
  validation: {
    validateSplitConfiguration: (input) =>
      ipcRenderer.invoke(
        validationChannels.validateSplitConfiguration,
        input,
      ),
  },
  processing: {
    splitByDuration: (request) =>
      ipcRenderer.invoke(processingChannels.splitByDuration, request),
  },
}

contextBridge.exposeInMainWorld('splitify', splitifyApi)
