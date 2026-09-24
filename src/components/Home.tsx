import { ArrowRight01Icon, BookOpen01Icon, CheckListIcon, CheckmarkCircle02Icon, ConversationIcon, HeartCheckIcon, LockKeyIcon, SmileIcon, TeaIcon, UserIcon } from 'hugeicons-react'
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
  const learned = phrases.filter(phrase => ['ready', 'keep-practicing'].includes(state.phraseStates[phrase.id]))
  const started = state.hasStarted || state.activity !== 'learn' || state.phraseIndex > 0 || state.levelComplete
  const activityLabel = state.levelComplete ? 'Level complete' : state.activity === 'learn' ? 'Learn a useful phrase' : state.activity === 'practice' ? 'Practice saying it' : state.activity === 'recall' ? 'Use an earlier phrase' : 'Have a short conversation'
  const greeting = state.name ? `Good to see you, ${state.name}.` : 'Good to see you.'
  const selected = selectedLevel === null ? null : levels[selectedLevel - 1]

  return <div className="home">
    <div className="home-intro"><div><p className="eyebrow">YOUR SPACE</p><h1><TypingText texts={[greeting]} className="home-greeting" ariaLabel={greeting} typingDelay={105} startDelay={280} /></h1><p>One conversation at a time.</p></div><div className="home-progress"><span>YOUR PROGRESS</span><strong>{state.levelComplete ? '1' : '0'} <small>/ 5 levels</small></strong></div></div>
    {!started ? <div className="home-main-grid entry-grid"><section className="feature-card"><div className="feature-top"><span className="eyebrow">A FRESH START</span><span className="feature-number">01</span></div><div className="feature-body"><span className="level-chip">LEVEL 1</span><h2>Begin from<br />the beginning</h2><p className="feature-title">Make a good first impression</p><p className="feature-description">Learn a few useful phrases, then try them in a conversation.</p></div><div className="feature-bottom"><div><span>START HERE</span><strong>Your first useful phrase</strong></div><button className="light-button" onClick={() => update({ screen: 'level', hasStarted: true, placementPassed: false, activity: 'learn', phraseIndex: 0 })}>Start Level 1 <ArrowRight01Icon size={19} /></button></div></section><section className="placement-card"><span className="placement-icon"><CheckListIcon size={36} strokeWidth={1.7} /></span><div><p className="eyebrow">ALREADY KNOW A LITTLE?</p><h2>Check your starting point</h2><p>Three quick choices can let you skip the phrase introductions and begin with practice.</p></div><button className="light-button" onClick={() => update({ screen: 'placement' })}>Take the short check <ArrowRight01Icon size={19} /></button></section></div> : <div className={`home-main-grid ${learned.length ? '' : 'single-card'}`}><section className="feature-card"><div className="feature-top"><span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span><span className="feature-number">01</span></div><div className="feature-body"><span className="level-chip">LEVEL 1</span><h2>Continue your<br />conversation path</h2><p className="feature-title">Make a good first impression</p><p className="feature-description">Learn how to greet someone, meet them warmly, and ask a question back.</p></div><div className="feature-bottom"><div><span>UP NEXT</span><strong>{activityLabel}</strong></div><button className="light-button" onClick={() => update({ screen: 'level' })}>{state.levelComplete ? 'Revisit level' : 'Continue lesson'} <ArrowRight01Icon size={19} /></button></div></section>{learned.length > 0 && <section className="phrasebook-card"><div className="phrasebook-card-top"><span className="eyebrow">YOUR WORDS</span><BookOpen01Icon size={38} strokeWidth={1.5} /></div><div><h2>Your phrasebook</h2><p>{learned.length} {learned.length === 1 ? 'phrase' : 'phrases'} you can return to at any time.</p><div className="phrasebook-preview">{learned.slice(0, 2).map(phrase => <span key={phrase.id}>{phrase.chinese}</span>)}</div></div><button className="light-button" onClick={() => update({ screen: 'phrasebook' })}>Open phrasebook <ArrowRight01Icon size={19} /></button></section>}</div>}
    <section className="path-section"><div className="section-heading"><div><p className="eyebrow">THE ROAD AHEAD</p><h2>Five conversations to grow into</h2></div><p>Choose a level to see what you’ll learn.</p></div>
      <div className="unit-grid">{levels.map((level, index) => { const Icon = unitIcons[index]; const active = level.number === 1; const done = active && state.levelComplete; return <button key={level.number} className={`unit-card unit-${level.number} ${selectedLevel === level.number ? 'unit-selected' : ''}`} onClick={() => active ? update({ screen: 'level', hasStarted: true }) : setSelectedLevel(selectedLevel === level.number ? null : level.number)} aria-label={`${level.title}. ${active ? 'Open lesson' : 'See level preview'}`}><span className="unit-card-top"><span>0{level.number} / 05</span>{done ? <CheckmarkCircle02Icon size={17} /> : active ? <ArrowRight01Icon size={17} /> : <LockKeyIcon size={15} />}</span><span className="unit-icon"><Icon size={32} strokeWidth={1.7} /></span><strong>{level.title}</strong><span className="unit-card-bottom">{done ? 'COMPLETED' : active ? started ? 'IN PROGRESS' : 'READY TO START' : 'PREVIEW'}</span></button> })}</div>
      {selected && <Fade key={selected.number}><div className="unit-preview"><div><span className="eyebrow">LEVEL 0{selected.number} PREVIEW</span><h3>{selected.title}</h3><p>{previews[selected.number - 1]}</p></div><div className="unit-preview-status"><LockKeyIcon size={21} /><span>{state.levelComplete ? 'This level is coming in a later milestone.' : 'Complete the earlier levels to open this one.'}</span></div></div></Fade>}
    </section>
    <div className="specific-entry"><div><span className="eyebrow">SOMETHING ON YOUR MIND?</span><h2>What do you want to be able to say?</h2><p>Personal phrase lessons are coming in a later milestone.</p></div><span className="specific-symbol">说</span></div>
  </div>
}
