import { Fragment } from 'react'
import { motion, type Variants } from 'framer-motion'

interface IPlanetDescriptionProps {
  description: string
}

const paragraphVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.012, delayChildren: 0.2 } },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export function PlanetDescription({ description }: IPlanetDescriptionProps) {
  const words = description.split(' ')

  return (
    <motion.p
      variants={paragraphVariants}
      className="mt-6 max-w-md text-[15px] leading-relaxed text-star-300 md:mt-8 md:text-base lg:max-w-[31rem]"
    >
      <span className="sr-only">{description}</span>
      {words.map((word, index) => (
        <Fragment key={index}>
          <motion.span
            aria-hidden
            variants={wordVariants}
            className="inline-block"
          >
            {word}
          </motion.span>{' '}
        </Fragment>
      ))}
    </motion.p>
  )
}
