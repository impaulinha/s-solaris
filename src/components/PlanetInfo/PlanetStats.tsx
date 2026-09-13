import { motion, type Variants } from 'framer-motion'
import { usePlanetData } from '@/hooks/usePlanetData'
import {
  formatGravity,
  formatMass,
  formatMoons,
  formatOrbit,
  formatRadius,
  formatTemp,
} from '@/lib/formatPlanetData'
import { StatBlock } from './StatBlock'

interface IPlanetStatsProps {
  apiId: string
}

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.35 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

const GRID_CLASSES =
  'mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 md:mt-10 lg:gap-x-10 lg:gap-y-7'

const SHIMMER_CLASSES =
  'animate-shimmer rounded-full bg-linear-to-r from-star-100/5 via-star-100/15 to-star-100/5 bg-size-[200%_100%]'

export function PlanetStats({ apiId }: IPlanetStatsProps) {
  const { isPending, isError, isFetching, data, refetch } = usePlanetData(apiId)

  if (isPending) {
    return (
      <motion.div
        variants={gridVariants}
        aria-busy="true"
        aria-label="Carregando dados do planeta"
        className={GRID_CLASSES}
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex flex-col gap-3 border-t border-star-100/10 pt-4"
          >
            <div className={`h-2 w-16 ${SHIMMER_CLASSES}`} />
            <div className={`h-6 w-24 ${SHIMMER_CLASSES}`} />
          </motion.div>
        ))}
      </motion.div>
    )
  }

  if (isError || !data) {
    return (
      <motion.div
        variants={itemVariants}
        className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-star-100/10 pt-5 font-mono text-xs text-star-300 md:mt-10"
      >
        <span>Não foi possível carregar os dados deste planeta.</span>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="group relative tracking-[0.2em] text-star-100 uppercase disabled:opacity-50"
        >
          {isFetching ? 'Tentando…' : 'Tentar novamente'}
          <span className="absolute inset-x-0 -bottom-1 h-px origin-right scale-x-0 bg-planet transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
        </button>
      </motion.div>
    )
  }

  const stats = [
    {
      label: 'Gravidade',
      stat: formatGravity(data.gravity),
    },
    {
      label: 'Massa',
      stat: formatMass(
        data.mass?.massValue ?? null,
        data.mass?.massExponent ?? null
      ),
    },
    {
      label: 'Raio',
      stat: formatRadius(data.meanRadius),
    },
    {
      label: 'Órbita',
      stat: formatOrbit(data.sideralOrbit),
    },
    {
      label: 'Temperatura',
      stat: formatTemp(data.avgTemp),
    },
    {
      label: 'Luas',
      stat: formatMoons(data.moons),
    },
  ]

  return (
    <motion.dl variants={gridVariants} className={GRID_CLASSES}>
      {stats.map(({ label, stat }) => (
        <motion.div key={label} variants={itemVariants}>
          <StatBlock label={label} stat={stat} />
        </motion.div>
      ))}
    </motion.dl>
  )
}
