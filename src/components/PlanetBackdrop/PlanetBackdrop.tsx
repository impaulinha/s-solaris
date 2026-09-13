import { AnimatePresence, motion, type Variants } from 'framer-motion'
import { Marquee } from '@/components/Marquee'
import type { Direction, IPlanet } from '@/types/planet'

interface IPlanetBackdropProps {
  planet: IPlanet
  direction: Direction
}

// o nome novo entra pelo lado da navegação e o antigo sai pelo oposto
const trackVariants: Variants = {
  enter: (direction: Direction) => ({ y: `${direction * 70}%`, opacity: 0 }),
  center: { y: '0%', opacity: 1 },
  exit: (direction: Direction) => ({ y: `${-direction * 70}%`, opacity: 0 }),
}

export function PlanetBackdrop({ planet, direction }: IPlanetBackdropProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* via láctea ao fundo, se deslocando lentamente */}
      <div className="absolute inset-0 animate-drift bg-[url(/textures/stars.jpg)] bg-cover bg-center opacity-60" />

      {/* brilho na cor do planeta, centralizado no palco */}
      <div className="absolute top-[29%] left-1/2 size-[120vmin] -translate-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--planet)_24%,transparent)_0%,transparent_62%)] md:top-1/2 md:left-[26%] lg:left-[77%]" />

      {/* nome gigante vazado, em loop horizontal atrás do planeta */}
      <div className="absolute inset-x-0 top-[29%] md:top-1/2">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={planet.id}
            custom={direction}
            variants={trackVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-0 -translate-y-1/2"
          >
            <Marquee text={planet.name} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
