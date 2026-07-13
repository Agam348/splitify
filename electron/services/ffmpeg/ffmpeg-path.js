import path from 'node:path';
import { app } from 'electron';
export function resolveFfmpegPath() {
    const executable = process.platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg';
    if (app.isPackaged) {
        return path.join(process.resourcesPath, 'ffmpeg', executable);
    }
    return path.join(process.env.APP_ROOT, 'node_modules', 'ffmpeg-static', executable);
}
