import { CheckmarkCircle02Icon, Mic01Icon, RefreshIcon } from 'hugeicons-react'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Phrase } from '../types'
import PhraseAudioButton from './PhraseAudioButton'

type Mode = 'practice' | 'recall' | 'conversation'
type Transcription = { heard: string; matchesPhrase: boolean }
type Props = {
  phrase: Phrase
  mode: Mode
  attemptCount: number
  onSuccess: (heard: string) => void
  onAttempt: () => void
  onHelp: () => void
  onContinue: (heard: string) => void
}

export default function PracticePanel({ phrase, mode, attemptCount, onSuccess, onAttempt, onHelp, onContinue }: Props) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'processing' | 'result' | 'error'>('idle')
  const [showHelp, setShowHelp] = useState(false)
  const [result, setResult] = useState<Transcription | null>(null)
  const [message, setMessage] = useState('')
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const startedAtRef = useRef(0)
  const mountedRef = useRef(true)
  const feedbackContextRef = useRef<AudioContext | null>(null)
  const reduceMotion = useReducedMotion()
  const conversation = mode === 'conversation'

  const playFeedback = (matched: boolean) => {
    const context = feedbackContextRef.current
    if (!context || context.state !== 'running') return
    const notes = matched ? [[523, 0], [659, 0.13]] : [[349, 0], [294, 0.16]]
    for (const [frequency, offset] of notes) {
      const start = context.currentTime + offset
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.045, start + 0.018)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.19)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(start)
      oscillator.stop(start + 0.2)
    }
  }

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
      void feedbackContextRef.current?.close()
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
      streamRef.current?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const sendRecording = async (blob: Blob) => {
    if (!mountedRef.current) return
    if (blob.size < 300 || Date.now() - startedAtRef.current < 500) {
      setMessage('That was too short. Try speaking the whole phrase.')
      setStatus('error')
      return
    }
    onAttempt()
    setStatus('processing')
    const controller = new AbortController()
    abortRef.current = controller
    const form = new FormData()
    form.append('phraseId', phrase.id)
    form.append('audio', blob, blob.type.includes('mp4') ? 'attempt.m4a' : 'attempt.webm')
    try {
      const response = await fetch('/api/transcribe', { method: 'POST', body: form, signal: controller.signal })
      const data = await response.json() as Transcription & { error?: string }
      if (!response.ok) throw new Error(data.error || 'Transcription is unavailable right now.')
      if (!mountedRef.current) return
      setResult({ heard: data.heard, matchesPhrase: data.matchesPhrase })
      playFeedback(!!data.heard && data.matchesPhrase)
      setStatus('result')
    } catch (error) {
      if (controller.signal.aborted || !mountedRef.current) return
      setMessage(error instanceof Error ? error.message : 'Transcription is unavailable right now.')
      setStatus('error')
    } finally {
      if (abortRef.current === controller) abortRef.current = null
    }
  }

  const startRecording = async () => {
    setResult(null)
    setMessage('')
    if (typeof AudioContext !== 'undefined') {
      feedbackContextRef.current ??= new AudioContext()
      void feedbackContextRef.current.resume().catch(() => {})
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setMessage('This browser cannot record audio here. Try the localhost preview in Chrome.')
      setStatus('error')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!mountedRef.current) { stream.getTracks().forEach(track => track.stop()); return }
      streamRef.current = stream
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(type => MediaRecorder.isTypeSupported(type))
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      recorderRef.current = recorder
      const chunks: BlobPart[] = []
      recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data) }
      recorder.onerror = () => { setMessage('The recording stopped unexpectedly. Try again.'); setStatus('error'); stream.getTracks().forEach(track => track.stop()) }
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
        streamRef.current = null
        void sendRecording(new Blob(chunks, { type: recorder.mimeType }))
      }
      recorder.start()
      startedAtRef.current = Date.now()
      setStatus('recording')
    } catch {
      streamRef.current?.getTracks().forEach(track => track.stop())
      setMessage('Microphone access is needed to check your words. You can retry after allowing it in your browser.')
      setStatus('error')
    }
  }

  const stopRecording = () => {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    setStatus('processing')
  }

  return <div className={`practice-panel ${conversation ? 'conversation-practice' : ''}`}>
    {mode === 'practice' ? <div className="practice-audio"><PhraseAudioButton phrase={phrase} /><span className="practice-pinyin">{phrase.pinyin}</span><span className="practice-english">{phrase.english}</span></div> : <AnimatePresence initial={false}>{showHelp && !(status === 'result' && result?.matchesPhrase) && <motion.div className="hint-reveal" initial={reduceMotion ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}><div className="practice-audio"><span className="eyebrow">YOU COULD SAY</span><PhraseAudioButton phrase={phrase} /><span className="practice-pinyin">{phrase.pinyin}</span></div></motion.div>}</AnimatePresence>}
    <div className="record-area"><button className={`mic-button ${status === 'recording' ? 'recording' : ''}`} onClick={status === 'recording' ? stopRecording : startRecording} aria-label={status === 'recording' ? 'Stop recording' : 'Start recording'} disabled={status === 'processing'}><Mic01Icon size={29} strokeWidth={1.7} /></button><div><strong>{status === 'recording' ? 'Recording…' : status === 'processing' ? 'Listening to your words…' : 'Tap to speak'}</strong><span>{status === 'recording' ? 'Tap again when you finish' : 'Your clip is sent for transcription and is not saved'}</span></div></div>
    {status === 'result' && <div className={`practice-result ${result?.matchesPhrase ? 'matched' : 'retry'}`} role="status"><p className="feedback-label">{result?.matchesPhrase ? <><CheckmarkCircle02Icon size={18} /> Correct</> : <><RefreshIcon size={17} /> {result?.heard ? 'Different words heard' : 'No clear words'}</>}</p><p className="eyebrow">I HEARD</p><strong>{result?.heard || '—'}</strong>{!result?.heard ? <p>I could not make out speech. Try again in a quieter place.</p> : !result.matchesPhrase ? <p>Listen once more and try again if you like.</p> : null}<div className="practice-result-actions"><button className="outline-button" onClick={() => { setResult(null); setStatus('idle') }}><RefreshIcon size={17} /> Try again</button>{result?.matchesPhrase ? <button className="primary-button" onClick={() => onSuccess(result.heard)}>Continue</button> : <button className="text-button" onClick={() => onContinue(result?.heard || '')}>Continue for now</button>}</div></div>}
    {status === 'error' && <div className="practice-result" role="alert"><p>{message}</p><div className="practice-result-actions"><button className="outline-button" onClick={() => { setMessage(''); setStatus('idle') }}><RefreshIcon size={17} /> Try again</button><button className="text-button" onClick={() => onContinue('')}>Continue for now</button></div></div>}
    <div className="practice-links">{mode !== 'practice' && !showHelp && status !== 'result' && <button onClick={() => { onHelp(); setShowHelp(true) }}>Hint</button>}{attemptCount > 0 && status === 'idle' && <span>Attempt {attemptCount + 1}</span>}</div>
  </div>
}
