import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electronAPI', {
      sendMessageToGemini: (apiKey: string, message: string) =>
        ipcRenderer.invoke('send-to-gemini', { apiKey, message })
    })
    contextBridge.exposeInMainWorld('chatAPI', {
      getChats: () => ipcRenderer.invoke('get-chats'),
      createChat: (title: string) => ipcRenderer.invoke('create-chat', title),
      deleteChat: (chatId: number) => ipcRenderer.invoke('delete-chat', chatId),
      getMessages: (chatId: number) => ipcRenderer.invoke('get-messages', chatId),
      addMessage: (chatId: number, role: string, content: string) =>
        ipcRenderer.invoke('add-message', { chatId, role, content })
    })
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
