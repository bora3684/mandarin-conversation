import { VolumeHighIcon } from 'hugeicons-react'
import type { Phrase } from '../types'

export default function PhraseCard({ phrase }: { phrase: Phrase }) {
  return <div className="phrase-card"><div className="phrase-main"><p className="eyebrow">SAY THIS</p><div className="phrase-chinese">{phrase.chinese}</div><div className="phrase-pinyin">{phrase.pinyin}</div><div className="phrase-english">{phrase.english}</div><button className="audio-button" disabled aria-label="Audio preview is not available in this prototype"><VolumeHighIcon size={20} strokeWidth={1.8} /> Audio preview <span>COMING LATER</span></button></div><div className="phrase-note"><span className="eyebrow">WHEN TO USE IT</span><p>{phrase.note}</p></div><div className="breakdown"><span className="eyebrow">PIECE BY PIECE</span><div className="chunk-grid">{phrase.chunks.map(chunk => <div className="chunk" key={chunk.chinese}><strong>{chunk.chinese}</strong><span>{chunk.pinyin}</span><small>{chunk.meaning}</small><button disabled aria-label={`Audio for ${chunk.chinese} coming later`}><VolumeHighIcon size={17} /></button></div>)}</div></div></div>
}
