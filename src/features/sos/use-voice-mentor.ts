import { useCallback, useRef, useState } from 'react'
import { groqChat, groqSpeak, transcribeAudio, type GroqMessage } from '../../core/remote/groq'

export type VoiceState = 'idle' | 'requesting' | 'listening' | 'processing' | 'speaking' | 'error'

export interface VoiceMentorOptions {
  systemPrompt: string
  onTranscript?: (text: string) => void
  onReply?: (text: string) => void
  onStateChange?: (state: VoiceState) => void
}

export function useVoiceMentor(options: VoiceMentorOptions) {
  const { systemPrompt, onTranscript, onReply, onStateChange } = options

  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState('')
  const [reply, setReply] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const audioCtxRef = useRef<AudioContext | null>(null)
  const historyRef = useRef<GroqMessage[]>([])

  const setState = useCallback((s: VoiceState) => {
    setVoiceState(s)
    onStateChange?.(s)
  }, [onStateChange])

  // ── Start recording ──────────────────────────────────────────────────────

  const startListening = useCallback(async () => {
    setError(null)
    setState('requesting')

    // Safari iOS: getUserMedia must be called directly from a user gesture.
    // We show 'requesting' state so the user knows the dialog is coming.
    // navigator.mediaDevices is undefined on HTTP (insecure context)
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Requer HTTPS. Acesse via https:// na rede local.')
      setState('error')
      return
    }

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch (err) {
      const name = err instanceof DOMException ? err.name : ''
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setError('Permissão negada. Vá em Ajustes > Safari > Microfone.')
      } else if (name === 'SecurityError') {
        setError('Requer HTTPS. Acesse via https:// na rede local.')
      } else if (name === 'NotFoundError') {
        setError('Nenhum microfone encontrado neste dispositivo.')
      } else {
        setError('Não foi possível acessar o microfone.')
      }
      setState('error')
      return
    }

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/ogg;codecs=opus'

    const recorder = new MediaRecorder(stream, { mimeType })
    chunksRef.current = []

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop())
      const blob = new Blob(chunksRef.current, { type: mimeType })
      await processAudio(blob)
    }

    mediaRecorderRef.current = recorder
    recorder.start(200)
    setState('listening')
  }, [setState]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Stop recording → process ─────────────────────────────────────────────

  const stopListening = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setState('processing')
  }, [setState])

  // ── Process: STT → LLM → TTS ────────────────────────────────────────────

  const processAudio = useCallback(async (blob: Blob) => {
    try {
      // 1. Speech-to-text
      const userText = await transcribeAudio(blob)
      if (!userText.trim()) {
        setState('idle')
        return
      }

      setTranscript(userText)
      onTranscript?.(userText)

      // 2. LLM — build history
      const messages: GroqMessage[] = [
        { role: 'system', content: systemPrompt },
        ...historyRef.current,
        { role: 'user', content: userText },
      ]

      const aiText = await groqChat(messages)

      // Save to history (keep last 6 turns to avoid overflow)
      historyRef.current = [
        ...historyRef.current,
        { role: 'user', content: userText },
        { role: 'assistant', content: aiText },
      ].slice(-6)

      setReply(aiText)
      onReply?.(aiText)
      setState('speaking')

      // 3. TTS — play audio
      try {
        const audioBuffer = await groqSpeak(aiText)
        const ctx = new AudioContext()
        audioCtxRef.current = ctx
        const decoded = await ctx.decodeAudioData(audioBuffer)
        const source = ctx.createBufferSource()
        source.buffer = decoded
        source.connect(ctx.destination)
        source.start()
        source.onended = () => {
          setState('listening')
          void startListening()
        }
      } catch {
        // TTS failed — still show text, wait for tap
        // State stays 'speaking' so user can read, then tap to continue
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
      setState('error')
    }
  }, [systemPrompt, onTranscript, onReply, setState, startListening])

  // ── Toggle: tap orb ─────────────────────────────────────────────────────

  const handleOrbTap = useCallback(async () => {
    if (voiceState === 'idle' || voiceState === 'error' || voiceState === 'speaking') {
      await startListening()
    } else if (voiceState === 'listening') {
      stopListening()
    }
    // requesting | processing → ignore tap
  }, [voiceState, startListening, stopListening])

  const reset = useCallback(() => {
    mediaRecorderRef.current?.stop()
    audioCtxRef.current?.close()
    historyRef.current = []
    setTranscript('')
    setReply('')
    setError(null)
    setState('idle')
  }, [setState])

  return { voiceState, transcript, reply, error, handleOrbTap, reset }
}
