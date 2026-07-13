import { spawn } from 'node:child_process'

import {
  classifyFfmpegFailure,
  mapFileError,
  ServiceFailure,
} from './ffmpeg-errors'

const maxErrorOutputLength = 64 * 1024

/**
 * Internal representation of one FFmpeg `-progress` packet.
 * Kept private to this module; FFmpegService translates it to FFmpegProgressEvent.
 */
interface RawProgressPacket {
  /** Value of the `out_time_us` field in microseconds. */
  outTimeMicros: number
}

/** Callback type accepted by runFfmpeg when progress reporting is enabled. */
export type RawProgressHandler = (packet: RawProgressPacket) => void

/**
 * Spawns an FFmpeg process with the supplied args.
 *
 * - When `onRawProgress` is provided the caller MUST have already inserted
 *   `-progress pipe:1` into `args`; this function will pipe stdout and parse
 *   the key=value progress packets, firing the callback on every packet.
 * - When `signal` is provided the process is killed (SIGTERM) if the signal
 *   fires, and the promise rejects with `ServiceFailure('CANCELLED', …)`.
 */
export function runFfmpeg(
  executable: string,
  args: string[],
  onRawProgress?: RawProgressHandler,
  signal?: AbortSignal,
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(executable, args, {
      shell: false,
      windowsHide: true,
      // Pipe stdout only when progress reporting is requested.
      stdio: ['ignore', onRawProgress ? 'pipe' : 'ignore', 'pipe'],
    })

    let stderr = ''
    let settled = false
    let aborted = false

    // ── Cancellation support ────────────────────────────────────────────────
    const handleAbort = () => {
      if (!settled) {
        aborted = true
        child.kill()
      }
    }

    if (signal) {
      if (signal.aborted) {
        // Signal was already fired before we started.
        aborted = true
        child.kill()
      } else {
        signal.addEventListener('abort', handleAbort, { once: true })
      }
    }

    // ── Progress parsing ────────────────────────────────────────────────────
    if (onRawProgress && child.stdout) {
      let stdoutBuffer = ''
      // Accumulate fields for the current packet.
      const fields: Record<string, string> = {}

      child.stdout.setEncoding('utf8')
      child.stdout.on('data', (chunk: string) => {
        stdoutBuffer += chunk
        const lines = stdoutBuffer.split('\n')
        // Last element may be an incomplete line; keep it in the buffer.
        stdoutBuffer = lines.pop() ?? ''

        for (const line of lines) {
          const eqIdx = line.indexOf('=')
          if (eqIdx === -1) continue

          const key = line.slice(0, eqIdx).trim()
          const value = line.slice(eqIdx + 1).trim()
          fields[key] = value

          // `progress` is always the last field in a packet.
          if (key === 'progress') {
            // out_time_us is documented as microseconds.
            const raw = parseInt(fields['out_time_us'] ?? '0', 10)
            onRawProgress({
              outTimeMicros: Number.isFinite(raw) && raw >= 0 ? raw : 0,
            })
            // Reset accumulated fields for the next packet.
            for (const k of Object.keys(fields)) delete fields[k]
          }
        }
      })
    }

    // ── Error capture ───────────────────────────────────────────────────────
    if (child.stderr) {
      child.stderr.setEncoding('utf8')
      child.stderr.on('data', (chunk: string) => {
        stderr = `${stderr}${chunk}`.slice(-maxErrorOutputLength)
      })
    }

    const cleanup = () => signal?.removeEventListener('abort', handleAbort)

    child.once('error', (error: NodeJS.ErrnoException) => {
      if (settled) return
      settled = true
      cleanup()
      reject(
        error.code === 'ENOENT'
          ? new ServiceFailure('MISSING_FFMPEG', 'The FFmpeg executable is missing.')
          : mapFileError(error, 'UNEXPECTED_EXIT'),
      )
    })

    child.once('close', (code, exitSignal) => {
      if (settled) return
      settled = true
      cleanup()

      if (aborted) {
        reject(new ServiceFailure('CANCELLED', 'Processing was cancelled.'))
      } else if (code === 0) {
        resolve()
      } else if (code === null || exitSignal) {
        reject(new ServiceFailure('UNEXPECTED_EXIT', 'FFmpeg exited unexpectedly.'))
      } else {
        reject(classifyFfmpegFailure(stderr))
      }
    })
  })
}
