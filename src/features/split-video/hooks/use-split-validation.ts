import { useEffect, useState } from 'react'

import type {
  SplitValidationInput,
  ValidationResult,
} from '../../../../shared/validation/validation.types'

export function useSplitValidation(input: SplitValidationInput) {
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true
    setIsValidating(true)
    setError(null)

    const timeout = window.setTimeout(() => {
      if (!window.splitify?.validation) {
        if (isActive) setIsValidating(false)
        return
      }

      window.splitify.validation
        .validateSplitConfiguration(input)
        .then((validationResult) => {
          if (isActive) setResult(validationResult)
        })
        .catch(() => {
          if (isActive) setError('Unable to validate the split settings.')
        })
        .finally(() => {
          if (isActive) setIsValidating(false)
        })
    }, 200)

    return () => {
      isActive = false
      window.clearTimeout(timeout)
    }
  }, [input])

  return {
    error,
    fieldErrors: result?.fieldErrors ?? {},
    fieldWarnings: result?.fieldWarnings ?? {},
    isValid: result?.isValid ?? false,
    isValidating,
  }
}
