import { ArrowLeft01Icon } from 'hugeicons-react'
import { useState } from 'react'
import { phrases } from '../data/connector'
import type { PrototypeState } from '../types'
import PhraseCard from './PhraseCard'

export default function Phrasebook({ state, onBack }: { state: PrototypeState; onBack: () => void }) {
  const learned = phrases.filter(phrase => ['ready', 'keep-practicing'].includes(state.phraseStates[phrase.id]))
  const [selectedId, setSelectedId] = useState(learned[0]?.id)
  const selected = learned.find(phrase => phrase.id === selectedId) || learned[0]

  return <div className="phrasebook-page"><button className="back-link" onClick={onBack}><ArrowLeft01Icon size={19} /> Back to your path</button><div className="phrasebook-heading"><p className="eyebrow">YOUR WORDS</p><h1>Your phrasebook</h1><p>Every phrase you’ve practiced lives here. Open one whenever you want a reminder.</p></div>{selected ? <div className="phrasebook-layout"><div className="phrasebook-list">{learned.map(phrase => <button key={phrase.id} className={selected.id === phrase.id ? 'selected' : ''} onClick={() => setSelectedId(phrase.id)}><strong>{phrase.chinese}</strong><span>{phrase.english}</span></button>)}</div><PhraseCard phrase={selected} /></div> : <p>Your first phrase will appear here after you practice it.</p>}</div>
}
