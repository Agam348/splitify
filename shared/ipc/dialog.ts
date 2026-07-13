export const dialogChannels = {
  selectVideo: 'dialog:select-video',
} as const

export interface SelectedVideo {
  filePath: string
}

export type SelectVideoResult = SelectedVideo | null

export interface DialogApi {
  selectVideo: () => Promise<SelectVideoResult>
}
