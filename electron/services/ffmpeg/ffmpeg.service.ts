import { constants } from 'node:fs'
import {
  access,
  copyFile,
  link,
  mkdtemp,
  readdir,
  rm,
  stat,
  unlink,
} from 'node:fs/promises'
import path from 'node:path'

import { supportedVideoExtensions } from '../../../shared/media/video-formats'
import type {
  FFmpegResult,
  FFmpegSplitRequest,
} from './ffmpeg.types'
import { isSafeProjectName } from '../../../shared/validation/file-name'
import { mapFileError, ServiceFailure } from './ffmpeg-errors'
import { runFfmpeg } from './ffmpeg-process'

const temporaryFilePattern = 'segment-%09d.mp4'
const temporaryFileExpression = /^segment-(\d{9})\.mp4$/

function normalizeAbsolutePath(value: string) {
  if (!value || value.includes('\0') || !path.isAbsolute(value)) {
    throw new ServiceFailure('INVALID_PATH', 'A required path is invalid.')
  }

  return path.normalize(value)
}


function escapeExpression(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function getUniqueProjectName(outputFolder: string, projectName: string) {
  const names = await readdir(outputFolder)
  let candidate = projectName
  let suffix = 2

  while (names.some((name) =>
    new RegExp(`^${escapeExpression(candidate)} Part \\d+\\.mp4$`, 'i').test(name),
  )) {
    candidate = `${projectName} (${suffix})`
    suffix += 1
  }

  return candidate
}

async function removeOwnedTemporaryDirectory(outputFolder: string, directory: string) {
  const relative = path.relative(outputFolder, directory)
  const isOwned =
    relative.length > 0 &&
    !relative.startsWith('..') &&
    !path.isAbsolute(relative) &&
    path.basename(directory).startsWith('.splitify-job-')

  if (isOwned) await rm(directory, { recursive: true, force: true })
}

async function promoteFile(source: string, destination: string) {
  try {
    await link(source, destination)
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code

    if (code === 'EEXIST') throw mapFileError(error, 'OUTPUT_COLLISION')
    if (!['EPERM', 'ENOTSUP', 'EXDEV', 'UNKNOWN'].includes(code ?? '')) {
      throw mapFileError(error, 'FFMPEG_FAILURE')
    }

    try {
      await copyFile(source, destination, constants.COPYFILE_EXCL)
    } catch (copyError) {
      if ((copyError as NodeJS.ErrnoException).code !== 'EEXIST') {
        await unlink(destination).catch(() => undefined)
      }
      throw mapFileError(copyError, 'FFMPEG_FAILURE')
    }
  }

  await unlink(source).catch(() => undefined)
}

export class FFmpegService {
  constructor(private readonly executablePath: string) {}

  async splitByDuration(request: FFmpegSplitRequest): Promise<FFmpegResult> {
    const startedAt = Date.now()
    let outputFolder = request.outputFolder
    let temporaryDirectory: string | null = null
    const createdFiles: string[] = []

    try {
      const inputPath = normalizeAbsolutePath(request.inputPath)
      outputFolder = normalizeAbsolutePath(request.outputFolder)
      const projectName = request.projectName.trim()
      const extension = path.extname(inputPath).slice(1).toLowerCase()

      if (!isSafeProjectName(projectName)) {
        throw new ServiceFailure('INVALID_INPUT', 'The project name is invalid.')
      }
      if (!Number.isFinite(request.clipDurationSeconds) || request.clipDurationSeconds <= 0) {
        throw new ServiceFailure('INVALID_INPUT', 'The clip duration is invalid.')
      }
      if (!supportedVideoExtensions.some((item) => item === extension)) {
        throw new ServiceFailure('UNSUPPORTED_MEDIA', 'The input format is unsupported.')
      }

      const [inputStats, outputStats] = await Promise.all([
        stat(inputPath).catch((error) => { throw mapFileError(error, 'INVALID_INPUT') }),
        stat(outputFolder).catch((error) => { throw mapFileError(error, 'INVALID_PATH') }),
      ])
      if (!inputStats.isFile() || !outputStats.isDirectory()) {
        throw new ServiceFailure('INVALID_PATH', 'The input or output path is invalid.')
      }
      await Promise.all([
        access(inputPath, constants.R_OK),
        access(outputFolder, constants.R_OK | constants.W_OK),
        access(this.executablePath, constants.X_OK),
      ]).catch((error) => { throw mapFileError(error, 'MISSING_FFMPEG') })

      const uniqueProjectName = await getUniqueProjectName(outputFolder, projectName)
      temporaryDirectory = await mkdtemp(path.join(outputFolder, '.splitify-job-'))
      const outputPattern = path.join(temporaryDirectory, temporaryFilePattern)
      const args = [
        '-hide_banner', '-loglevel', 'error', '-nostdin', '-n',
        '-i', inputPath,
        '-map', '0:v:0', '-map', '0:a?',
        '-c', 'copy', '-f', 'segment',
        '-segment_time', String(request.clipDurationSeconds),
        '-segment_start_number', '1', '-reset_timestamps', '1',
        outputPattern,
      ]

      await runFfmpeg(this.executablePath, args)
      const segments = (await readdir(temporaryDirectory))
        .filter((name) => temporaryFileExpression.test(name))
        .sort((left, right) => left.localeCompare(right))
      if (segments.length === 0) {
        throw new ServiceFailure('UNEXPECTED_EXIT', 'FFmpeg created no output clips.')
      }

      for (const [index, segment] of segments.entries()) {
        const destination = path.join(outputFolder, `${uniqueProjectName} Part ${index + 1}.mp4`)
        await promoteFile(path.join(temporaryDirectory, segment), destination)
        createdFiles.push(destination)
      }

      await removeOwnedTemporaryDirectory(outputFolder, temporaryDirectory)
      temporaryDirectory = null

      return {
        success: true,
        filesCreated: createdFiles,
        outputFolder,
        totalClips: createdFiles.length,
        executionTimeMs: Date.now() - startedAt,
      }
    } catch (error) {
      await Promise.all(createdFiles.map((file) => unlink(file).catch(() => undefined)))
      if (temporaryDirectory) {
        await removeOwnedTemporaryDirectory(outputFolder, temporaryDirectory).catch(() => undefined)
      }
      const failure = error instanceof ServiceFailure
        ? error
        : mapFileError(error, 'FFMPEG_FAILURE')

      return {
        success: false,
        error: { code: failure.code, message: failure.message },
        outputFolder,
        executionTimeMs: Date.now() - startedAt,
      }
    }
  }
}
