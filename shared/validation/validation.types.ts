export type SplitMethod = 'duration' | 'equal-parts'

export type ValidationField =
  | 'video'
  | 'projectName'
  | 'splitDuration'
  | 'equalParts'
  | 'outputFolder'
  | 'outputFilename'

export type ValidationCode =
  | 'video-required'
  | 'video-format-unsupported'
  | 'video-metadata-unavailable'
  | 'project-name-required'
  | 'project-name-unsafe'
  | 'split-duration-required'
  | 'split-duration-invalid'
  | 'equal-parts-required'
  | 'equal-parts-invalid'
  | 'output-folder-required'
  | 'output-folder-unavailable'
  | 'output-filename-collision'

export interface SplitValidationInput {
  videoPath: string | null
  videoDurationSeconds: number | null
  projectName: string
  splitMethod: SplitMethod
  splitDurationSeconds: number | null
  equalParts: number | null
  outputFolder: string | null
}

export interface ValidationIssue {
  field: ValidationField
  code: ValidationCode
  message: string
  severity?: 'error' | 'warning'
}

export interface ValidationResult {
  isValid: boolean
  issues: ValidationIssue[]
  fieldErrors: Partial<Record<ValidationField, string>>
  fieldWarnings: Partial<Record<ValidationField, string>>
  outputFileNames: string[]
}

export interface OutputDirectoryInspection {
  isAvailable: boolean
  fileNames: string[]
}

export type OutputDirectoryInspector = (
  directory: string,
) => Promise<OutputDirectoryInspection>
