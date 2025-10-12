import { useState, useEffect } from 'react'
import Onboarding from './pages/Onboarding'
import ChatApp from './pages/ChatApp'

export default function App() {
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key');
    if (key) setApiKey(key)
  }, [])

  if (!apiKey) {
    return <Onboarding onComplete={(key) => setApiKey(key)} />
  }
  return <ChatApp />
}
