import { ArrowRight01Icon } from 'hugeicons-react'
import { TypingText } from './animate-ui/TypingText'

export default function Intro({ onStart }: { onStart: () => void }) {
  return <div className="intro-screen">
    <div className="intro-top"><span>MANDARIN CONVERSATION</span><span>WORDS FOR REAL LIFE</span></div>
    <div className="intro-main">
      <div className="intro-copy">
        <p className="eyebrow coral-text">A MORE PERSONAL WAY TO BEGIN</p>
        <TypingText texts={['Hello.', '你好。']} className="intro-greeting" ariaLabel="Hello. 你好。" typingDelay={170} holdDelay={2100} startDelay={500} />
        <h1>Learn the words for a conversation that matters to you.</h1>
        <p>Choose who you want to speak with. We’ll start with a few useful phrases and help you use them, one moment at a time.</p>
        <button className="primary-button" onClick={onStart}>Get started <ArrowRight01Icon size={20} /></button>
      </div>
      <div className="intro-composition" aria-hidden="true">
        <div className="intro-shape-one">说</div>
        <div className="intro-shape-two">A small start.<br />A real conversation.</div>
        <div className="intro-shape-three">01 / 05</div>
      </div>
    </div>
    <div className="intro-bottom"><span>LISTEN · LEARN · SPEAK</span><span>01 / START</span></div>
  </div>
}
