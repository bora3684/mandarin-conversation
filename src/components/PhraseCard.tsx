import type { Phrase } from '../types'
import PhraseAudioButton from './PhraseAudioButton'

export default function PhraseCard({ phrase }: { phrase: Phrase }) {
  return <div className="phrase-card"><div className="phrase-main"><p className="eyebrow">TAP THE CHINESE TO HEAR IT</p><PhraseAudioButton key={phrase.id} phrase={phrase} /><div className="phrase-pinyin">{phrase.pinyin}</div><div className="phrase-english">{phrase.english}</div></div><div className="phrase-note"><span className="eyebrow">WHEN TO USE IT</span><p>{phrase.note}</p></div><div className="breakdown"><span className="eyebrow">PIECE BY PIECE</span><div className="chunk-grid">{phrase.chunks.map(chunk => <div className="chunk" key={chunk.chinese}><strong>{chunk.chinese}</strong><span>{chunk.pinyin}</span><small>{chunk.meaning}</small></div>)}</div></div></div>
}
