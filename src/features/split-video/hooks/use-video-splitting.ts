import { useCallback, useState } from 'react'

import type {
  DurationSplitRequest,
  DurationSplitResult,
  SplitProgressEvent,
} from '../../../../shared/processing/processing.types'

export function useVideoSplitting() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<DurationSplitResult | null>(null)
  const [progress, setProgress] = useState<SplitProgressEvent | null>(null)

  const splitByDuration = useCallback(async (request: DurationSplitRequest) => {
    if (!window.splitify?.processing) {
      setResult({
        success: false,
        error: {
          code: 'PROCESSOR_UNAVAILABLE',
          message: 'Video processing requires the Splitify desktop application.',
        },
        outputFolder: request.outputFolder,
        executionTimeMs: 0,
      })
      return
    }

    setIsProcessing(true)
    setResult(null)
    setProgress(null)

    // Create a stable callback reference for this job so we can remove it cleanly.
    const handleProgress = (event: SplitProgressEvent) => setProgress(event)

    window.splitify.processing.onProgress(handleProgress)

    try {
      const jobResult = await window.splitify.processing.splitByDuration(request)

      // If the job was cancelled, suppress the result so the UI returns to idle.
      if (!jobResult.success && jobResult.error.code === 'PROCESSING_CANCELLED') {
        setResult(null)
      } else {
        setResult(jobResult)
      }
    } finally {
      window.splitify.processing.offProgress(handleProgress)
      setIsProcessing(false)
    }
  }, [])

  const cancel = useCallback(() => {
    if (window.splitify?.processing) {
      void window.splitify.processing.cancel()
    }
  }, [])

  return {
    isProcessing,
    progress,
    result,
    splitByDuration,
    cancel,
  }
}
