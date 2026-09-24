import { Mic01Icon, RefreshIcon } from 'hugeicons-react'
import { useState } from 'react'
import type { Phrase } from '../types'

type Mode = 'practice' | 'recall' | 'conversation'
type Props = {
  phrase: Phrase
  mode: Mode
  attemptCount: number
  onSuccess: () => void
  onAttempt: () => void
  onHelp: () => void
  onContinue: () => void
}

export default function PracticePanel({ phrase, mode, attemptCount, onSuccess, onAttempt, onHelp, onContinue }: Props) {
  const [recording, setRecording] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [retry, setRetry] = useState(false)
  const conversation = mode === 'conversation'

  const toggleRecording = () => {
    if (!recording) { setRecording(true); return }
    setRecording(false)
    onAttempt()
    // Static demonstration feedback. No audio is captured or assessed here.
    if (mode === 'practice' && attemptCount === 0) setRetry(true)
    else onSuccess()
  }

  return <div className={`practice-panel ${conversation ? 'conversation-practice' : ''}`}>
    {!conversation && <><p className="eyebrow">SIMULATED SPEAKING PRACTICE</p><h2>Say it aloud.</h2><p>{phrase.situation}</p></>}
    {showHelp && <div className="help-note"><strong>{conversation ? 'A little help' : 'The phrase'}</strong><span>{phrase.chinese}</span>{!conversation && <span>{phrase.pinyin}</span>}</div>}
    {retry && <div className="practice-result"><p>Say: {phrase.chinese}</p><button className="outline-button" onClick={() => setRetry(false)}><RefreshIcon size={17} /> Try again</button></div>}
    <div className="record-area"><button className={`mic-button ${recording ? 'recording' : ''}`} onClick={toggleRecording} aria-label={recording ? 'Stop simulated speaking attempt' : 'Start simulated speaking attempt'} disabled={retry}><Mic01Icon size={29} strokeWidth={1.7} /></button><div><strong>{recording ? 'Speaking…' : 'Tap to speak'}</strong><span>{recording ? 'Tap again when you’re done' : 'This prototype does not record or assess your voice'}</span></div></div>
    <div className="practice-links">{!showHelp && <button onClick={() => { onHelp(); setShowHelp(true) }}>{conversation ? 'I need help' : 'Show the phrase'}</button>}{attemptCount >= 3 && <button onClick={onContinue}>Continue for now</button>}</div>
  </div>
}
