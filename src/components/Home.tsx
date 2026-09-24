import { ArrowRight01Icon, CheckmarkCircle02Icon, ConversationIcon, HeartCheckIcon, LockKeyIcon, SmileIcon, TeaIcon, UserIcon } from 'hugeicons-react'
import { useState } from 'react'
import { levels, phrases } from '../data/connector'
import type { PrototypeState } from '../types'
import { Fade } from './animate-ui/Fade'
import { TypingText } from './animate-ui/TypingText'

type Props = { state: PrototypeState; update: (patch: Partial<PrototypeState>) => void }

const unitIcons = [SmileIcon, UserIcon, TeaIcon, ConversationIcon, HeartCheckIcon]
const previews = [
  'Greet someone, respond warmly, and ask a question back.',
  'Share your name and a little about your everyday life.',
  'Join a simple conversation around food or tea.',
  'Respond naturally and give the other person room to speak.',
  'Bring the pieces together in one short conversation.',
]

export default function Home({ state, update }: Props) {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)
  const ready = phrases.filter(phrase => state.phraseStates[phrase.id] === 'ready').slice(0, 3)
  const started = state.hasStarted || state.activity !== 'learn' || state.phraseIndex > 0 || state.levelComplete
  const activityLabel = state.levelComplete ? 'Level complete' : state.activity === 'learn' ? 'Learn a useful phrase' : state.activity === 'practice' ? 'Practice saying it' : state.activity === 'recall' ? 'Recall what you learned' : 'Have a short conversation'
  const greeting = state.name ? `Good to see you, ${state.name}.` : 'Good to see you.'
  const selected = selectedLevel === null ? null : levels[selectedLevel - 1]

  return <div className="home">
    <div className="home-intro"><div><p className="eyebrow">YOUR SPACE</p><h1><TypingText texts={[greeting]} className="home-greeting" ariaLabel={greeting} typingDelay={105} startDelay={280} /></h1><p>One conversation at a time.</p></div><div className="home-progress"><span>YOUR PROGRESS</span><strong>{state.levelComplete ? '1' : '0'} <small>/ 5 levels</small></strong></div></div>
    <div className="home-main-grid"><section className="feature-card"><div className="feature-top"><span className="eyebrow">{started ? 'PICK UP WHERE YOU LEFT OFF' : 'YOUR FIRST LESSON'}</span><span className="feature-number">01</span></div><div className="feature-body"><span className="level-chip">LEVEL 1</span><h2>{started ? <>Continue your<br />conversation path</> : <>Start your<br />conversation path</>}</h2><p className="feature-title">Make a good first impression</p><p className="feature-description">Learn how to greet someone, meet them warmly, and ask a question back.</p></div><div className="feature-bottom"><div><span>UP NEXT</span><strong>{activityLabel}</strong></div><button className="light-button" onClick={() => update({ screen: 'level', hasStarted: true })}>{state.levelComplete ? 'Revisit level' : started ? 'Continue lesson' : 'Start lesson'} <ArrowRight01Icon size={19} /></button></div></section>
      <section className="recall-card"><div className="recall-header"><span className="eyebrow">A LITTLE PRACTICE</span><span className="recall-mark">记</span></div><h2>Ready for recall</h2><p>Keep familiar words close, and bring them into conversation.</p><div className="recall-list">{ready.length ? ready.map(phrase => <div className="recall-row" key={phrase.id}><span className="hanzi">{phrase.chinese}</span><span>{phrase.english}</span></div>) : <div className="empty-recall">Phrases you learn will appear here.</div>}</div></section></div>
    <section className="path-section"><div className="section-heading"><div><p className="eyebrow">THE ROAD AHEAD</p><h2>Five conversations to grow into</h2></div><p>Choose a level to see what you’ll learn.</p></div>
      <div className="unit-grid">{levels.map((level, index) => { const Icon = unitIcons[index]; const active = level.number === 1; const done = active && state.levelComplete; return <button key={level.number} className={`unit-card unit-${level.number} ${selectedLevel === level.number ? 'unit-selected' : ''}`} onClick={() => active ? update({ screen: 'level', hasStarted: true }) : setSelectedLevel(selectedLevel === level.number ? null : level.number)} aria-label={`${level.title}. ${active ? 'Open lesson' : 'See level preview'}`}><span className="unit-card-top"><span>0{level.number} / 05</span>{done ? <CheckmarkCircle02Icon size={17} /> : active ? <ArrowRight01Icon size={17} /> : <LockKeyIcon size={15} />}</span><span className="unit-icon"><Icon size={32} strokeWidth={1.7} /></span><strong>{level.title}</strong><span className="unit-card-bottom">{done ? 'COMPLETED' : active ? started ? 'IN PROGRESS' : 'READY TO START' : 'PREVIEW'}</span></button> })}</div>
      {selected && <Fade key={selected.number}><div className="unit-preview"><div><span className="eyebrow">LEVEL 0{selected.number} PREVIEW</span><h3>{selected.title}</h3><p>{previews[selected.number - 1]}</p></div><div className="unit-preview-status"><LockKeyIcon size={21} /><span>{state.levelComplete ? 'This level is coming in a later milestone.' : 'Complete the earlier levels to open this one.'}</span></div></div></Fade>}
    </section>
    <div className="specific-entry"><div><span className="eyebrow">SOMETHING ON YOUR MIND?</span><h2>What do you want to be able to say?</h2><p>Personal phrase lessons are coming in a later milestone.</p></div><span className="specific-symbol">说</span></div>
  </div>
}
