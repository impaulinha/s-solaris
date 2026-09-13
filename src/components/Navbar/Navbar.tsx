import { useEffect, useRef } from 'react'
import LOGO from '@/assets/logo-ssolaris.png'
import { useMagnetic } from '@/hooks/useMagnetic'

const REPOSITORY_URL = 'https://github.com/impaulinha/s-solaris'

export function Navbar() {
  const codeLinkRef = useMagnetic<HTMLAnchorElement>(0.3)

  return (
    <header
      data-intro
      className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 md:px-8 md:py-6 lg:px-10"
    >
      <a
        href="/"
        aria-label="S-Solaris, página inicial"
        className="group pointer-events-auto flex items-center gap-3"
      >
        <img
          src={LOGO}
          alt=""
          className="h-8 w-auto transition-transform duration-700 ease-out group-hover:-rotate-[25deg] md:h-9"
        />
        <span className="font-mono text-xs tracking-[0.3em] text-star-100 uppercase">
          S-Solaris
          <span className="animate-blink text-planet">_</span>
        </span>
      </a>

      <div className="hidden items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-star-400 uppercase lg:flex">
        <span>Sistema Solar</span>
        <span className="size-1 rounded-full bg-planet" />
        <span>08 planetas</span>
        <span className="size-1 rounded-full bg-star-400/60" />
        <UtcClock />
      </div>

      <a
        ref={codeLinkRef}
        href={REPOSITORY_URL}
        target="_blank"
        rel="noreferrer"
        data-cursor-label="GitHub"
        className="group pointer-events-auto relative flex items-center gap-2 overflow-hidden rounded-full border border-star-100/15 px-4 py-2 font-mono text-[10px] tracking-[0.25em] text-star-200 uppercase transition-colors duration-500 hover:border-planet hover:text-space-950"
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-planet transition-transform duration-500 ease-out group-hover:translate-y-0" />
        <span className="relative">Código</span>
        <svg
          aria-hidden
          viewBox="0 0 12 12"
          fill="none"
          className="relative size-3 transition-transform duration-500 group-hover:rotate-45"
        >
          <path
            d="M3 9L9 3M9 3H4M9 3V8"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </a>
    </header>
  )
}

// relógio UTC atualizado direto no DOM, sem re-renderizar a navbar
function UtcClock() {
  const clockRef = useRef<HTMLTimeElement>(null)

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'UTC',
    })

    const tick = () => {
      if (clockRef.current) {
        clockRef.current.textContent = `${formatter.format(new Date())} UTC`
      }
    }

    tick()
    const interval = window.setInterval(tick, 1000)

    return () => window.clearInterval(interval)
  }, [])

  return <time ref={clockRef} className="min-w-[11ch] tabular-nums" />
}
