import { ArrowRight01Icon } from 'hugeicons-react'
import { TypingText } from './animate-ui/TypingText'

export default function Intro({ onStart }: { onStart: () => void }) {
  return <div className="intro-screen">
    <div className="intro-main">
      <div className="intro-copy">
        <p className="eyebrow coral-text">mao</p>
        <TypingText texts={['Hello.', '你好。']} className="intro-greeting" ariaLabel="Hello. 你好。" typingDelay={170} holdDelay={2100} startDelay={500} />
        <h1>Learn the words for a conversation that matters to you.</h1>
        <p>Tell us what brings you here. Then choose whether to check your starting point or begin from the beginning.</p>
        <button className="primary-button" onClick={onStart}>Get started <ArrowRight01Icon size={20} /></button>
      </div>
    </div>
  </div>
}
