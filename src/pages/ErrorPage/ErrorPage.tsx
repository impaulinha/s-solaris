import { motion, type Variants } from 'framer-motion'
import { PillButton } from '@/components/PillButton'
import { PlanetOrb } from '@/components/PlanetOrb'
import { StatusScreen } from '@/components/StatusScreen'
import { PLANETS } from '@/constants/planets'

interface IErrorPageProps {
  error: Error
  onRetry: () => void
}

// Marte, o planeta vermelho, sinaliza a falha na missão
const BROKEN_PLANET = PLANETS.find((planet) => planet.id === 'mars')!

const orbVariants: Variants = {
  hidden: { scale: 0.4, opacity: 0, rotate: -90 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
  },
}

export function ErrorPage({ error, onRetry }: IErrorPageProps) {
  return (
    <StatusScreen
      label="Erro · Falha na missão"
      title="Houston, temos um problema."
      description="Algo inesperado aconteceu durante a exploração. Tente novamente ou recarregue a página. Se o problema continuar, o seu navegador pode não ter suporte a WebGL."
      marquee="Sinal interrompido"
      accentColor={BROKEN_PLANET.color}
      details={import.meta.env.DEV ? error.message : undefined}
      hero={
        <motion.div variants={orbVariants} aria-hidden>
          <PlanetOrb
            planet={BROKEN_PLANET}
            className="size-[clamp(8rem,min(22vw,28vh),14rem)]"
          >
            {/* sombra atravessando o planeta: o sinal vai e volta */}
            <span className="absolute inset-0 animate-eclipse rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(3,4,10,0.95)_55%,transparent_72%)]" />
          </PlanetOrb>
        </motion.div>
      }
      actions={
        <>
          <PillButton onClick={onRetry} variant="solid">
            Tentar novamente
          </PillButton>
          <PillButton onClick={() => window.location.reload()}>
            Recarregar página
          </PillButton>
        </>
      }
    />
  )
}
