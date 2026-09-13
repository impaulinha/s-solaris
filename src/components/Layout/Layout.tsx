import type { ReactNode, Ref } from 'react'

interface LayoutProps {
  backdrop: ReactNode
  scene: ReactNode
  roulette: ReactNode
  info: ReactNode
  hud: ReactNode
  footer: ReactNode
  stageRef: Ref<HTMLElement>
}

export function Layout({
  backdrop,
  scene,
  roulette,
  info,
  hud,
  footer,
  stageRef,
}: LayoutProps) {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-space-950 [--rail-width:clamp(12rem,17vw,19rem)]">
      {/* fundo: via láctea, brilho na cor do planeta e nome gigante */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {backdrop}
      </div>

      {/* canvas 3D em tela cheia; o planeta é enquadrado no palco (stage) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
        {scene}
      </div>

      {/* vinheta e granulado de filme */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(3,4,10,0.85)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1/2 z-[3] animate-grain bg-noise opacity-[0.07]"
      />

      <div
        className="
          relative z-10 grid h-full w-full
          grid-rows-[minmax(0,1.2fr)_minmax(0,1fr)_auto]
          md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:grid-rows-[minmax(0,1fr)_auto]
          lg:grid-cols-[var(--rail-width)_minmax(0,0.95fr)_minmax(0,1.1fr)] lg:grid-rows-1
        "
      >
        <aside
          data-intro
          className="
            relative order-3
            md:col-start-2 md:row-start-2
            lg:order-1 lg:col-start-1 lg:row-start-1
          "
        >
          {roulette}
        </aside>

        <main
          className="
            relative order-2 flex min-h-0 flex-col px-6 [container-type:inline-size]
            md:col-start-2 md:row-start-1 md:justify-center md:px-10 md:pt-24
            lg:order-2 lg:pt-28 lg:pr-6 lg:pb-32 lg:pl-4
          "
        >
          {info}
        </main>

        <section
          ref={stageRef}
          className="
            relative order-1 mt-16 [container-type:size]
            md:col-start-1 md:row-span-2 md:row-start-1 md:mt-0
            lg:order-3 lg:col-start-3 lg:row-span-1
          "
        >
          {hud}
        </section>
      </div>

      {footer}
    </div>
  )
}
