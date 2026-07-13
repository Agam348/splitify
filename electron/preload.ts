import { contextBridge, ipcRenderer } from 'electron'

import { dialogChannels } from '../shared/ipc/dialog'
import type { SplitifyApi } from '../shared/ipc/api'
import { mediaChannels } from '../shared/ipc/media'
import { settingsChannels } from '../shared/ipc/settings'
import { validationChannels } from '../shared/ipc/validation'
import { processingChannels } from '../shared/ipc/processing'
import type { SplitProgressEvent } from '../shared/processing/processing.types'

// Map from the caller-supplied callback to the wrapper we registered so we
// can cleanly remove the correct listener on offProgress().
type ProgressCallback = (event: SplitProgressEvent) => void
type IpcWrapper = (_event: Electron.IpcRendererEvent, progressEvent: SplitProgressEvent) => void
const progressListeners = new Map<ProgressCallback, IpcWrapper>()

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
    cancel: () =>
      ipcRenderer.invoke(processingChannels.cancelProcessing),
    onProgress: (callback) => {
      const wrapper: IpcWrapper = (_event, progressEvent) => callback(progressEvent)
      progressListeners.set(callback, wrapper)
      ipcRenderer.on(processingChannels.splitProgress, wrapper)
    },
    offProgress: (callback) => {
      const wrapper = progressListeners.get(callback)
      if (wrapper) {
        ipcRenderer.removeListener(processingChannels.splitProgress, wrapper)
        progressListeners.delete(callback)
      }
    },
  },
}

contextBridge.exposeInMainWorld('splitify', splitifyApi)
