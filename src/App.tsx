import AppShell from './components/AppShell'
import Home from './components/Home'
import LevelOne from './components/LevelOne'
import Onboarding from './components/Onboarding'
import { usePrototypeState } from './state/usePrototypeState'
import { AnimatePresence } from 'motion/react'
import { Fade } from './components/animate-ui/Fade'
import Intro from './components/Intro'

export default function App() {
  const { state, update, setPhraseState } = usePrototypeState()
  const transitionKey = state.screen === 'onboarding' ? `${state.screen}-${state.onboardingStep}` : state.screen
  return <AppShell screen={state.screen} onHome={state.screen === 'intro' || state.screen === 'onboarding' ? undefined : () => update({ screen: 'home' })}>
    <AnimatePresence mode="wait" initial={false}>
      <Fade key={transitionKey}>
        {state.screen === 'intro' && <Intro onStart={() => update({ screen: 'onboarding' })} />}
        {state.screen === 'onboarding' && <Onboarding state={state} update={update} />}
        {state.screen === 'home' && <Home state={state} update={update} />}
        {state.screen === 'level' && <LevelOne state={state} update={update} setPhraseState={setPhraseState} />}
      </Fade>
    </AnimatePresence>
  </AppShell>
}
