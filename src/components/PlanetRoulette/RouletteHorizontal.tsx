import { useRef } from 'react'
import { PLANETS } from '@/constants/planets'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { getCircularOffset, wrapOffset } from '@/lib/utils'
import { RouletteItem } from './RouletteItem'

interface IRouletteHorizontalProps {
  activeIndex: number
  onSelect: (index: number) => void
}

// ângulo (rad) entre planetas vizinhos na roleta
const ITEM_ANGLE = 0.3
// raio da roleta proporcional à largura disponível
const RADIUS_RATIO = 0.9
// centro vertical do planeta ativo, a partir do topo
const ANCHOR_Y = 44
const VISIBLE_RANGE = 2.6

const TICK_STEP = ITEM_ANGLE / 4
const TICKS = Array.from(
  { length: Math.round((Math.PI * 2) / TICK_STEP) },
  (_, index) => {
    const angle = index * TICK_STEP
    const isMajor = index % 4 === 0
    const innerRadius = isMajor ? 96 : 98.5

    return (
      <line
        key={index}
        x1={Math.cos(angle) * innerRadius}
        y1={Math.sin(angle) * innerRadius}
        x2={Math.cos(angle) * 100}
        y2={Math.sin(angle) * 100}
        className={isMajor ? 'stroke-star-100/40' : 'stroke-star-100/15'}
        vectorEffect="non-scaling-stroke"
      />
    )
  }
)

export function RouletteHorizontal({
  activeIndex,
  onSelect,
}: IRouletteHorizontalProps) {
  const reducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<SVGSVGElement>(null)
  const ticksRef = useRef<SVGGElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rotationRef = useRef({ value: activeIndex })
  const targetRef = useRef(activeIndex)
  const lastIndexRef = useRef(activeIndex)

  // posiciona cada planeta sobre um arco que se curva para baixo
  const layoutItems = () => {
    const container = containerRef.current
    if (!container) return

    const radius = container.clientWidth * RADIUS_RATIO
    const rotation = rotationRef.current.value

    itemRefs.current.forEach((item, index) => {
      if (!item) return

      const distance = wrapOffset(index - rotation, PLANETS.length)
      const angle = distance * ITEM_ANGLE
      const proximity = Math.max(1 - Math.abs(distance) / VISIBLE_RANGE, 0)

      gsap.set(item, {
        x: Math.sin(angle) * radius,
        y: (1 - Math.cos(angle)) * radius,
        scale: 0.55 + proximity * 0.45,
        autoAlpha: Math.pow(proximity, 1.2),
        zIndex: Math.round(proximity * 10),
      })
    })

    gsap.set(dialRef.current, {
      width: radius * 2,
      height: radius * 2,
      left: container.clientWidth / 2 - radius,
      top: ANCHOR_Y,
    })
    gsap.set(ticksRef.current, {
      rotation: (-rotation * ITEM_ANGLE * 180) / Math.PI,
      svgOrigin: '0 0',
    })
  }

  useGSAP(
    () => {
      layoutItems()

      const observer = new ResizeObserver(() => layoutItems())
      if (containerRef.current) observer.observe(containerRef.current)

      return () => observer.disconnect()
    },
    { scope: containerRef }
  )

  useGSAP(
    () => {
      const offset = getCircularOffset(
        lastIndexRef.current,
        activeIndex,
        PLANETS.length
      )
      lastIndexRef.current = activeIndex
      targetRef.current += offset

      gsap.to(rotationRef.current, {
        value: targetRef.current,
        duration: reducedMotion ? 0.3 : 1.1,
        ease: 'expo.out',
        overwrite: true,
        onUpdate: layoutItems,
      })
    },
    { dependencies: [activeIndex, reducedMotion], scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className="relative h-28 w-full overflow-hidden md:h-32"
    >
      <svg
        ref={dialRef}
        viewBox="-100 -100 200 200"
        aria-hidden
        className="pointer-events-none absolute overflow-visible"
      >
        <g transform="rotate(-90)">
          <circle
            r="100"
            fill="none"
            className="stroke-star-100/10"
            vectorEffect="non-scaling-stroke"
          />
          <g ref={ticksRef}>{TICKS}</g>
        </g>
      </svg>

      <nav aria-label="Planetas">
        <ul>
          {PLANETS.map((planet, index) => (
            <li key={planet.id}>
              <RouletteItem
                ref={(element) => {
                  itemRefs.current[index] = element
                }}
                planet={planet}
                isActive={index === activeIndex}
                onClick={() => onSelect(index)}
                // top-[44px] = ANCHOR_Y; margens centralizam a miniatura
                // (translate do CSS seria sobrescrito pelo x/y do GSAP)
                className="top-[44px] left-1/2 -mt-7 -ml-7"
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
