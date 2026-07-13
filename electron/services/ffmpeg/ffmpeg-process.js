import { spawn } from 'node:child_process';
import { classifyFfmpegFailure, mapFileError, ServiceFailure, } from './ffmpeg-errors';
const maxErrorOutputLength = 64 * 1024;
export function runFfmpeg(executable, args) {
    return new Promise((resolve, reject) => {
        const child = spawn(executable, args, {
            shell: false,
            windowsHide: true,
            stdio: ['ignore', 'ignore', 'pipe'],
        });
        let stderr = '';
        let settled = false;
        child.stderr.setEncoding('utf8');
        child.stderr.on('data', (chunk) => {
            stderr = `${stderr}${chunk}`.slice(-maxErrorOutputLength);
        });
        child.once('error', (error) => {
            if (settled)
                return;
            settled = true;
            reject(error.code === 'ENOENT'
                ? new ServiceFailure('MISSING_FFMPEG', 'The FFmpeg executable is missing.')
                : mapFileError(error, 'UNEXPECTED_EXIT'));
        });
        child.once('close', (code, signal) => {
            if (settled)
                return;
            settled = true;
            if (code === 0)
                resolve();
            else if (code === null || signal) {
                reject(new ServiceFailure('UNEXPECTED_EXIT', 'FFmpeg exited unexpectedly.'));
            }
            else
                reject(classifyFfmpegFailure(stderr));
        });
    });
}
