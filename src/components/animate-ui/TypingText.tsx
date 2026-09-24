// Adapted from Animate UI's Typing Text primitive for short, purposeful greetings.
// Source: https://animate-ui.com/r/primitives-texts-typing.json (MIT license)
import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

type Props = {
  texts: string[]
  className?: string
  typingDelay?: number
  holdDelay?: number
  startDelay?: number
  ariaLabel?: string
}

export function TypingText({ texts, className, typingDelay = 120, holdDelay = 1700, startDelay = 300, ariaLabel }: Props) {
  const reduceMotion = useReducedMotion()
  const [displayed, setDisplayed] = useState('')
  const textKey = JSON.stringify(texts)

  useEffect(() => {
    const words = JSON.parse(textKey) as string[]
    if (reduceMotion) { setDisplayed(words[words.length - 1] || ''); return }
    let timer: ReturnType<typeof setTimeout>
    let wordIndex = 0
    let character = 0
    let erasing = false

    const type = () => {
      const word = words[wordIndex]
      character += erasing ? -1 : 1
      setDisplayed(word.slice(0, character))
      if (!erasing && character === word.length) {
        if (wordIndex === words.length - 1) return
        erasing = true
        timer = setTimeout(type, holdDelay)
      } else if (erasing && character === 0) {
        erasing = false
        wordIndex += 1
        timer = setTimeout(type, 420)
      } else {
        timer = setTimeout(type, erasing ? 75 : typingDelay)
      }
    }

    setDisplayed('')
    timer = setTimeout(type, startDelay)
    return () => clearTimeout(timer)
  }, [textKey, typingDelay, holdDelay, startDelay, reduceMotion])

  return <span className={className} aria-label={ariaLabel || texts.join(', ')}><span aria-hidden="true">{displayed}</span>{!reduceMotion && <motion.span className="typing-cursor" aria-hidden="true" animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 1.1, times: [0, .48, .5, 1], repeat: Infinity }} />}</span>
}
