// ChatApp.tsx
import { useEffect, useState } from 'react'
import ChatSidebar from '../components/ChatSidebar'
import ChatView from '../components/ChatView'
import { Menu, X } from 'lucide-react'

export default function ChatApp() {
  const [chats, setChats] = useState<any[]>([])
  const [activeChat, setActiveChat] = useState<any | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    const all = await window.chatAPI.getChats()
    setChats(all)
    if (all.length > 0 && !activeChat) setActiveChat(all[0])
  }

  const newChat = async () => {
    const chat = await window.chatAPI.createChat(`New Chat ${chats.length + 1}`)
    await loadChats()
    setActiveChat(chat)
  }

  const deleteChat = async (id: number) => {
    await window.chatAPI.deleteChat(id)
    await loadChats()
    setActiveChat(null)
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 bg-gray-800 flex flex-col border-r border-gray-700 overflow-hidden`}>
        <ChatSidebar
          chats={chats}
          activeChat={activeChat}
          onSelect={setActiveChat}
          onNewChat={newChat}
          onDelete={deleteChat}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700 p-4 flex items-center justify-between bg-gray-800">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold">{activeChat?.title || 'Select a chat'}</h1>
          <div className="w-8" />
        </div>

        {activeChat ? (
          <ChatView chat={activeChat} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            <p>Select or create a chat to start</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ChatSidebar.tsx

// ChatView.tsx
