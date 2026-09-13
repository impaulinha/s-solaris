import { useRef } from 'react'
import { ScrambleText } from '@/components/ScrambleText'
import { PLANET_HEIGHT_RATIO, PLANET_WIDTH_RATIO } from '@/constants/scene'
import { usePlanetData } from '@/hooks/usePlanetData'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import {
  formatDistance,
  formatRotation,
  formatStat,
  formatTilt,
  type IStatValue,
} from '@/lib/formatPlanetData'
import { gsap, useGSAP } from '@/lib/gsap'
import type { Direction, IPlanet } from '@/types/planet'

interface IPlanetHudProps {
  planet: IPlanet
  direction: Direction
  isReady: boolean
}

// mesmo raio usado pela cena 3D, em unidades de container query do palco
const PLANET_RADIUS = `min(${PLANET_WIDTH_RATIO * 100}cqw, ${PLANET_HEIGHT_RATIO * 100}cqh)`

// marcações a cada 3°, com destaque a cada 30°
const DEGREE_TICKS = Array.from({ length: 120 }, (_, index) => {
  const angle = (index * 3 * Math.PI) / 180
  const isMajor = index % 10 === 0
  const innerRadius = isMajor ? 95 : 98

  return (
    <line
      key={index}
      x1={Math.cos(angle) * innerRadius}
      y1={Math.sin(angle) * innerRadius}
      x2={Math.cos(angle) * 100}
      y2={Math.sin(angle) * 100}
      className={isMajor ? 'stroke-star-100/45' : 'stroke-star-100/15'}
      vectorEffect="non-scaling-stroke"
    />
  )
})

const DEGREE_LABELS = [
  {
    label: '000',
    className: 'top-0 left-1/2 -translate-x-1/2 -translate-y-[180%]',
  },
  {
    label: '090',
    className: 'top-1/2 right-0 translate-x-[140%] -translate-y-1/2',
  },
  {
    label: '180',
    className: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-[180%]',
  },
  {
    label: '270',
    className: 'top-1/2 left-0 -translate-x-[140%] -translate-y-1/2',
  },
]

function toReadout(stat: IStatValue | null) {
  return stat && stat.value !== null ? formatStat(stat) : '—'
}

export function PlanetHud({ planet, direction, isReady }: IPlanetHudProps) {
  const reducedMotion = usePrefersReducedMotion()
  const { data } = usePlanetData(planet.apiId)

  const rootRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<HTMLDivElement>(null)
  const ticksRef = useRef<SVGGElement>(null)
  const arcRef = useRef<SVGGElement>(null)
  const previousPlanetRef = useRef(planet.id)

  // giro contínuo e lento das marcações
  useGSAP(
    () => {
      if (reducedMotion) return

      gsap.to(ticksRef.current, {
        rotation: 360,
        svgOrigin: '0 0',
        duration: 240,
        ease: 'none',
        repeat: -1,
      })
    },
    { dependencies: [reducedMotion], scope: rootRef }
  )

  // abertura: o mostrador se expande girando quando o preloader termina
  useGSAP(
    () => {
      if (!isReady) {
        gsap.set(introRef.current, { autoAlpha: 0, scale: 0.85, rotation: -60 })
        return
      }

      gsap.to(introRef.current, {
        autoAlpha: 1,
        scale: 1,
        rotation: 0,
        duration: 2.4,
        delay: 0.4,
        ease: 'expo.out',
      })
    },
    { dependencies: [isReady], scope: rootRef }
  )

  // arco destacado aponta para a posição do planeta na ordem a partir do Sol
  useGSAP(
    () => {
      gsap.to(arcRef.current, {
        rotation: `${(planet.index - 1) * 45 - 90}_short`,
        svgOrigin: '0 0',
        duration: reducedMotion ? 0 : 1.6,
        ease: 'expo.out',
      })

      if (previousPlanetRef.current === planet.id) return
      previousPlanetRef.current = planet.id

      if (reducedMotion) return

      // o mostrador gira no sentido da navegação, junto com a troca do planeta
      gsap.fromTo(
        dialRef.current,
        { rotation: direction * -50 },
        { rotation: 0, duration: 1.8, ease: 'expo.out', overwrite: 'auto' }
      )
    },
    { dependencies: [planet.id, direction, reducedMotion], scope: rootRef }
  )

  const readouts = [
    {
      label: 'Dist. do Sol',
      value: toReadout(data ? formatDistance(data.semimajorAxis) : null),
    },
    {
      label: 'Rotação',
      value: toReadout(data ? formatRotation(data.sideralRotation) : null),
    },
    {
      label: 'Inclinação',
      value: toReadout(formatTilt(planet.axialTilt)),
    },
  ]

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={introRef}
          className="relative aspect-square shrink-0"
          style={{ width: `calc(${PLANET_RADIUS} * 2.7)` }}
        >
          <div ref={dialRef} className="absolute inset-0">
            <svg
              viewBox="-100 -100 200 200"
              aria-hidden
              className="absolute inset-0 size-full overflow-visible"
            >
              <circle
                r="100"
                fill="none"
                className="stroke-star-100/10"
                vectorEffect="non-scaling-stroke"
              />
              <g ref={ticksRef}>{DEGREE_TICKS}</g>

              <g ref={arcRef}>
                <circle
                  r="100"
                  fill="none"
                  pathLength={360}
                  strokeDasharray="28 332"
                  strokeWidth={2}
                  className="stroke-planet"
                  vectorEffect="non-scaling-stroke"
                />
              </g>

              {/* órbita tracejada rente ao halo do planeta */}
              <circle
                r="84"
                fill="none"
                strokeDasharray="1 5"
                className="stroke-star-100/25"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <div className="hidden font-mono text-[9px] tracking-[0.2em] text-star-400 md:block">
            {DEGREE_LABELS.map(({ label, className }) => (
              <span key={label} className={`absolute ${className}`}>
                {label}
              </span>
            ))}
          </div>

          {/* cantoneiras enquadrando o mostrador */}
          <span className="absolute top-0 left-0 size-4 border-t border-l border-star-100/30" />
          <span className="absolute top-0 right-0 size-4 border-t border-r border-star-100/30" />
          <span className="absolute bottom-0 left-0 size-4 border-b border-l border-star-100/30" />
          <span className="absolute right-0 bottom-0 size-4 border-r border-b border-star-100/30" />
        </div>
      </div>

      <dl
        data-intro
        className="absolute bottom-8 left-8 hidden w-60 flex-col gap-2.5 rounded-sm border border-star-100/10 bg-space-950/40 p-4 font-mono text-[10px] tracking-[0.2em] uppercase backdrop-blur-md md:flex lg:top-24 lg:right-8 lg:bottom-auto lg:left-auto short:gap-2 short:p-3 lg:short:top-20"
      >
        <div className="mb-1 flex items-center gap-2 text-star-400">
          <span className="size-1.5 bg-planet" />
          Telemetria
        </div>

        {readouts.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4 border-b border-star-100/10 pb-2"
          >
            <dt className="text-star-400">{label}</dt>
            <dd className="text-star-100">
              <ScrambleText text={value} chars="0123456789" />
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
