// src/components/ChatView.tsx
import { useEffect, useState } from 'react';

export default function ChatView({ chat }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chat) loadMessages();
  }, [chat]);

  const loadMessages = async () => {
    const msgs = await window.chatAPI.getMessages(chat.id);
    setMessages(msgs);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      setError('Missing Gemini API key');
      return;
    }

    const userMsg = { chat_id: chat.id, role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      // save user message to db
      await window.chatAPI.addMessage(chat.id, 'user', input);

      // send to Gemini
      const result = await window.electronAPI.sendMessageToGemini(apiKey, input);

      if (result.error) {
        console.error('❌ Gemini API error:', result.error);
        setError(result.error);
        return;
      }

      const aiText =
        result.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '⚠️ No response received.';

      const aiMsg = { chat_id: chat.id, role: 'model', content: aiText };
      setMessages((prev) => [...prev, aiMsg]);
      await window.chatAPI.addMessage(chat.id, 'model', aiText);
    } catch (err) {
      console.error('💥 IPC error:', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 20px',
          borderBottom: '1px solid #ddd',
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              textAlign: m.role === 'user' ? 'right' : 'left',
              margin: '8px 0',
            }}
          >
            <b>{m.role === 'user' ? 'You:' : 'Gemini:'}</b> {m.content}
          </div>
        ))}
        {loading && <div style={{ opacity: 0.6 }}>⏳ Gemini is thinking...</div>}
      </div>

      {error && (
        <div style={{ color: 'red', margin: '10px 20px' }}>
          <b>Error:</b> {error}
        </div>
      )}

      <div style={{ display: 'flex', padding: '10px 20px', borderTop: '1px solid #ddd' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            marginLeft: 10,
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: loading ? '#aaa' : '#007bff',
            color: 'white',
            border: 'none',
            cursor: loading ? 'default' : 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
