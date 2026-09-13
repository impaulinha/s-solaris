import { motion, type Variants } from 'framer-motion'
import { ScrambleText } from '@/components/ScrambleText'
import { PLANETS } from '@/constants/planets'
import { padIndex } from '@/lib/utils'
import type { IPlanet } from '@/types/planet'

interface IPlanetHeaderProps {
  planet: IPlanet
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

const metaVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
}

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, delay: 0.15, ease: EASE_OUT_EXPO },
  },
}

const nameVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
}

// cada letra sobe de dentro de uma máscara, levemente inclinada
const charVariants: Variants = {
  hidden: { y: '110%', rotate: 10 },
  visible: {
    y: '0%',
    rotate: 0,
    transition: { duration: 1, ease: EASE_OUT_EXPO },
  },
}

export function PlanetHeader({ planet }: IPlanetHeaderProps) {
  return (
    <div className="flex flex-col gap-5 md:gap-7">
      <motion.div
        variants={metaVariants}
        className="flex flex-wrap items-center gap-x-4 gap-y-3 font-mono text-[11px] tracking-[0.2em] uppercase"
      >
        <span className="flex items-center gap-3">
          <span className="text-planet">{padIndex(planet.index)}</span>
          <motion.span
            variants={lineVariants}
            className="h-px w-10 origin-left bg-star-100/25"
          />
          <span className="text-star-400">{padIndex(PLANETS.length)}</span>
        </span>

        <span className="flex items-center gap-2.5 rounded-full border border-planet/30 bg-planet/5 px-3 py-1.5 text-star-200">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-planet" />
            <span className="relative size-1.5 rounded-full bg-planet" />
          </span>
          <ScrambleText text={planet.category} delay={0.35} />
        </span>
      </motion.div>

      <h1 className="font-serif text-[clamp(3.5rem,21cqi,10rem)] leading-[0.9] font-light tracking-[-0.02em] text-star-100">
        <span className="sr-only">{planet.name}</span>
        <motion.span
          aria-hidden
          variants={nameVariants}
          className="-my-[0.14em] flex overflow-hidden py-[0.14em]"
        >
          {Array.from(planet.name).map((char, index) => (
            <motion.span
              key={`${char}-${index}`}
              variants={charVariants}
              className="inline-block origin-bottom-left"
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </h1>
    </div>
  )
}
