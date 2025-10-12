import { Plus, Trash2 } from 'lucide-react'

export default function ChatSidebar({ chats, activeChat, onSelect, onNewChat, onDelete }) {
  return (
    <>
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition font-medium"
        >
          <Plus size={20} />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {chats.map((c) => (
          <div
            key={c.id}
            onClick={() => onSelect(c)}
            className={`p-3 mb-2 rounded-lg cursor-pointer transition group ${
              activeChat?.id === c.id ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.title}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(c.id)
                }}
                className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-gray-600 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
