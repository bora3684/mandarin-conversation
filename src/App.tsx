import AppShell from './components/AppShell'
import Home from './components/Home'
import LevelOne from './components/LevelOne'
import Onboarding from './components/Onboarding'
import { usePrototypeState } from './state/usePrototypeState'
import { AnimatePresence } from 'motion/react'
import { Fade } from './components/animate-ui/Fade'
import Intro from './components/Intro'
import Placement from './components/Placement'
import Phrasebook from './components/Phrasebook'

export default function App() {
  const { state, update, setPhraseState } = usePrototypeState()
  const transitionKey = state.screen === 'onboarding' ? `${state.screen}-${state.onboardingStep}` : state.screen
  return <AppShell screen={state.screen} onHome={state.screen === 'intro' || state.screen === 'placement' || state.screen === 'onboarding' ? undefined : () => update({ screen: 'home' })}>
    <AnimatePresence mode="wait" initial={false}>
      <Fade key={transitionKey} slide={state.screen !== 'level'}>
        {state.screen === 'intro' && <Intro onStart={() => update({ screen: 'onboarding', onboardingStep: 0 })} />}
        {state.screen === 'onboarding' && <Onboarding state={state} update={update} />}
        {state.screen === 'home' && <Home state={state} update={update} />}
        {state.screen === 'placement' && <Placement onBack={() => update({ screen: 'onboarding', onboardingStep: 1 })} onComplete={passed => update({ screen: 'home', placementPassed: passed })} onSkip={() => update({ screen: 'home', placementPassed: false })} />}
        {state.screen === 'phrasebook' && <Phrasebook state={state} onBack={() => update({ screen: 'home' })} />}
        {state.screen === 'level' && <LevelOne state={state} update={update} setPhraseState={setPhraseState} />}
      </Fade>
    </AnimatePresence>
  </AppShell>
}
