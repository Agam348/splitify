import { app, BrowserWindow, Menu, session, shell } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import {
  registerDialogIpc,
  unregisterDialogIpc,
} from './ipc/dialog.ipc'
import {
  registerMediaIpc,
  unregisterMediaIpc,
} from './ipc/media.ipc'
import { MediaService } from './services/media.service'
import {
  registerSettingsIpc,
  unregisterSettingsIpc,
} from './ipc/settings.ipc'
import { SettingsService } from './services/settings.service'
import {
  registerValidationIpc,
  unregisterValidationIpc,
} from './ipc/validation.ipc'
import { inspectOutputDirectory } from './services/output-directory-inspector'
import { ValidationService } from '../shared/validation/validation.service'
import {
  registerProcessingIpc,
  unregisterProcessingIpc,
} from './ipc/processing.ipc'
import { FFmpegService } from './services/ffmpeg/ffmpeg.service'
import { resolveFfmpegPath } from './services/ffmpeg/ffmpeg-path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function setupSessionSecurity() {
  // Reject all device and web permissions (camera, microphone, location, etc.)
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => {
    callback(false)
  })

  // Enforce Content-Security-Policy on all loaded resources
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const csp = VITE_DEV_SERVER_URL
      ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ws://localhost:* http://localhost:*;"
      : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none';"

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp],
      },
    })
  })
}

function createWindow() {
  // Remove default application menu in production to prevent shortcut exposure
  if (app.isPackaged) {
    Menu.setApplicationMenu(null)
  }

  setupSessionSecurity()

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  })

  // Prevent opening child windows or popups; safely delegate http/https to system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const parsed = new URL(url)
      if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
        void shell.openExternal(url)
      }
    } catch {
      // Ignore malformed URLs
    }
    return { action: 'deny' }
  })

  // Prevent navigation away from the bundled app
  win.webContents.on('will-navigate', (event, navigationUrl) => {
    if (VITE_DEV_SERVER_URL && navigationUrl.startsWith(VITE_DEV_SERVER_URL)) {
      return
    }
    event.preventDefault()
  })

  // Disallow embedding of webviews
  win.webContents.on('will-attach-webview', (event) => {
    event.preventDefault()
  })

  // Ensure DevTools cannot remain open in packaged production builds
  if (app.isPackaged) {
    win.webContents.on('devtools-opened', () => {
      win?.webContents.closeDevTools()
    })
  }

  const mediaService = new MediaService()
  registerDialogIpc(win)
  registerMediaIpc(win, mediaService)
  registerSettingsIpc(win, new SettingsService())
  registerValidationIpc(win, new ValidationService(inspectOutputDirectory))
  registerProcessingIpc(win, new FFmpegService(resolveFfmpegPath()), mediaService)

  win.on('closed', () => {
    unregisterDialogIpc()
    unregisterMediaIpc()
    unregisterSettingsIpc()
    unregisterValidationIpc()
    unregisterProcessingIpc()
    win = null
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
