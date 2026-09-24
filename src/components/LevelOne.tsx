import { useState } from 'react'
import PhraseAudioButton from './PhraseAudioButton'
import { ArrowLeft01Icon, ArrowRight01Icon, CheckmarkCircle02Icon } from 'hugeicons-react'
import { phrases } from '../data/connector'
import type { PrototypeState } from '../types'
import PhraseCard from './PhraseCard'
import PracticePanel from './PracticePanel'
import { Fade } from './animate-ui/Fade'

type Props = { state: PrototypeState; update: (patch: Partial<PrototypeState>) => void; setPhraseState: (id: string, value: PrototypeState['phraseStates'][string]) => void }

export default function LevelOne({ state, update, setPhraseState }: Props) {
  const [partnerReplyVisible, setPartnerReplyVisible] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Array<{ speaker: 'partner' | 'you'; text: string; audioSrc?: string }>>([{ speaker: 'partner', text: '你好！', audioSrc: '/audio/samples/hello.wav' }])
  const [lastHeard, setLastHeard] = useState('')
  const phrase = phrases[state.phraseIndex] || phrases[0]
  const conversationOrder = [0, 2, 1]
  const conversationTurn = conversationOrder.indexOf(state.phraseIndex)
  const replyLine = conversationTurn === 1 ? { text: '我叫小林。', audioSrc: '/audio/samples/partner-name.wav' } : { text: '我也很高兴认识你。', audioSrc: '/audio/samples/partner-nice-to-meet-you.wav' }
  const sequence = state.placementPassed
    ? ['learn-0', 'practice-0', 'practice-1', 'recall-0', 'practice-2', 'recall-1', 'recall-2', 'conversation-0', 'conversation-2', 'conversation-1']
    : ['learn-0', 'practice-0', 'learn-1', 'practice-1', 'recall-0', 'learn-2', 'practice-2', 'recall-1', 'recall-2', 'conversation-0', 'conversation-2', 'conversation-1']
  const total = sequence.length
  const current = state.activity === 'complete' ? total : Math.max(1, sequence.indexOf(`${state.activity}-${state.phraseIndex}`) + 1)
  const completedSteps = state.activity === 'complete' ? total : current - 1
  const remainingSteps = sequence.slice(completedSteps)
  const stages = [
    { label: 'Learn and practice', active: ['learn', 'practice'].includes(state.activity), done: !remainingSteps.some(step => step.startsWith('learn') || step.startsWith('practice')) },
    { label: 'Use them again', active: state.activity === 'recall', done: !remainingSteps.some(step => step.startsWith('recall')) },
    { label: 'Have a conversation', active: state.activity === 'conversation', done: state.activity === 'complete' },
  ]
  const advancePractice = (needsRecall = false) => {
    setPhraseState(phrase.id, needsRecall ? 'keep-practicing' : 'ready')
    if (state.phraseIndex === 0) update({ phraseIndex: 1, activity: state.placementPassed ? 'practice' : 'learn', attemptCount: 0, usedSupport: false })
    else if (state.phraseIndex === 1) update({ phraseIndex: 0, activity: 'recall', attemptCount: 0, usedSupport: false })
    else update({ phraseIndex: 1, activity: 'recall', attemptCount: 0, usedSupport: false })
  }
  const advanceRecall = () => {
    if (state.phraseIndex === 0) update({ phraseIndex: 2, activity: state.placementPassed ? 'practice' : 'learn', attemptCount: 0, usedSupport: false })
    else if (state.phraseIndex === 1) update({ phraseIndex: 2, activity: 'recall', attemptCount: 0, usedSupport: false })
    else update({ activity: 'conversation', phraseIndex: 0, attemptCount: 0, usedSupport: false })
  }
  const advanceConversation = () => {
    setPartnerReplyVisible(false)
    if (lastHeard) setConversationHistory(previous => [...previous, { speaker: 'you', text: lastHeard }, ...(conversationTurn === 0 ? [] : [{ speaker: 'partner' as const, ...replyLine }])])
    setLastHeard('')
    if (conversationTurn < conversationOrder.length - 1) update({ phraseIndex: conversationOrder[conversationTurn + 1], attemptCount: 0, usedSupport: false })
    else update({ activity: 'complete', levelComplete: true, attemptCount: 0 })
  }
  const finishConversationTurn = (needsRecall = false, heard = '') => {
    if (needsRecall) setPhraseState(phrase.id, 'keep-practicing')
    setLastHeard(heard || phrase.chinese)
    if (conversationTurn === 0) {
      setConversationHistory(previous => [...previous, { speaker: 'you', text: heard || phrase.chinese }])
      update({ phraseIndex: conversationOrder[1], attemptCount: 0, usedSupport: false })
      return
    }
    setPartnerReplyVisible(true)
    const audio = new Audio(replyLine.audioSrc)
    void audio.play().catch(() => {})
  }

  return <div className="level-page page-enter"><div className="lesson-top"><button className="back-link" onClick={() => update({ screen: 'home' })}><ArrowLeft01Icon size={19} /> Back to your path</button><div className="lesson-progress"><span>LEVEL 01 · MAKE A GOOD FIRST IMPRESSION</span><div className="progress-track"><span style={{ width: `${Math.min(100, (completedSteps / total) * 100)}%` }} /></div><span>{completedSteps} / {total}</span></div></div>
    {state.activity === 'complete' ? <Fade><section className="completion"><span className="complete-icon"><CheckmarkCircle02Icon size={42} strokeWidth={1.5} /></span><p className="eyebrow">LEVEL 01 COMPLETE</p><h1>You made a good first impression.</h1><p>You greeted someone, responded warmly, and asked a question. Those are words you can use outside this lesson.</p><button className="primary-button" onClick={() => update({ screen: 'home' })}>Back to your path <ArrowRight01Icon size={19} /></button></section></Fade> : <div className="lesson-layout"><aside className="lesson-aside"><div className="outline-details"><span className="level-chip">LEVEL 1</span><h1>Make a good first impression</h1><p>Start with a greeting. Let the conversation open from there.</p><div className="lesson-steps">{stages.map((stage, index) => <div key={stage.label} className={stage.active ? 'current' : stage.done ? 'done' : ''}><span>{stage.done ? <CheckmarkCircle02Icon size={17} strokeWidth={2} /> : `0${index + 1}`}</span>{stage.label}</div>)}</div><div className="outline-progress"><span className="eyebrow">YOUR PROGRESS</span><strong>{completedSteps} of {total} steps complete</strong><div className="outline-progress-segments" role="progressbar" aria-label="Level 1 progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={completedSteps}>{Array.from({ length: total }, (_, index) => <span key={index} className={index < completedSteps ? 'done' : ''} />)}</div></div></div></aside><section className="lesson-content"><Fade key={`${state.activity}-${state.phraseIndex}`}>
      {state.activity === 'learn' && <><div className="activity-heading"><h2>{phrase.id === 'hello' ? 'Begin with a hello.' : phrase.id === 'your-name' ? 'Ask their name.' : 'Respond warmly.'}</h2></div><PhraseCard phrase={phrase} /><div className="lesson-actions"><span>PHRASE 0{state.phraseIndex + 1} OF 0{phrases.length}</span><button className="primary-button" onClick={() => { setPhraseState(phrase.id, 'practicing'); update({ activity: 'practice' }) }}>Practice this phrase <ArrowRight01Icon size={19} /></button></div></>}
      {state.activity === 'practice' && <><div className="activity-heading"><h2>Say it aloud.</h2></div><PracticePanel key={phrase.id} phrase={phrase} mode="practice" attemptCount={state.attemptCount} onAttempt={() => update({ attemptCount: state.attemptCount + 1 })} onHelp={() => update({ usedSupport: true })} onSuccess={() => advancePractice()} onContinue={() => advancePractice(true)} /></>}
      {state.activity === 'recall' && <><div className="activity-heading"><h2>Use it again.</h2></div><div className="situation-card"><span className="eyebrow">THE SITUATION</span><h3>{phrase.situation}</h3></div><PracticePanel key={`recall-${phrase.id}`} phrase={phrase} mode="recall" attemptCount={state.attemptCount} onAttempt={() => update({ attemptCount: state.attemptCount + 1 })} onHelp={() => { update({ usedSupport: true }); setPhraseState(phrase.id, 'keep-practicing') }} onSuccess={advanceRecall} onContinue={() => { setPhraseState(phrase.id, 'keep-practicing'); advanceRecall() }} /></>}
      {state.activity === 'conversation' && <div className="conversation-stage"><div className="conversation-stage-top"><span className="eyebrow coral-text">PRACTICE CONVERSATION</span><span className="conversation-count">TURN {conversationTurn + 1} OF {conversationOrder.length}</span></div><div className="conversation-chat-header"><span className="conversation-avatar" aria-hidden="true">林</span><div><strong>Xiaolin</strong><span>Practice conversation</span></div></div><div className="conversation-thread" aria-label="Practice conversation">{conversationHistory.map((line, index) => <div className={`conversation-bubble ${line.speaker}`} key={`${index}-${line.text}`}><span className="eyebrow">{line.speaker === 'partner' ? 'XIAOLIN' : 'YOU'}</span>{line.audioSrc ? <PhraseAudioButton text={line.text} audioSrc={line.audioSrc} /> : <strong>{line.text}</strong>}</div>)}</div><div className="conversation-prompt"><h2>{conversationTurn === 0 ? 'Say hello back.' : conversationTurn === 1 ? 'Ask Xiaolin’s name.' : 'Respond to Xiaolin.'}</h2></div>{!partnerReplyVisible ? <PracticePanel key={`conversation-${state.phraseIndex}`} phrase={phrase} mode="conversation" attemptCount={state.attemptCount} onAttempt={() => update({ attemptCount: state.attemptCount + 1 })} onHelp={() => { update({ usedSupport: true }); setPhraseState(phrase.id, 'keep-practicing') }} onSuccess={heard => finishConversationTurn(false, heard)} onContinue={heard => finishConversationTurn(true, heard)} /> : <Fade><div className="conversation-new-lines"><div className="conversation-bubble you"><span className="eyebrow">YOU</span><strong>{lastHeard}</strong></div><div className="conversation-bubble partner"><span className="eyebrow">XIAOLIN</span><PhraseAudioButton text={replyLine.text} audioSrc={replyLine.audioSrc} /><span className="partner-meaning">{conversationTurn === 1 ? 'My name is Xiaolin.' : 'It’s nice to meet you too.'}</span></div><button className="primary-button" onClick={advanceConversation}>{conversationTurn === conversationOrder.length - 1 ? 'Finish conversation' : 'Next turn'} <ArrowRight01Icon size={19} /></button></div></Fade>}</div>}
    </Fade></section></div>}
  </div>
}
