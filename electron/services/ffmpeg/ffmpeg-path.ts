import { chmodSync, existsSync } from 'node:fs'
import path from 'node:path'

import { app } from 'electron'

export function resolveFfmpegPath() {
  const executable = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'

  const resolvedPath = app.isPackaged
    ? path.join(process.resourcesPath, 'ffmpeg', executable)
    : path.join(
        process.env.APP_ROOT || '',
        'node_modules',
        'ffmpeg-static',
        executable,
      )

  if (process.platform !== 'win32' && existsSync(resolvedPath)) {
    try {
      chmodSync(resolvedPath, 0o755)
    } catch {
      // Ignore if filesystem is read-only or permission already set
    }
  }

  return resolvedPath
}
