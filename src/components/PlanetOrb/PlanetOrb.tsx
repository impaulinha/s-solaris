import { useRef, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { cn } from '@/lib/utils'
import type { IPlanet } from '@/types/planet'

interface IPlanetOrbProps {
  planet: IPlanet
  className?: string
  // camadas extras desenhadas sobre o planeta (ex.: eclipse)
  children?: ReactNode
}

// inclinação da órbita da lua, igual à rotação do anel desenhado em CSS
const ORBIT_TILT = (-16 * Math.PI) / 180
// semieixos da órbita e tamanho da lua, em frações do tamanho do planeta
const ORBIT_RADIUS_X = 0.85
const ORBIT_RADIUS_Y = 0.19
const MOON_SIZE = 0.08

const ORBIT_RING_CLASSES =
  'absolute top-1/2 left-1/2 h-[38%] w-[170%] -translate-1/2 -rotate-[16deg] rounded-[50%] border border-star-100/25'

// planeta em CSS (sem WebGL): textura girando, brilho, anel e uma lua orbitando
export function PlanetOrb({ planet, className, children }: IPlanetOrbProps) {
  return (
    <span className={cn('relative inline-block aspect-square', className)}>
      <span className="absolute inset-0 animate-float">
        {/* brilho na cor do planeta */}
        <span className="absolute -inset-[30%] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--planet)_30%,transparent)_0%,transparent_65%)]" />

        {/* metade de trás da órbita */}
        <span className={ORBIT_RING_CLASSES} />

        <span
          className="absolute inset-0 z-[1] animate-planet-spin overflow-hidden rounded-full bg-size-[200%_100%] bg-repeat-x shadow-[inset_-0.14em_-0.08em_0.22em_rgba(0,0,0,0.92),inset_0.03em_0.02em_0.08em_rgba(255,255,255,0.2)]"
          style={{ backgroundImage: `url(${planet.texture})` }}
        >
          {children}
        </span>

        {/* metade da frente da órbita, passando na frente do planeta */}
        <span
          className={cn(
            ORBIT_RING_CLASSES,
            'z-[2] [clip-path:inset(50%_0_0_0)]'
          )}
        />

        <OrbitingMoon />
      </span>
    </span>
  )
}

function OrbitingMoon() {
  const moonRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useGSAP(
    () => {
      const moon = moonRef.current
      if (!moon) return

      const orbit = { angle: 0.9 }

      const render = () => {
        const x = Math.cos(orbit.angle) * ORBIT_RADIUS_X
        const y = Math.sin(orbit.angle) * ORBIT_RADIUS_Y
        const isInFront = Math.sin(orbit.angle) > 0

        // posição em múltiplos do tamanho da própria lua (xPercent/yPercent)
        gsap.set(moon, {
          xPercent:
            ((x * Math.cos(ORBIT_TILT) - y * Math.sin(ORBIT_TILT)) /
              MOON_SIZE) *
            100,
          yPercent:
            ((x * Math.sin(ORBIT_TILT) + y * Math.cos(ORBIT_TILT)) /
              MOON_SIZE) *
            100,
          scale: isInFront ? 1 : 0.75,
          zIndex: isInFront ? 3 : 0,
        })
      }

      render()
      if (reducedMotion) return

      gsap.to(orbit, {
        angle: `+=${Math.PI * 2}`,
        duration: 8,
        ease: 'none',
        repeat: -1,
        onUpdate: render,
      })
    },
    { dependencies: [reducedMotion] }
  )

  return (
    <span
      ref={moonRef}
      // margens centralizam a lua: o transform é controlado pelo GSAP
      className="absolute top-1/2 left-1/2 -mt-[4%] -ml-[4%] size-[8%] rounded-full bg-star-200 shadow-[inset_-0.02em_-0.02em_0.04em_rgba(0,0,0,0.6)]"
    />
  )
}
