import type { DialogApi } from './dialog'
import type { MediaApi } from './media'
import type { SettingsApi } from './settings'
import type { ValidationApi } from './validation'
import type { ProcessingApi } from './processing'

export interface SplitifyApi {
  dialogs: DialogApi
  media: MediaApi
  settings: SettingsApi
  validation: ValidationApi
  processing: ProcessingApi
}
