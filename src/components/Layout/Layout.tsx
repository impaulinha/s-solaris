interface LayoutProps {
  roulette: React.ReactNode
  info: React.ReactNode
  scene: React.ReactNode
}

export function Layout({ roulette, info, scene }: LayoutProps) {
  return (
    <div
      className="relative grid h-dvh w-full overflow-hidden bg-space-900 
        grid-rows-[55%_30%_15%]
        md:grid-rows-[80%_20%] md:grid-cols-[60%_40%]
        lg:grid-cols-[10%_40%_50%] lg:grid-rows-[100%]
    "
    >
      <aside
        className="relative z-10
          order-3 flex items-center justify-center
          md:order-2 md:col-start-2 md:row-start-2 md:border-l-0
          lg:order-1 lg:col-start-1 lg:row-start-1 lg:border-t-0
        "
      >
        {roulette}
      </aside>

      <main
        className="
          relative z-10
          order-2 flex flex-col justify-end px-6 py-8
          overflow-hidden
          md:order-2 md:col-start-2 md:row-span-1 md:justify-center md:px-10 md:py-16
          md:bg-gradient-to-b md:from-surface-900 md:to-space-900 md:scrollbar-hide
          lg:order-2 lg:col-start-2 lg:row-span-1 lg:px-12 lg:ml-10
        "
      >
        {info}
      </main>

      <section
        className="
          relative z-10 
          order-1 flex min-h-[40dvh] items-center justify-center
          md:order-1 md:col-start-1 md:row-start-1 md:row-span-2
          lg:order-3 lg:col-start-3
        "
      >
        {scene}
      </section>
    </div>
  )
}
