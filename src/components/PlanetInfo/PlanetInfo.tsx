import { motion, AnimatePresence, type Variants } from 'framer-motion'
import type { IPlanet } from '@/types/planet'
import { PlanetHeader } from './PlanetHeader'
import { PlanetDescription } from './PlanetDescription'
import { PlanetStats } from './PlanetStats'

interface IPlanetInfoProps {
  planet: IPlanet
  isReady: boolean
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(8px)',
    transition: { duration: 0.4, ease: [0.7, 0, 0.84, 0] },
  },
}

export function PlanetInfo({ planet, isReady }: IPlanetInfoProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={planet.id}
        variants={containerVariants}
        initial="hidden"
        animate={isReady ? 'visible' : 'hidden'}
        exit="exit"
        // no mobile o painel rola: o fade na base indica que há mais conteúdo
        className="scrollbar-hide flex max-h-full w-full flex-col overflow-y-auto py-2 pb-10 max-md:[mask-image:linear-gradient(to_bottom,black_80%,transparent)] md:pb-2"
      >
        <PlanetHeader planet={planet} />
        <PlanetDescription description={planet.description} />
        <PlanetStats apiId={planet.apiId} />
      </motion.div>
    </AnimatePresence>
  )
}
