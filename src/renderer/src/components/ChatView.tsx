import { JSX, useEffect, useState } from 'react'
import { Send, AlertCircle, Loader } from 'lucide-react'

export default function ChatView({ chat }: { chat: unknown }): JSX.Element {
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (chat) loadMessages()
  }, [chat])

  const loadMessages = async () => {
    const msgs = await window.chatAPI.getMessages(chat.id)
    setMessages(msgs)
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const apiKey = localStorage.getItem('gemini_api_key')
    if (!apiKey) {
      setError('Missing Gemini API key')
      return
    }

    const userMsg = { chat_id: chat.id, role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      await window.chatAPI.addMessage(chat.id, 'user', input)
      const result = await window.electronAPI.sendMessageToGemini(apiKey, input)

      if (result.error) {
        console.error('❌ Gemini API error:', result.error)
        setError(result.error)
        return
      }

      const aiText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '⚠️ No response received.'
      const aiMsg = { chat_id: chat.id, role: 'model', content: aiText }
      setMessages((prev) => [...prev, aiMsg])
      await window.chatAPI.addMessage(chat.id, 'model', aiText)
    } catch (err) {
      console.error('💥 IPC error:', err)
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Start a conversation...</p>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'
                }`}
              >
                <p className="text-sm">{m.content}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
              <Loader size={16} className="animate-spin" />
              <span className="text-sm">Gemini is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-2">
          <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-400">Error</p>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-700 p-4 bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 transition disabled:opacity-50 text-white placeholder-gray-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition flex items-center gap-2 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}