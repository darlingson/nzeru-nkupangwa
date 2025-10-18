import { useState, FormEvent, ChangeEvent } from 'react'

type OnboardingProps = { onComplete: (key: string) => void }

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [apiKey, setApiKey] = useState<string>('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = apiKey.trim()
    if (trimmed) {
      localStorage.setItem('gemini_api_key', trimmed)
      onComplete(trimmed)
    }
  }

  const ok = apiKey.trim().length > 0

  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0052d4', // bright, saturated blue
        padding: '1.5rem'
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#ffffff', // white card
          borderRadius: 12,
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,.25)',
          textAlign: 'center'
        }}
      >
        <h1 style={{ color: '#0052d4', fontSize: '1.75rem', margin: '0 0 .5rem 0' }}>
          Welcome to Nzeru Nkupangwa
        </h1>
        <p style={{ color: '#444', margin: '0 0 2rem 0' }}>
          This is your personal AI assistant. Paste your Gemini API key below to start chatting.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Gemini API key"
            value={apiKey}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setApiKey(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '.75rem 1rem',
              fontSize: '1rem',
              borderRadius: 6,
              border: '2px solid #0052d4',
              background: '#ffffff', // white field
              color: '#000000', // black text
              caretColor: '#000',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={!ok}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '.75rem 0',
              fontSize: '1rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: 6,
              background: ok ? '#0052d4' : '#90caf9',
              color: '#fff',
              cursor: ok ? 'pointer' : 'not-allowed'
            }}
          >
            Continue
          </button>
        </form>

        <footer style={{ marginTop: '1rem', fontSize: '.75rem', color: '#666' }}>
          Your key is stored locally and never leaves your browser.
        </footer>
      </section>
    </main>
  )
}
