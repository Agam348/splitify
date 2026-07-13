/// <reference types="vite-plugin-electron/electron-env" />

import type { SplitifyApi } from '../shared/ipc/api'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ROOT: string
      VITE_PUBLIC: string
    }
  }

  interface Window {
    splitify: SplitifyApi
  }
}

export {}
