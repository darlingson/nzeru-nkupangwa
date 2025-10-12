declare global {
    interface Window {
      electronAPI: {
        sendMessageToGemini: (apiKey: string, message: string) => Promise<any>;
      };
      chatAPI: {
        getChats: () => Promise<any[]>;
        createChat: (title: string) => Promise<{ id: number; title: string }>;
        deleteChat: (chatId: number) => Promise<boolean>;
        getMessages: (chatId: number) => Promise<any[]>;
        addMessage: (chatId: number, role: string, content: string) => Promise<{ id: number }>;
      };
    }
  }
  