import { PLANETS } from '@/constants/planets'
import type { IPlanet } from '@/types/planet'
import { motion } from 'framer-motion'

interface IPlanetHeaderProps {
  planet: IPlanet
}

const indexVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
}

const nameVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function PlanetHeader({ planet }: IPlanetHeaderProps) {
  const currentIndex = String(planet.index).padStart(2, '0')
  const totalIndex = String(PLANETS.length).padStart(2, '0')

  return (
    <div className="flex flex-col gap-4">
      <motion.div className="flex items-center gap-3" variants={indexVariants}>
        <span className="font-mono text-xs text-nebula-500">
          {currentIndex}
        </span>
        <div className="h-px w-8 bg-star-400/40" />
        <span className="font-mono text-xs text-star-400">{totalIndex}</span>
      </motion.div>

      <div className="overflow-hidden">
        <motion.h1
          className="font-serif text-6xl font-light leading-none text-star-100 md:text-7xl lg:text-8xl"
          variants={nameVariants}
        >
          {planet.name}
        </motion.h1>
      </div>
    </div>
  )
}
