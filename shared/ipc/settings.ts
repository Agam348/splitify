export const settingsChannels = {
  selectOutputDirectory: 'settings:select-output-directory',
  getLastOutputDirectory: 'settings:get-last-output-directory',
  updateLastOutputDirectory: 'settings:update-last-output-directory',
} as const

export type OutputDirectory = string | null

export interface SettingsApi {
  selectOutputDirectory: () => Promise<OutputDirectory>
  getLastOutputDirectory: () => Promise<OutputDirectory>
  updateLastOutputDirectory: (directory: string) => Promise<void>
}
