import { motion } from 'framer-motion'

interface IPlanetDescriptionProps {
  description: string
}

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.2 },
  },
}

export function PlanetDescription({ description }: IPlanetDescriptionProps) {
  return (
    <motion.p
      className="mt-6 max-w-sm font-sans text-sm leading-relaxed text-star-300 md:text-base"
      variants={variants}
    >
      {description}
    </motion.p>
  )
}
