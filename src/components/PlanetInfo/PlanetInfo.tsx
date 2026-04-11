import { motion, AnimatePresence } from 'framer-motion'
import type { IPlanet } from '@/types/planet'
import { PlanetHeader } from './PlanetHeader'
import { PlanetDescription } from './PlanetDescription'
import { PlanetStats } from './PlanetStats'

interface IPlanetInfoProps {
  planet: IPlanet
}

export function PlanetInfo({ planet }: IPlanetInfoProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={planet.id}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex flex-col"
      >
        <PlanetHeader planet={planet} />
        <PlanetDescription description={planet.description} />
        <PlanetStats apiId={planet.apiId} />
      </motion.div>
    </AnimatePresence>
  )
}
