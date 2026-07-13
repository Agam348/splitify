import type {
  SplitValidationInput,
  ValidationResult,
} from '../validation/validation.types'

export const validationChannels = {
  validateSplitConfiguration: 'validation:validate-split-configuration',
} as const

export interface ValidationApi {
  validateSplitConfiguration: (
    input: SplitValidationInput,
  ) => Promise<ValidationResult>
}
