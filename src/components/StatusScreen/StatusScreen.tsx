import { Fragment, useEffect, useRef, type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { Cursor } from '@/components/Cursor'
import { FilmOverlay } from '@/components/FilmOverlay'
import { Marquee } from '@/components/Marquee'
import { Navbar } from '@/components/Navbar'
import { ScrambleText } from '@/components/ScrambleText'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

interface IStatusScreenProps {
  label: string
  title: string
  description: string
  marquee: string
  accentColor: string
  hero: ReactNode
  actions: ReactNode
  // detalhes técnicos exibidos apenas em desenvolvimento
  details?: string
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE_OUT_EXPO },
  },
}

const titleVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
}

const charVariants: Variants = {
  hidden: { y: '110%', rotate: 8 },
  visible: {
    y: '0%',
    rotate: 0,
    transition: { duration: 1, ease: EASE_OUT_EXPO },
  },
}

// base compartilhada das páginas de 404 e de erro
export function StatusScreen({
  label,
  title,
  description,
  marquee,
  accentColor,
  hero,
  actions,
  details,
}: IStatusScreenProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const hasFinePointer = useMediaQuery('(pointer: fine)')
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    document.documentElement.style.setProperty('--planet', accentColor)
  }, [accentColor])

  // o destaque acompanha levemente o mouse
  useGSAP(
    () => {
      const hero = heroRef.current
      if (!hero || !hasFinePointer || reducedMotion) return

      const moveX = gsap.quickTo(hero, 'x', {
        duration: 1.2,
        ease: 'power3.out',
      })
      const moveY = gsap.quickTo(hero, 'y', {
        duration: 1.2,
        ease: 'power3.out',
      })

      const handleMove = (event: PointerEvent) => {
        moveX((event.clientX / window.innerWidth - 0.5) * 36)
        moveY((event.clientY / window.innerHeight - 0.5) * 24)
      }

      window.addEventListener('pointermove', handleMove, { passive: true })
      return () => window.removeEventListener('pointermove', handleMove)
    },
    { dependencies: [hasFinePointer, reducedMotion] }
  )

  const words = title.split(' ')

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-space-950">
      <Cursor />
      <Navbar />

      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 animate-drift bg-[url(/textures/stars.jpg)] bg-cover bg-center opacity-60" />
        <div className="absolute top-[42%] left-1/2 size-[120vmin] -translate-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--planet)_22%,transparent)_0%,transparent_62%)]" />
        <div className="absolute inset-x-0 bottom-[6%] opacity-70">
          <Marquee text={marquee} />
        </div>
      </div>

      <FilmOverlay />

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // em telas baixas o conteúdo rola em vez de encolher; o "safe"
        // evita que o topo fique inalcançável quando não cabe centralizado
        className="scrollbar-hide relative z-10 flex flex-1 flex-col items-center justify-center-safe overflow-y-auto px-6 pt-24 pb-16 text-center [&>*]:shrink-0"
      >
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2.5 rounded-full border border-planet/30 bg-planet/5 px-3 py-1.5 font-mono text-[11px] tracking-[0.2em] text-star-200 uppercase"
        >
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-planet" />
            <span className="relative size-1.5 rounded-full bg-planet" />
          </span>
          <ScrambleText text={label} delay={0.4} />
        </motion.div>

        <div ref={heroRef} className="my-6 short:my-3">
          {hero}
        </div>

        <h1 className="max-w-3xl font-serif text-[length:clamp(2.5rem,min(6vw,9vh),5rem)] leading-[1] font-light tracking-[-0.02em] text-star-100">
          <span className="sr-only">{title}</span>
          <motion.span aria-hidden variants={titleVariants} className="inline">
            {words.map((word, wordIndex) => (
              <Fragment key={`${word}-${wordIndex}`}>
                <span className="-my-[0.12em] inline-flex overflow-hidden py-[0.12em]">
                  {Array.from(word).map((char, charIndex) => (
                    <motion.span
                      key={`${char}-${charIndex}`}
                      variants={charVariants}
                      className="inline-block origin-bottom-left"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>{' '}
              </Fragment>
            ))}
          </motion.span>
        </h1>

        <motion.p
          variants={itemVariants}
          className="mt-5 max-w-xl text-[15px] leading-relaxed text-star-300 md:text-base"
        >
          {description}
        </motion.p>

        {details && (
          <motion.pre
            variants={itemVariants}
            className="mt-5 max-w-xl overflow-x-auto rounded-sm border border-star-100/10 bg-space-950/60 px-4 py-3 text-left font-mono text-[11px] whitespace-pre-wrap text-star-300"
          >
            {details}
          </motion.pre>
        )}

        <motion.div
          variants={itemVariants}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 short:mt-6"
        >
          {actions}
        </motion.div>
      </motion.main>
    </div>
  )
}
