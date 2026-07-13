import { supportedVideoExtensions } from '../media/video-formats'
import { isSafeProjectName } from './file-name'
import type {
  OutputDirectoryInspector,
  SplitValidationInput,
  ValidationField,
  ValidationIssue,
  ValidationResult,
} from './validation.types'

function getExtension(filePath: string) {
  const fileName = filePath.split(/[\\/]/).pop() ?? ''
  const extensionIndex = fileName.lastIndexOf('.')

  return extensionIndex >= 0
    ? fileName.slice(extensionIndex + 1).toLowerCase()
    : ''
}

function buildOutputFileNames(
  projectName: string,
  totalParts: number,
) {
  return Array.from({ length: totalParts }, (_, index) =>
    `${projectName} Part ${index + 1}.mp4`,
  )
}

function toFieldMessages(issues: ValidationIssue[]) {
  return issues.reduce<Partial<Record<ValidationField, string>>>(
    (errors, issue) => {
      errors[issue.field] ??= issue.message
      return errors
    },
    {},
  )
}

export class ValidationService {
  constructor(
    private readonly inspectOutputDirectory: OutputDirectoryInspector,
  ) {}

  async validate(input: SplitValidationInput): Promise<ValidationResult> {
    const issues: ValidationIssue[] = []
    const projectName = input.projectName.trim()
    const extension = input.videoPath ? getExtension(input.videoPath) : ''

    if (!input.videoPath) {
      issues.push({
        field: 'video',
        code: 'video-required',
        message: 'Select a video to continue.',
      })
    } else if (!supportedVideoExtensions.some((item) => item === extension)) {
      issues.push({
        field: 'video',
        code: 'video-format-unsupported',
        message: 'Select an MP4, MOV, MKV, AVI, or WEBM video.',
      })
    } else if (
      input.videoDurationSeconds === null ||
      !Number.isFinite(input.videoDurationSeconds)
    ) {
      issues.push({
        field: 'video',
        code: 'video-metadata-unavailable',
        message: 'Video duration is unavailable.',
      })
    }

    if (!projectName) {
      issues.push({
        field: 'projectName',
        code: 'project-name-required',
        message: 'Enter a project name.',
      })
    } else if (!isSafeProjectName(projectName)) {
      issues.push({
        field: 'projectName',
        code: 'project-name-unsafe',
        message: 'Use a filename-safe name without reserved characters.',
      })
    }

    let totalParts = 0

    if (input.splitMethod === 'duration') {
      if (input.splitDurationSeconds === null) {
        issues.push({
          field: 'splitDuration',
          code: 'split-duration-required',
          message: 'Enter a clip duration.',
        })
      } else if (
        !Number.isFinite(input.splitDurationSeconds) ||
        input.splitDurationSeconds <= 0 ||
        (input.videoDurationSeconds !== null &&
          input.splitDurationSeconds > input.videoDurationSeconds)
      ) {
        issues.push({
          field: 'splitDuration',
          code: 'split-duration-invalid',
          message: 'Duration must be greater than zero and no longer than the video.',
        })
      } else if (input.videoDurationSeconds !== null) {
        totalParts = Math.ceil(
          input.videoDurationSeconds / input.splitDurationSeconds,
        )
      }
    } else if (input.equalParts === null) {
      issues.push({
        field: 'equalParts',
        code: 'equal-parts-required',
        message: 'Enter the number of equal parts.',
      })
    } else if (
      !Number.isInteger(input.equalParts) ||
      input.equalParts < 2 ||
      input.equalParts > 1000
    ) {
      issues.push({
        field: 'equalParts',
        code: 'equal-parts-invalid',
        message: 'Equal parts must be a whole number between 2 and 1000.',
      })
    } else {
      totalParts = input.equalParts
    }

    if (!input.outputFolder) {
      issues.push({
        field: 'outputFolder',
        code: 'output-folder-required',
        message: 'Choose an output folder.',
      })
    }

    const canBuildFileNames =
      projectName.length > 0 &&
      isSafeProjectName(projectName) &&
      extension.length > 0 &&
      totalParts > 0
    const outputFileNames = canBuildFileNames
      ? buildOutputFileNames(projectName, totalParts)
      : []

    if (input.outputFolder) {
      const inspection = await this.inspectOutputDirectory(input.outputFolder)

      if (!inspection.isAvailable) {
        issues.push({
          field: 'outputFolder',
          code: 'output-folder-unavailable',
          message: 'The output folder is unavailable or not writable.',
        })
      } else if (outputFileNames.length > 0) {
        const existingNames = new Set(
          inspection.fileNames.map((fileName) => fileName.toLowerCase()),
        )
        const collisions = outputFileNames.filter((fileName) =>
          existingNames.has(fileName.toLowerCase()),
        )

        if (collisions.length > 0) {
          issues.push({
            field: 'outputFilename',
            code: 'output-filename-collision',
            message: `${collisions.length} output filename${collisions.length === 1 ? '' : 's'} already exist${collisions.length === 1 ? 's' : ''}.`,
            severity: 'warning',
          })
        }
      }
    }

    return {
      isValid: issues.every((issue) => issue.severity === 'warning'),
      issues,
      fieldErrors: toFieldMessages(
        issues.filter((issue) => issue.severity !== 'warning'),
      ),
      fieldWarnings: toFieldMessages(
        issues.filter((issue) => issue.severity === 'warning'),
      ),
      outputFileNames,
    }
  }
}
