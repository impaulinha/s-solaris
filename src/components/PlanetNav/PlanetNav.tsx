import { AnimatePresence, motion } from 'framer-motion'
import { PLANETS } from '@/constants/planets'
import { useMagnetic } from '@/hooks/useMagnetic'
import { cn, padIndex } from '@/lib/utils'
import type { Direction } from '@/types/planet'

interface IPlanetNavProps {
  activeIndex: number
  onNext: () => void
  onPrev: () => void
  onSelect: (index: number) => void
}

interface INavButtonProps {
  direction: Direction
  label: string
  onClick: () => void
}

export function PlanetNav({
  activeIndex,
  onNext,
  onPrev,
  onSelect,
}: IPlanetNavProps) {
  const total = PLANETS.length
  const prevPlanet = PLANETS[(activeIndex - 1 + total) % total]
  const nextPlanet = PLANETS[(activeIndex + 1) % total]

  return (
    <footer
      data-intro
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden items-center justify-between gap-8 pr-10 pb-8 pl-[calc(var(--rail-width)+1rem)] lg:flex short:pb-5"
    >
      <NavButton direction={-1} label={prevPlanet.name} onClick={onPrev} />

      <div className="pointer-events-auto flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-star-400">
        <span className="text-star-100 tabular-nums">
          {padIndex(activeIndex + 1)}
        </span>

        <div className="flex items-center">
          {PLANETS.map((planet, index) => {
            const isActive = index === activeIndex

            return (
              <button
                key={planet.id}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`Ir para ${planet.name}`}
                aria-current={isActive || undefined}
                className="group flex h-8 items-center px-1"
              >
                <span
                  className={cn(
                    'block h-px transition-all duration-700 ease-out',
                    isActive
                      ? 'w-10 bg-planet'
                      : 'w-5 bg-star-100/20 group-hover:w-7 group-hover:bg-star-100/60'
                  )}
                />
              </button>
            )
          })}
        </div>

        <span className="tabular-nums">{padIndex(total)}</span>
      </div>

      <NavButton direction={1} label={nextPlanet.name} onClick={onNext} />
    </footer>
  )
}

function NavButton({ direction, label, onClick }: INavButtonProps) {
  const buttonRef = useMagnetic<HTMLButtonElement>(0.25)
  const isNext = direction === 1

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      aria-label={`${isNext ? 'Próximo' : 'Anterior'}: ${label}`}
      className={cn(
        'group pointer-events-auto relative flex items-center gap-3 overflow-hidden rounded-full border border-star-100/15 px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-star-200 uppercase transition-colors duration-500 hover:border-planet hover:text-space-950',
        isNext && 'flex-row-reverse'
      )}
    >
      {/* preenchimento que sobe no hover */}
      <span className="absolute inset-0 translate-y-full rounded-full bg-planet transition-transform duration-500 ease-out group-hover:translate-y-0" />

      <svg
        aria-hidden
        viewBox="0 0 16 10"
        fill="none"
        className={cn(
          'relative w-4 transition-transform duration-500',
          isNext
            ? 'group-hover:translate-x-1'
            : 'rotate-180 group-hover:-translate-x-1'
        )}
      >
        <path
          d="M0 5h15M11 1l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>

      <span className="relative block h-[1.3em] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={label}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-110%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="block"
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </span>
    </button>
  )
}
