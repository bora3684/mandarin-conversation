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
  return <AppShell screen={state.screen} onHome={state.screen === 'intro' || state.screen === 'onboarding' ? undefined : () => update({ screen: 'home' })}>
    <AnimatePresence mode="wait" initial={false}>
      <Fade key={transitionKey}>
        {state.screen === 'intro' && <Intro onStart={() => update({ screen: 'onboarding' })} />}
        {state.screen === 'onboarding' && <Onboarding state={state} update={update} />}
        {state.screen === 'home' && <Home state={state} update={update} />}
        {state.screen === 'placement' && <Placement onBack={() => update({ screen: 'home' })} onPass={() => update({ screen: 'level', hasStarted: true, placementPassed: true, activity: 'practice', phraseIndex: 0, attemptCount: 0 })} onStart={() => update({ screen: 'level', hasStarted: true, placementPassed: false, activity: 'learn', phraseIndex: 0, attemptCount: 0 })} />}
        {state.screen === 'phrasebook' && <Phrasebook state={state} onBack={() => update({ screen: 'home' })} />}
        {state.screen === 'level' && <LevelOne state={state} update={update} setPhraseState={setPhraseState} />}
      </Fade>
    </AnimatePresence>
  </AppShell>
}
