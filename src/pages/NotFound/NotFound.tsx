import { motion, type Variants } from 'framer-motion'
import { PillLink } from '@/components/PillButton'
import { PlanetOrb } from '@/components/PlanetOrb'
import { StatusScreen } from '@/components/StatusScreen'
import { PLANETS } from '@/constants/planets'

// Netuno, o planeta mais distante do Sol, faz o papel do "0" perdido no espaço
const LOST_PLANET = PLANETS.find((planet) => planet.id === 'neptune')!

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

const heroVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const digitVariants: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 1.2, ease: EASE_OUT_EXPO } },
}

const orbVariants: Variants = {
  hidden: { scale: 0, rotate: -120 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: { duration: 1.6, ease: EASE_OUT_EXPO },
  },
}

export function NotFound() {
  return (
    <StatusScreen
      label="Erro 404 · Sinal perdido"
      title="Esta página saiu da órbita."
      description="O endereço que você procurou não existe ou foi parar em outra galáxia. Volte ao Sistema Solar e continue explorando os planetas."
      marquee="Perdido no espaço"
      accentColor={LOST_PLANET.color}
      hero={
        <motion.div
          variants={heroVariants}
          aria-hidden
          className="flex items-center font-serif text-[length:clamp(7rem,min(26vw,34vh),18rem)] leading-none font-light text-star-100"
        >
          <span className="-my-[0.1em] overflow-hidden py-[0.1em]">
            <motion.span variants={digitVariants} className="block">
              4
            </motion.span>
          </span>

          <motion.span variants={orbVariants} className="mx-[0.06em] block">
            <PlanetOrb planet={LOST_PLANET} className="block size-[0.74em]" />
          </motion.span>

          <span className="-my-[0.1em] overflow-hidden py-[0.1em]">
            <motion.span variants={digitVariants} className="block">
              4
            </motion.span>
          </span>
        </motion.div>
      }
      actions={
        <PillLink href="/" variant="solid" cursorLabel="Voltar">
          <svg
            aria-hidden
            viewBox="0 0 16 10"
            fill="none"
            className="w-4 rotate-180"
          >
            <path
              d="M0 5h15M11 1l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          Voltar ao Sistema Solar
        </PillLink>
      }
    />
  )
}
