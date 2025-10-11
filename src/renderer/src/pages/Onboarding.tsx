import { useState } from 'react';

export default function Onboarding({ onComplete }: { onComplete: (key: string) => void }) {
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      onComplete(apiKey.trim());
    }
  };
  
  return (
    <div style={{ padding: 40, maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <h1>Welcome to Nzeru Nkupangwa</h1>
      <p>Enter your Gemini API key to get started:</p>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Gemini API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            marginBottom: '10px',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
