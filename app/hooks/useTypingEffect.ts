
'use client'

import { useState, useEffect, useRef } from 'react'

interface UseTypingEffectProps {
  phrases: string[]
  typingDelay?: number
  deletingDelay?: number
  pauseBetweenPhrases?: number
}

export const useTypingEffect = ({
  phrases,
  typingDelay = 100,
  deletingDelay = 50,
  pauseBetweenPhrases = 1500,
}: UseTypingEffectProps) => {
  const [currentText, setCurrentText] = useState('')
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]

    const handleTyping = () => {
      if (isPaused) {
        timeoutRef.current = setTimeout(() => {
          setIsPaused(false)
          if (isDeleting) {
            setIsDeleting(true)
          } else {
            setIsDeleting(true)
          }
        }, pauseBetweenPhrases)
        return
      }

      if (!isDeleting) {
        // Typing
        if (currentText.length < currentPhrase.length) {
          setCurrentText(currentPhrase.slice(0, currentText.length + 1))
          timeoutRef.current = setTimeout(handleTyping, typingDelay)
        } else {
          // Finished typing, start pause
          setIsPaused(true)
          timeoutRef.current = setTimeout(handleTyping, pauseBetweenPhrases)
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1))
          timeoutRef.current = setTimeout(handleTyping, deletingDelay)
        } else {
          // Finished deleting, move to next phrase
          setIsDeleting(false)
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
          timeoutRef.current = setTimeout(handleTyping, typingDelay + 1500)
        }
      }
    }

    timeoutRef.current = setTimeout(handleTyping, typingDelay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [currentText, currentPhraseIndex, isDeleting, isPaused, phrases, typingDelay, deletingDelay, pauseBetweenPhrases])

  return currentText
}
