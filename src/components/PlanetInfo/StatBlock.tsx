import { useEffect, useRef } from 'react'
import { animate, motion, type Variants } from 'framer-motion'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { formatNumber, type IStatValue } from '@/lib/formatPlanetData'

interface StatBlockProps {
  label: string
  stat: IStatValue
}

interface IAnimatedNumberProps {
  value: number
  decimals: number
  className?: string
}

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
}

export function StatBlock({ label, stat }: StatBlockProps) {
  return (
    <div className="relative flex flex-col gap-2 pt-4 short:gap-1 short:pt-3">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-star-100/10"
      />
      <motion.span
        aria-hidden
        variants={lineVariants}
        className="absolute top-0 left-0 h-px w-8 origin-left bg-planet"
      />

      <dt className="font-mono text-[10px] tracking-[0.25em] text-star-400 uppercase">
        {label}
      </dt>

      <dd className="flex flex-wrap items-baseline gap-x-1.5 text-star-100">
        {stat.value === null ? (
          <span className="text-2xl font-extralight lg:text-[1.75rem] lg:short:text-xl">
            —<span className="sr-only">Desconhecido</span>
          </span>
        ) : (
          <>
            <AnimatedNumber
              value={stat.value}
              decimals={stat.decimals}
              className="text-2xl font-extralight tracking-tight tabular-nums lg:text-[1.75rem] lg:short:text-xl"
            />
            {stat.unit && (
              <span className="font-mono text-[11px] text-star-300">
                {stat.unit}
              </span>
            )}
          </>
        )}
      </dd>
    </div>
  )
}

// contagem de 0 até o valor real, mantendo o formato pt-BR
function AnimatedNumber({ value, decimals, className }: IAnimatedNumberProps) {
  const numberRef = useRef<HTMLSpanElement>(null)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const element = numberRef.current
    if (!element) return

    if (reducedMotion) {
      element.textContent = formatNumber(value, decimals)
      return
    }

    const controls = animate(0, value, {
      duration: 1.6,
      delay: 0.45,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        element.textContent = formatNumber(latest, decimals)
      },
    })

    return () => controls.stop()
  }, [value, decimals, reducedMotion])

  return (
    <span ref={numberRef} className={className}>
      {formatNumber(0, decimals)}
    </span>
  )
}
