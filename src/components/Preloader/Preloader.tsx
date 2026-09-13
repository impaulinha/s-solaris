import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { gsap, useGSAP } from '@/lib/gsap'

interface IPreloaderProps {
  onComplete: () => void
}

// tempo mínimo em tela, para a abertura não piscar quando tudo já está em cache
const MIN_DURATION_MS = 1800

export function Preloader({ onComplete }: IPreloaderProps) {
  const { progress, active, total } = useProgress()
  const reducedMotion = usePrefersReducedMotion()
  const [fontsReady, setFontsReady] = useState(false)
  const [minTimeElapsed, setMinTimeElapsed] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const counterValueRef = useRef({ value: 0 })

  const isComplete =
    total > 0 && progress >= 100 && !active && fontsReady && minTimeElapsed

  useEffect(() => {
    let isMounted = true

    document.fonts.ready.then(() => {
      if (isMounted) setFontsReady(true)
    })
    const timeout = window.setTimeout(
      () => setMinTimeElapsed(true),
      MIN_DURATION_MS
    )

    return () => {
      isMounted = false
      window.clearTimeout(timeout)
    }
  }, [])

  // o contador persegue o progresso real de forma suave
  useGSAP(
    () => {
      gsap.to(counterValueRef.current, {
        value: progress,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => {
          const { value } = counterValueRef.current

          if (counterRef.current) {
            counterRef.current.textContent = String(Math.round(value)).padStart(
              3,
              '0'
            )
          }
          gsap.set(barRef.current, { scaleX: value / 100 })
        },
      })
    },
    { dependencies: [progress] }
  )

  // saída: textos sobem, a cena é liberada e a cortina se recolhe para cima
  useGSAP(
    () => {
      if (!isComplete) return

      const timeline = gsap.timeline({
        delay: reducedMotion ? 0 : 0.6,
        onComplete: () => setIsHidden(true),
      })

      timeline
        .to('[data-preloader-reveal]', {
          yPercent: -110,
          duration: reducedMotion ? 0.2 : 0.8,
          ease: 'power3.in',
          stagger: 0.05,
        })
        .add(() => onComplete(), '-=0.2')
        .to(
          rootRef.current,
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: reducedMotion ? 0.3 : 1.3,
            ease: 'expo.inOut',
          },
          '<'
        )
    },
    { dependencies: [isComplete], scope: rootRef }
  )

  if (isHidden) return null

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Carregando o sistema solar"
      className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-space-950 px-5 py-5 [clip-path:inset(0%_0%_0%_0%)] md:px-10 md:py-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,rgba(108,180,255,0.07),transparent_60%)]" />

      <div className="relative flex items-start justify-between gap-6 font-mono text-[10px] tracking-[0.25em] text-star-400 uppercase">
        <span className="overflow-hidden">
          <span data-preloader-reveal className="block">
            Exploração interativa
          </span>
        </span>
        <span className="overflow-hidden text-right">
          <span data-preloader-reveal className="block">
            Sistema Solar — 08 planetas
          </span>
        </span>
      </div>

      {/* órbita girando ao redor do nome */}
      <div className="relative flex flex-1 items-center justify-center">
        <div data-preloader-reveal className="relative size-44 md:size-60">
          <span className="absolute inset-0 rounded-full border border-star-100/10" />
          <span className="absolute inset-0 animate-[spin_2.8s_linear_infinite] rounded-full">
            <span className="absolute top-0 left-1/2 size-2 -translate-1/2 rounded-full bg-star-100 shadow-[0_0_14px_3px_rgba(240,244,255,0.55)]" />
          </span>
          <span className="absolute inset-7 animate-[spin_14s_linear_infinite_reverse] rounded-full border border-dashed border-star-100/15" />
          <span className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-light text-star-100 italic md:text-4xl">
            S-Solaris
          </span>
        </div>
      </div>

      <div className="relative flex items-end justify-between gap-6">
        <span className="overflow-hidden pb-2 font-mono text-[10px] tracking-[0.25em] text-star-400 uppercase md:pb-4">
          <span data-preloader-reveal className="block">
            Carregando texturas
          </span>
        </span>

        <span className="overflow-hidden text-[clamp(5rem,17vw,15rem)] leading-[0.85] font-extralight tracking-tighter text-star-100">
          <span
            ref={counterRef}
            data-preloader-reveal
            className="block tabular-nums"
          >
            000
          </span>
        </span>
      </div>

      <span className="absolute inset-x-0 bottom-0 h-px bg-star-100/10">
        <span
          ref={barRef}
          className="absolute inset-0 origin-left scale-x-0 bg-star-100"
        />
      </span>
    </div>
  )
}
