import { useRef } from 'react'
import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import type { Direction, IPlanet } from '@/types/planet'

interface IPlanetBackdropProps {
  planet: IPlanet
  direction: Direction
}

interface IMarqueeTrackProps {
  text: string
}

// o nome novo entra pelo lado da navegação e o antigo sai pelo oposto
const trackVariants: Variants = {
  enter: (direction: Direction) => ({ y: `${direction * 70}%`, opacity: 0 }),
  center: { y: '0%', opacity: 1 },
  exit: (direction: Direction) => ({ y: `${-direction * 70}%`, opacity: 0 }),
}

export function PlanetBackdrop({ planet, direction }: IPlanetBackdropProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* via láctea ao fundo, se deslocando lentamente */}
      <div className="absolute inset-0 animate-drift bg-[url(/textures/stars.jpg)] bg-cover bg-center opacity-60" />

      {/* brilho na cor do planeta, centralizado no palco */}
      <div className="absolute top-[29%] left-1/2 size-[120vmin] -translate-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--planet)_24%,transparent)_0%,transparent_62%)] md:top-1/2 md:left-[26%] lg:left-[77%]" />

      {/* nome gigante vazado, em loop horizontal atrás do planeta */}
      <div className="absolute inset-x-0 top-[29%] md:top-1/2">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={planet.id}
            custom={direction}
            variants={trackVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 -translate-y-1/2"
          >
            <MarqueeTrack text={planet.name} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function MarqueeTrack({ text }: IMarqueeTrackProps) {
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

      // arranca acelerado e desacelera, como se fosse empurrado pela troca
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
              className="flex items-center font-serif text-[clamp(8rem,26vw,30rem)] leading-none font-light whitespace-nowrap uppercase text-outline [--stroke-color:color-mix(in_oklab,var(--planet)_30%,transparent)]"
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
