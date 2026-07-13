const publicErrorCodes = {
    MISSING_FFMPEG: 'PROCESSOR_UNAVAILABLE',
    INVALID_INPUT: 'INVALID_INPUT',
    INVALID_PATH: 'INVALID_PATH',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    DISK_FULL: 'DISK_FULL',
    UNSUPPORTED_MEDIA: 'UNSUPPORTED_MEDIA',
    OUTPUT_COLLISION: 'OUTPUT_COLLISION',
    FFMPEG_FAILURE: 'PROCESSING_FAILED',
    UNEXPECTED_EXIT: 'UNEXPECTED_EXIT',
};
export class ProcessingService {
    ffmpegService;
    mediaService;
    isProcessing = false;
    constructor(ffmpegService, mediaService) {
        this.ffmpegService = ffmpegService;
        this.mediaService = mediaService;
    }
    async splitByDuration(request) {
        if (this.isProcessing) {
            return {
                success: false,
                error: {
                    code: 'PROCESSING_BUSY',
                    message: 'Another video is already being processed.',
                },
                outputFolder: request.outputFolder,
                executionTimeMs: 0,
            };
        }
        this.isProcessing = true;
        try {
            let clipDurationSeconds;
            if (request.splitMethod === 'duration') {
                clipDurationSeconds = request.clipDurationSeconds;
            }
            else {
                const metadata = await this.mediaService.getVideoMetadata(request.inputPath);
                clipDurationSeconds = metadata.durationSeconds / request.equalParts;
            }
            const result = await this.ffmpegService.splitByDuration({
                inputPath: request.inputPath,
                outputFolder: request.outputFolder,
                projectName: request.projectName,
                clipDurationSeconds,
            });
            if (result.success)
                return result;
            const code = publicErrorCodes[result.error.code];
            const message = code === 'PROCESSOR_UNAVAILABLE'
                ? 'The video processor is unavailable.'
                : code === 'PROCESSING_FAILED'
                    ? 'Video processing failed.'
                    : result.error.message;
            return {
                ...result,
                error: { code, message },
            };
        }
        finally {
            this.isProcessing = false;
        }
    }
}
