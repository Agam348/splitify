import { execFile } from 'node:child_process'
import { stat } from 'node:fs/promises'
import path from 'node:path'

import { app } from 'electron'

import type { VideoMetadata } from '../../shared/ipc/media'
import { supportedVideoExtensions } from '../../shared/media/video-formats'

interface ProbeStream {
  codec_type?: string
  width?: number
  height?: number
  avg_frame_rate?: string
  r_frame_rate?: string
  duration?: string
  disposition?: { attached_pic?: number }
}

interface ProbeOutput {
  streams?: ProbeStream[]
  format?: {
    duration?: string
    size?: string
    format_name?: string
    format_long_name?: string
  }
}

const supportedFfprobePackages = new Set([
  'darwin-arm64',
  'darwin-x64',
  'linux-arm',
  'linux-arm64',
  'linux-ia32',
  'linux-x64',
  'win32-ia32',
  'win32-x64',
])

function getFfprobePath() {
  const executable = process.platform === 'win32' ? 'ffprobe.exe' : 'ffprobe'

  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'ffprobe', executable)
  }

  const packageName = `${process.platform}-${process.arch}`

  if (!supportedFfprobePackages.has(packageName)) {
    throw new Error(`FFprobe is unavailable for ${packageName}.`)
  }

  return path.join(
    process.env.APP_ROOT || '',
    'node_modules',
    '@ffprobe-installer',
    packageName,
    executable,
  )
}

function parseFrameRate(value: string | undefined) {
  if (!value) return 0

  const [numeratorValue, denominatorValue] = value.split('/')
  const numerator = Number(numeratorValue)
  const denominator = Number(denominatorValue ?? 1)
  const frameRate = numerator / denominator

  return Number.isFinite(frameRate) ? frameRate : 0
}

function runFfprobe(executable: string, filePath: string) {
  const args = [
    '-v',
    'error',
    '-print_format',
    'json',
    '-show_format',
    '-show_streams',
    filePath,
  ]

  return new Promise<string>((resolve, reject) => {
    execFile(
      executable,
      args,
      {
        encoding: 'utf8',
        maxBuffer: 2 * 1024 * 1024,
        timeout: 15_000,
        windowsHide: true,
      },
      (error, stdout) => {
        if (error) {
          reject(error)
          return
        }

        resolve(stdout)
      },
    )
  })
}

function isSupportedVideoPath(filePath: string) {
  const extension = path.extname(filePath).slice(1).toLowerCase()

  return (
    path.isAbsolute(filePath) &&
    supportedVideoExtensions.some((supported) => supported === extension)
  )
}

export class MediaService {
  async getVideoMetadata(filePath: string): Promise<VideoMetadata> {
    if (!isSupportedVideoPath(filePath)) {
      throw new Error('Unsupported video path.')
    }

    const fileStats = await stat(filePath)

    if (!fileStats.isFile()) {
      throw new Error('The selected path is not a file.')
    }

    const stdout = await runFfprobe(getFfprobePath(), filePath)
    const probe = JSON.parse(stdout) as ProbeOutput
    const videoStream = probe.streams?.find(
      (stream) =>
        stream.codec_type === 'video' && !stream.disposition?.attached_pic,
    )

    if (!videoStream?.width || !videoStream.height || !probe.format) {
      throw new Error('FFprobe did not return a valid video stream.')
    }

    const durationSeconds = Number(
      probe.format.duration ?? videoStream.duration,
    )
    const frameRate =
      parseFrameRate(videoStream.avg_frame_rate) ||
      parseFrameRate(videoStream.r_frame_rate)
    const fileSizeBytes = Number(probe.format.size ?? fileStats.size)
    const containerFormat =
      probe.format.format_long_name ?? probe.format.format_name

    if (
      !Number.isFinite(durationSeconds) ||
      durationSeconds < 0 ||
      frameRate <= 0 ||
      !Number.isFinite(fileSizeBytes) ||
      fileSizeBytes < 0 ||
      !containerFormat
    ) {
      throw new Error('FFprobe returned incomplete video metadata.')
    }

    return {
      fileName: path.basename(filePath),
      durationSeconds,
      width: videoStream.width,
      height: videoStream.height,
      frameRate,
      fileSizeBytes,
      containerFormat,
    }
  }
}
