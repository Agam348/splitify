import { constants } from 'node:fs'
import { access, readdir, stat } from 'node:fs/promises'

import type { OutputDirectoryInspector } from '../../shared/validation/validation.types'

export const inspectOutputDirectory: OutputDirectoryInspector = async (
  directory,
) => {
  try {
    const directoryStats = await stat(directory)

    if (!directoryStats.isDirectory()) {
      return { isAvailable: false, fileNames: [] }
    }

    await access(directory, constants.R_OK | constants.W_OK)
    const entries = await readdir(directory, { withFileTypes: true })

    return {
      isAvailable: true,
      fileNames: entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name),
    }
  } catch {
    return { isAvailable: false, fileNames: [] }
  }
}
