import { useState } from 'react'
import { phrases } from '../data/connector'
import type { PrototypeState } from '../types'

const storageKey = 'mao-prototype-v1'
const previousStorageKey = 'mandarin-conversation-prototype-v4'
const initialState: PrototypeState = {
  screen: 'intro', onboardingStep: 0, goal: '', situation: '', name: '',
  activity: 'learn', phraseIndex: 0, attemptCount: 0, usedSupport: false,
  phraseStates: Object.fromEntries(phrases.map(phrase => [phrase.id, 'learning'])), levelComplete: false,
  hasStarted: false,
  placementPassed: false,
}

export function usePrototypeState() {
  const [state, setState] = useState<PrototypeState>(() => {
    try {
      const saved = localStorage.getItem(storageKey) ?? localStorage.getItem(previousStorageKey)
      if (saved && !localStorage.getItem(storageKey)) localStorage.setItem(storageKey, saved)
      return saved ? { ...initialState, ...JSON.parse(saved) } : initialState
    } catch { return initialState }
  })

  function update(patch: Partial<PrototypeState>) {
    setState(previous => {
      const next = { ...previous, ...patch }
      localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  function setPhraseState(id: string, value: PrototypeState['phraseStates'][string]) {
    setState(previous => {
      const next = { ...previous, phraseStates: { ...previous.phraseStates, [id]: value } }
      localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  return { state, update, setPhraseState }
}
