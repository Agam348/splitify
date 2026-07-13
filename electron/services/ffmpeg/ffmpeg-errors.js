export class ServiceFailure extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}
export function mapFileError(error, fallback) {
    const code = error.code;
    if (code === 'EACCES' || code === 'EPERM') {
        return new ServiceFailure('PERMISSION_DENIED', 'Permission was denied.');
    }
    if (code === 'ENOSPC') {
        return new ServiceFailure('DISK_FULL', 'The destination disk is full.');
    }
    if (code === 'EEXIST') {
        return new ServiceFailure('OUTPUT_COLLISION', 'An output file already exists.');
    }
    return new ServiceFailure(fallback, 'The video could not be processed.');
}
export function classifyFfmpegFailure(stderr) {
    const message = stderr.toLowerCase();
    if (message.includes('permission denied') || message.includes('access is denied')) {
        return new ServiceFailure('PERMISSION_DENIED', 'Permission was denied.');
    }
    if (message.includes('no space left') || message.includes('disk full')) {
        return new ServiceFailure('DISK_FULL', 'The destination disk is full.');
    }
    if (message.includes('invalid data found') ||
        message.includes('unsupported codec') ||
        message.includes('could not find codec parameters')) {
        return new ServiceFailure('UNSUPPORTED_MEDIA', 'The media cannot be stream-copied to MP4.');
    }
    return new ServiceFailure('FFMPEG_FAILURE', 'FFmpeg could not split the video.');
}
