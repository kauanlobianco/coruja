const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY as string | undefined
const BASE = 'https://api.groq.com/openai/v1'

function authHeader() {
  if (!GROQ_KEY) throw new Error('VITE_GROQ_API_KEY not set')
  return { Authorization: `Bearer ${GROQ_KEY}` }
}

// ── Speech-to-text ─────────────────────────────────────────────────────────

export async function transcribeAudio(blob: Blob): Promise<string> {
  const form = new FormData()
  form.append('file', blob, 'audio.webm')
  form.append('model', 'whisper-large-v3')
  form.append('language', 'pt')
  form.append('response_format', 'json')

  const res = await fetch(`${BASE}/audio/transcriptions`, {
    method: 'POST',
    headers: authHeader(),
    body: form,
  })

  if (!res.ok) throw new Error(`Groq STT error: ${res.status}`)
  const data = await res.json() as { text: string }
  return data.text ?? ''
}

// ── Chat completion ────────────────────────────────────────────────────────

export type GroqMessage = { role: 'system' | 'user' | 'assistant'; content: string }

export async function groqChat(messages: GroqMessage[]): Promise<string> {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 180,
      temperature: 0.72,
    }),
  })

  if (!res.ok) throw new Error(`Groq chat error: ${res.status}`)
  const data = await res.json() as { choices: Array<{ message: { content: string } }> }
  return data.choices[0]?.message?.content ?? ''
}

// ── Text-to-speech ─────────────────────────────────────────────────────────

export async function groqSpeak(text: string): Promise<ArrayBuffer> {
  const res = await fetch(`${BASE}/audio/speech`, {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'playai-tts',
      input: text,
      voice: 'Fritz-PlayAI',
      response_format: 'wav',
    }),
  })

  if (!res.ok) throw new Error(`Groq TTS error: ${res.status}`)
  return res.arrayBuffer()
}

export function hasGroqKey(): boolean {
  return Boolean(GROQ_KEY)
}
