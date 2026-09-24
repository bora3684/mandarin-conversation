export type Chunk = { chinese: string; pinyin: string; meaning: string }
export type Phrase = {
  id: string
  chinese: string
  pinyin: string
  english: string
  note: string
  situation: string
  chunks: Chunk[]
}
export type PhraseState = 'learning' | 'practicing' | 'ready' | 'keep-practicing'
export type Screen = 'intro' | 'onboarding' | 'home' | 'level'
export type Activity = 'learn' | 'practice' | 'recall' | 'conversation' | 'complete'
export type PrototypeState = {
  screen: Screen
  onboardingStep: number
  goal: string
  situation: string
  name: string
  activity: Activity
  phraseIndex: number
  attemptCount: number
  usedSupport: boolean
  phraseStates: Record<string, PhraseState>
  levelComplete: boolean
  hasStarted: boolean
}
