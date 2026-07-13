import { useCallback, useState } from 'react'

import type { SplitMethod } from '../../../../shared/validation/validation.types'

export function useSplitConfiguration() {
  const [projectName, setProjectName] = useState('')
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('duration')
  const [durationInput, setDurationInput] = useState('30')
  const [equalPartsInput, setEqualPartsInput] = useState('2')
  const [isCustomDuration, setIsCustomDuration] = useState(false)

  const selectDurationPreset = useCallback((duration: number | null) => {
    setIsCustomDuration(duration === null)
    setDurationInput(duration === null ? '' : String(duration))
  }, [])

  return {
    durationInput,
    equalPartsInput,
    equalParts: equalPartsInput.trim() ? Number(equalPartsInput) : null,
    isCustomDuration,
    projectName,
    splitDurationSeconds: durationInput.trim() ? Number(durationInput) : null,
    splitMethod,
    selectDurationPreset,
    setDurationInput,
    setEqualPartsInput,
    setProjectName,
    setSplitMethod,
  }
}
