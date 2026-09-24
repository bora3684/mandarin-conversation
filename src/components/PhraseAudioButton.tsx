import { VolumeHighIcon } from 'hugeicons-react'
import { useEffect, useRef, useState } from 'react'
import type { Phrase } from '../types'

export default function PhraseAudioButton({ phrase }: { phrase: Phrase }) {
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
    <audio ref={audioRef} src={`/audio/samples/${phrase.id}.wav`} preload="none" onEnded={() => setPlaying(false)} onError={() => { setPlaying(false); setError(true) }} />
    <button className={`audio-button ${playing ? 'is-playing' : ''}`} type="button" onClick={play} aria-label={`Play pronunciation for ${phrase.chinese}`}><span>{phrase.chinese}</span><VolumeHighIcon size={21} strokeWidth={1.8} aria-hidden="true" /></button>
    {error && <span className="audio-error" role="status">Audio could not play. Try again.</span>}
  </>
}
