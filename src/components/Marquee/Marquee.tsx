import { useRef } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'

interface IMarqueeProps {
  text: string
  className?: string
}

// texto gigante vazado em loop horizontal infinito
export function Marquee({ text, className }: IMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      if (reducedMotion) return

      const loop = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 45,
        ease: 'none',
        repeat: -1,
      })

      // arranca acelerado e desacelera, como se tivesse sido empurrado
      gsap.fromTo(
        loop,
        { timeScale: 10 },
        { timeScale: 1, duration: 2.4, ease: 'power3.out' }
      )
    },
    { dependencies: [reducedMotion], scope: trackRef }
  )

  return (
    <div ref={trackRef} className="flex w-max will-change-transform">
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center">
          {[0, 1].map((word) => (
            <span
              key={word}
              className={cn(
                'flex items-center font-serif text-[clamp(8rem,26vw,30rem)] leading-none font-light whitespace-nowrap uppercase text-outline [--stroke-color:color-mix(in_oklab,var(--planet)_30%,transparent)]',
                className
              )}
            >
              {text}
              <span className="mx-[0.3em] text-[0.18em] text-planet/20 [-webkit-text-stroke:0]">
                ✦
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}
