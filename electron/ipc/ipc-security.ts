import { BrowserWindow, type IpcMainInvokeEvent } from 'electron'

export function isTrustedSender(
  event: IpcMainInvokeEvent,
  window: BrowserWindow,
) {
  return (
    event.sender === window.webContents &&
    event.senderFrame === window.webContents.mainFrame
  )
}
