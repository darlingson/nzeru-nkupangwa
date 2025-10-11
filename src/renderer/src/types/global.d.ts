export {}

declare global {
  interface Window {
    electronAPI: {
      sendMessageToGemini: (apiKey: string, message: string) => Promise<any>
    }
    electron: any
    api: any
  }
}
