import { usePlanetData } from '@/hooks/usePlanetData'
import {
  formatGravity,
  formatMass,
  formatMoons,
  formatOrbit,
  formatRadius,
  formatTemp,
} from '@/lib/formatPlanetData'
import { motion } from 'framer-motion'
import { StatBlock } from './StatBloc'

interface IPlanetStatsProps {
  apiId: string
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function PlanetStats({ apiId }: IPlanetStatsProps) {
  const { isPending, isError, data } = usePlanetData(apiId)

  if (isPending) {
    return (
      <div className="grid grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 border-t border-surface-700 pt-4"
          >
            <div className="h-2 w-16 rounded bg-surface-700 animate-pulse" />
            <div className="h-3 w-24 rounded bg-surface-700 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !data) {
    return (
      <p className="mt-8 font-mono text-xs text-star-400">
        Falha ao carregar dados do planeta.
      </p>
    )
  }

  const stats = [
    {
      label: 'Gravidade',
      value: formatGravity(data.gravity),
    },
    {
      label: 'Massa',
      value: formatMass(
        data.mass?.massValue ?? null,
        data.mass?.massExponent ?? null
      ),
    },
    {
      label: 'Raio',
      value: formatRadius(data.meanRadius),
    },
    {
      label: 'Órbita',
      value: formatOrbit(data.sideralOrbit),
    },
    {
      label: 'Luas',
      value: formatMoons(data.moons),
    },
    {
      label: 'Avg Temp',
      value: formatTemp(data.avgTemp),
    },
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={itemVariants}>
          <StatBlock label={stat.label} value={stat.value} />
        </motion.div>
      ))}
    </motion.div>
  )
}
