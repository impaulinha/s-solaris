import { useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

interface IScrambleTextProps {
  text: string
  className?: string
  delay?: number
  chars?: string
}

// texto que "decodifica" caractere a caractere, como um painel de telemetria
export function ScrambleText({
  text,
  className,
  delay = 0,
  chars = 'upperCase',
}: IScrambleTextProps) {
  const textRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const element = textRef.current
      if (!element) return

      if (reducedMotion) {
        element.textContent = text
        return
      }

      gsap.to(element, {
        duration: 1.2,
        delay,
        ease: 'none',
        overwrite: true,
        scrambleText: { text, chars, speed: 0.6, revealDelay: 0.3 },
      })
    },
    { dependencies: [text, delay, chars, reducedMotion] }
  )

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={textRef} aria-hidden />
    </span>
  )
}
