import { useRef } from 'react'
import { PLANETS } from '@/constants/planets'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'
import { getCircularOffset, wrapOffset } from '@/lib/utils'
import { RouletteItem } from './RouletteItem'

interface IRouletteVerticalProps {
  activeIndex: number
  onSelect: (index: number) => void
}

// ângulo (rad) entre planetas vizinhos na roleta
const ITEM_ANGLE = 0.25
// raio da roleta proporcional à altura disponível
const RADIUS_RATIO = 0.6
// centro do planeta ativo, a partir da borda esquerda
const ANCHOR_X = 76
// distância (em itens) a partir da qual o planeta desaparece
const VISIBLE_RANGE = 3.4

const TICK_STEP = ITEM_ANGLE / 4
const TICKS = Array.from(
  { length: Math.round((Math.PI * 2) / TICK_STEP) },
  (_, index) => {
    const angle = index * TICK_STEP
    const isMajor = index % 4 === 0
    const innerRadius = isMajor ? 97.5 : 99

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

// trecho destacado da roleta, na altura do planeta ativo
const ACTIVE_ARC = `M ${Math.cos(-0.09) * 100} ${Math.sin(-0.09) * 100} A 100 100 0 0 1 ${Math.cos(0.09) * 100} ${Math.sin(0.09) * 100}`

export function RouletteVertical({
  activeIndex,
  onSelect,
}: IRouletteVerticalProps) {
  const reducedMotion = usePrefersReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const dialRef = useRef<SVGSVGElement>(null)
  const ticksRef = useRef<SVGGElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  // posição contínua da roleta: segue girando no mesmo sentido ao dar a volta
  const rotationRef = useRef({ value: activeIndex })
  const targetRef = useRef(activeIndex)
  const lastIndexRef = useRef(activeIndex)

  // posiciona cada planeta sobre o arco da roleta
  const layoutItems = () => {
    const container = containerRef.current
    if (!container) return

    const radius = container.clientHeight * RADIUS_RATIO
    const rotation = rotationRef.current.value

    itemRefs.current.forEach((item, index) => {
      if (!item) return

      const distance = wrapOffset(index - rotation, PLANETS.length)
      const angle = distance * ITEM_ANGLE
      const proximity = Math.max(1 - Math.abs(distance) / VISIBLE_RANGE, 0)

      gsap.set(item, {
        x: (Math.cos(angle) - 1) * radius,
        y: Math.sin(angle) * radius,
        scale: 0.6 + proximity * 0.4,
        autoAlpha: Math.pow(proximity, 1.4),
        zIndex: Math.round(proximity * 10),
      })
    })

    gsap.set(dialRef.current, {
      width: radius * 2,
      height: radius * 2,
      left: ANCHOR_X - radius * 2,
      top: container.clientHeight / 2 - radius,
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
        duration: reducedMotion ? 0.3 : 1.2,
        ease: 'expo.out',
        overwrite: true,
        onUpdate: layoutItems,
      })
    },
    { dependencies: [activeIndex, reducedMotion], scope: containerRef }
  )

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <svg
        ref={dialRef}
        viewBox="-100 -100 200 200"
        aria-hidden
        className="pointer-events-none absolute overflow-visible"
      >
        <circle
          r="100"
          fill="none"
          className="stroke-star-100/10"
          vectorEffect="non-scaling-stroke"
        />
        <g ref={ticksRef}>{TICKS}</g>
        <path
          d={ACTIVE_ARC}
          fill="none"
          strokeWidth={2}
          className="stroke-planet"
          vectorEffect="non-scaling-stroke"
        />
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
                showLabel
                // left-[76px] = ANCHOR_X; margens centralizam a miniatura
                // (translate do CSS seria sobrescrito pelo x/y do GSAP)
                className="top-1/2 left-[76px] -mt-7 -ml-7"
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-9 left-10 flex items-center gap-4 font-mono text-[10px] tracking-[0.25em] text-star-400 uppercase short:bottom-6">
        <span className="relative h-10 w-px overflow-hidden bg-star-100/10">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-line bg-planet" />
        </span>
        Role para explorar
      </div>
    </div>
  )
}
