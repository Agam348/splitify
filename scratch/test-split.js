import path from 'node:path';
import fs from 'node:fs/promises';
import { app } from 'electron';
import { ProcessingService } from '../electron/services/processing.service.js';
import { FFmpegService } from '../electron/services/ffmpeg/ffmpeg.service.js';
import { MediaService } from '../electron/services/media.service.js';
import { resolveFfmpegPath } from '../electron/services/ffmpeg/ffmpeg-path.js';
app.whenReady().then(async () => {
    try {
        console.log('--- TEST START ---');
        process.env.APP_ROOT = path.resolve(path.join(app.getAppPath(), '..'));
        console.log('APP_ROOT:', process.env.APP_ROOT);
        const ffmpegPath = resolveFfmpegPath();
        console.log('FFmpeg Path:', ffmpegPath);
        const ffmpegService = new FFmpegService(ffmpegPath);
        const mediaService = new MediaService();
        const processingService = new ProcessingService(ffmpegService, mediaService);
        const inputPath = path.resolve(path.join(process.env.APP_ROOT, 'test_5s.mp4'));
        const outputFolder = path.resolve(path.join(process.env.APP_ROOT, 'scratch/test_output'));
        // Create output folder if it doesn't exist
        await fs.mkdir(outputFolder, { recursive: true });
        // Clean old files in output folder
        const oldFiles = await fs.readdir(outputFolder).catch(() => []);
        for (const file of oldFiles) {
            await fs.unlink(path.join(outputFolder, file)).catch(() => { });
        }
        console.log('Input Video:', inputPath);
        console.log('Output Folder:', outputFolder);
        const request = {
            inputPath,
            outputFolder,
            projectName: 'TestSplitEqual',
            splitMethod: 'equal-parts',
            equalParts: 3,
        };
        console.log('Running splitByDuration with equalParts: 3...');
        const result = await processingService.splitByDuration(request);
        console.log('Result:', JSON.stringify(result, null, 2));
        if (result.success) {
            console.log('SUCCESS!');
            console.log('Files Created:', result.filesCreated);
            if (result.filesCreated.length === 3) {
                console.log('ASSERTION PASSED: Created exactly 3 files!');
            }
            else {
                console.error(`ASSERTION FAILED: Expected 3 files, got ${result.filesCreated.length}`);
                process.exit(1);
            }
        }
        else {
            console.error('FAILED:', result.error);
            process.exit(1);
        }
        // Clean up created files and output directory
        for (const file of result.filesCreated) {
            await fs.unlink(file).catch(() => { });
        }
        await fs.rm(outputFolder, { recursive: true, force: true }).catch(() => { });
        await fs.unlink(inputPath).catch(() => { }); // delete synthetic video as well
        console.log('--- TEST END (SUCCESS) ---');
        process.exit(0);
    }
    catch (error) {
        console.error('Unhandled test error:', error);
        process.exit(1);
    }
});
