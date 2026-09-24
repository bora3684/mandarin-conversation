import { ArrowLeft01Icon, ArrowRight01Icon, CheckmarkCircle02Icon } from 'hugeicons-react'
import { goals, situations } from '../data/connector'
import type { PrototypeState } from '../types'

type Props = { state: PrototypeState; update: (patch: Partial<PrototypeState>) => void }

export default function Onboarding({ state, update }: Props) {
  const step = Math.min(state.onboardingStep, 1)
  const options = step === 0 ? goals : situations
  const selected = step === 0 ? state.goal : state.situation
  const connectorChosen = state.goal === goals[1]

  return <div className="onboarding">
    <section className="onboarding-main">
      <div className="step-indicator"><span>{step === 0 ? 'YOUR REASON' : 'YOUR FIRST CONVERSATION'}</span><span>0{step + 1} / 02</span></div>
      <p className="eyebrow coral-text">{step === 0 ? 'START HERE' : 'MAKE IT REAL'}</p>
      <h1>{step === 0 ? 'What do you want to be able to do in Chinese?' : 'Where might your first conversation happen?'}</h1>
      <p className="subhead">{step === 0 ? 'Choose what brings you here.' : 'Pick a setting. You can change this later.'}</p>
      <div className={`choice-grid ${step === 0 ? 'goal-choices' : 'situation-choices'}`}>
        {options.map((option, index) => <button key={option} className={`choice-card ${selected === option ? 'selected' : ''}`} onClick={() => update(step === 0 ? { goal: option } : { situation: option })}>
          <span className="choice-index">0{index + 1}</span><span>{option}</span>
          <span className="choice-check">{selected === option ? <CheckmarkCircle02Icon size={21} strokeWidth={1.8} /> : <ArrowRight01Icon size={19} strokeWidth={1.7} />}</span>
        </button>)}
      </div>
      {step === 0 && state.goal && !connectorChosen && <p className="selection-note">The first prototype path is for speaking with someone important to you.</p>}
      {step === 1 && <label className="name-field">What should we call you? <span>REQUIRED</span><input value={state.name} onChange={event => update({ name: event.target.value })} placeholder="Your first name" required maxLength={40} /></label>}
      <div className="onboarding-actions">
        {step === 1 && <button className="text-button" onClick={() => update({ onboardingStep: 0 })}><ArrowLeft01Icon size={18} /> Back</button>}
        <button className="primary-button" onClick={() => step === 0 ? update({ onboardingStep: 1 }) : update({ screen: 'placement', name: state.name.trim() })} disabled={!selected || (step === 0 && !connectorChosen) || (step === 1 && !state.name.trim())}>{step === 0 ? 'Continue' : 'Continue'} <ArrowRight01Icon size={19} /></button>
      </div>
    </section>
  </div>
}
