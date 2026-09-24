import { ArrowLeft01Icon, ArrowRight01Icon, CheckmarkCircle02Icon } from 'hugeicons-react'
import { useState } from 'react'

type Props = { onBack: () => void; onPass: () => void; onStart: () => void }

const questions = [
  { situation: 'You meet someone for the first time.', prompt: 'Which phrase is a greeting?', choices: ['你好！', '很高兴认识你。', '你叫什么名字？'], correct: 0 },
  { situation: 'Someone has just introduced themselves.', prompt: 'Which phrase means “Nice to meet you”?', choices: ['你叫什么名字？', '很高兴认识你。', '你好！'], correct: 1 },
  { situation: 'You want to learn someone’s name.', prompt: 'What could you ask?', choices: ['很高兴认识你。', '你好！', '你叫什么名字？'], correct: 2 },
]

export default function Placement({ onBack, onPass, onStart }: Props) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [finished, setFinished] = useState(false)
  const question = questions[questionIndex]
  const score = answers.filter((answer, index) => answer === questions[index].correct).length
  const passed = score === questions.length

  const choose = (choice: number) => setAnswers(previous => {
    const next = [...previous]
    next[questionIndex] = choice
    return next
  })

  return <div className="placement-page">
    <button className="back-link" onClick={onBack}><ArrowLeft01Icon size={19} /> Back to your path</button>
    <div className="placement-frame">
      <div className="placement-intro"><p className="eyebrow">A SHORT STARTING CHECK</p><h1>See what you already know.</h1><p>Three quick choices about Level 1 phrases. Get all three right to skip their introductions and begin with practice.</p><small>This checks phrase recognition, not speaking or pronunciation.</small></div>
      <div className="placement-work">
        {!finished ? <><div className="placement-progress"><span>QUESTION 0{questionIndex + 1} / 0{questions.length}</span><div className="progress-track"><span style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }} /></div></div><p className="eyebrow coral-text">THE SITUATION</p><h2>{question.situation}</h2><p className="placement-prompt">{question.prompt}</p><div className="placement-choices">{question.choices.map((choice, index) => <button key={choice} className={answers[questionIndex] === index ? 'chosen' : ''} onClick={() => choose(index)}><span>{choice}</span>{answers[questionIndex] === index && <CheckmarkCircle02Icon size={21} />}</button>)}</div><button className="primary-button placement-next" disabled={answers[questionIndex] === undefined} onClick={() => questionIndex < questions.length - 1 ? setQuestionIndex(questionIndex + 1) : setFinished(true)}>{questionIndex < questions.length - 1 ? 'Next question' : 'See my starting point'} <ArrowRight01Icon size={19} /></button></> : <><p className="eyebrow coral-text">YOUR STARTING POINT</p><h2>{passed ? 'Begin with practice.' : 'Start with the first phrase.'}</h2><p className="placement-prompt">{passed ? 'You recognized all three phrases. You can skip their introductions and try using them.' : `You recognized ${score} of 3 phrases. The short Level 1 introductions will help you use them in context.`}</p><button className="primary-button placement-next" onClick={passed ? onPass : onStart}>{passed ? 'Begin practice' : 'Start Level 1'} <ArrowRight01Icon size={19} /></button><button className="text-button" onClick={onBack}>Back to home</button></>}
      </div>
    </div>
  </div>
}
