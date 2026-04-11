import { motion, AnimatePresence } from 'framer-motion'
import type { IPlanet } from '@/types/planet'
import { PlanetHeader } from './PlanetHeader'
import { PlanetDescription } from './PlanetDescription'
import { PlanetStats } from './PlanetStats'

interface IPlanetInfoProps {
  planet: IPlanet
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
}

export function PlanetInfo({ planet }: IPlanetInfoProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={planet.id}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex h-full flex-col overflow-y-auto scrollbar-hide"
        style={{
          scrollbarWidth: 'none', // Para Firefox
          msOverflowStyle: 'none', // Para IE/Edge
        }}
      >
        <PlanetHeader planet={planet} />
        <PlanetDescription description={planet.description} />
        <PlanetStats apiId={planet.apiId} />
      </motion.div>
    </AnimatePresence>
  )
}
