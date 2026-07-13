import { useCallback, useState } from 'react'

import type {
  DurationSplitRequest,
  DurationSplitResult,
} from '../../../../shared/processing/processing.types'

export function useVideoSplitting() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<DurationSplitResult | null>(null)

  const splitByDuration = useCallback(async (request: DurationSplitRequest) => {
    setIsProcessing(true)
    setResult(null)

    try {
      setResult(await window.splitify.processing.splitByDuration(request))
    } finally {
      setIsProcessing(false)
    }
  }, [])

  return {
    isProcessing,
    result,
    splitByDuration,
  }
}
