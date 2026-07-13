import { useCallback, useEffect, useState } from 'react'

export function useOutputFolder() {
  const [outputFolder, setOutputFolder] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSelecting, setIsSelecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isActive = true

    window.splitify.settings
      .getLastOutputDirectory()
      .then((directory) => {
        if (isActive) setOutputFolder(directory)
      })
      .catch(() => {
        if (isActive) setError('Unable to load the saved output folder.')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  const selectOutputFolder = useCallback(async () => {
    setIsSelecting(true)
    setError(null)

    try {
      const directory = await window.splitify.settings.selectOutputDirectory()

      if (!directory) return

      await window.splitify.settings.updateLastOutputDirectory(directory)
      setOutputFolder(directory)
    } catch {
      setError('Unable to update the output folder.')
    } finally {
      setIsSelecting(false)
    }
  }, [])

  return {
    error,
    isLoading,
    isSelecting,
    outputFolder,
    selectOutputFolder,
  }
}
