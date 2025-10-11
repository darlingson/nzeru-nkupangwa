/* eslint-disable prettier/prettier */
import { JSX, useState } from 'react'

export default function Chat(): JSX.Element {
    const apiKey = localStorage.getItem('gemini_api_key');
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async () => {
        if (!input.trim() || !apiKey) return;

        const userMsg = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setError(null);
        setLoading(true);

        try {
            const result = await window.electronAPI.sendMessageToGemini(apiKey, input);

            if (result.error) {
                console.error('❌ Gemini API Error:', result.error);
                setError(result.error);
                return;
            }

            console.log('✅ Gemini API response:', result.data);
            const aiText =
                result.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '⚠️ No response received.';
            setMessages((prev) => [...prev, { role: 'model', content: aiText }]);
        } catch (err) {
            console.error('💥 IPC error:', err);
            setError(String(err));
        } finally {
            setLoading(false);
        }
    };


    return (
        <div style={{ padding: 20 }}>
            <h2>Chat with Gemini</h2>

            <div
                style={{
                    border: '1px solid #ddd',
                    padding: '10px',
                    height: '400px',
                    overflowY: 'auto',
                    borderRadius: '8px',
                    marginBottom: '10px',
                }}
            >
                {messages.map((m, i) => (
                    <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left', margin: '8px 0' }}>
                        <b>{m.role === 'user' ? 'You:' : 'Gemini:'}</b> {m.content}
                    </div>
                ))}
                {loading && <div style={{ opacity: 0.6 }}>⏳ Gemini is thinking...</div>}
            </div>

            {error && (
                <div style={{ color: 'red', marginBottom: 10 }}>
                    <b>Error:</b> {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    placeholder="Type your message..."
                />
                <button
                    onClick={sendMessage}
                    disabled={loading}
                    style={{
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
