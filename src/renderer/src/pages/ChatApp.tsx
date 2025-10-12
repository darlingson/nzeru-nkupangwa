import { useEffect, useState } from 'react';
import ChatSidebar from '../components/ChatSidebar';
import ChatView from '../components/ChatView';

export default function ChatApp() {
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const all = await window.chatAPI.getChats();
    setChats(all);
    if (all.length > 0 && !activeChat) setActiveChat(all[0]);
  };

  const newChat = async () => {
    const chat = await window.chatAPI.createChat(`New Chat ${chats.length + 1}`);
    await loadChats();
    setActiveChat(chat);
  };

  const deleteChat = async (id: number) => {
    await window.chatAPI.deleteChat(id);
    await loadChats();
    setActiveChat(null);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onSelect={setActiveChat}
        onNewChat={newChat}
        onDelete={deleteChat}
      />
      {activeChat ? (
        <ChatView chat={activeChat} />
      ) : (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <p>Select or create a chat to start</p>
        </div>
      )}
    </div>
  );
}
