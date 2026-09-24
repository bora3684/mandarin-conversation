import { VolumeHighIcon } from 'hugeicons-react'
import { useEffect, useRef, useState } from 'react'
import type { Phrase } from '../types'

type Props = { phrase: Phrase } | { text: string; audioSrc: string }

export default function PhraseAudioButton(props: Props) {
  const text = 'phrase' in props ? props.phrase.chinese : props.text
  const audioSrc = 'phrase' in props ? `/audio/samples/${props.phrase.id}.wav` : props.audioSrc
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    return () => audioRef.current?.pause()
  }, [])

  const play = async () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    setError(false)
    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
      setError(true)
    }
  }

  return <>
    <audio ref={audioRef} src={audioSrc} preload="none" onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setError(true) }} />
    <button className={`audio-button ${playing ? 'is-playing' : ''}`} type="button" onClick={play} aria-label={`Play pronunciation for ${text}`}><span>{text}</span><VolumeHighIcon size={21} strokeWidth={1.8} aria-hidden="true" /></button>
    {error && <span className="audio-error" role="status">Audio could not play. Try again.</span>}
  </>
}
