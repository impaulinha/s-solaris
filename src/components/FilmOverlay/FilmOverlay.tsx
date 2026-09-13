// vinheta escurecendo as bordas e granulado de filme por cima de tudo
export function FilmOverlay() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(3,4,10,0.85)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-1/2 z-[3] animate-grain bg-noise opacity-[0.07]"
      />
    </>
  )
}
