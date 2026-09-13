import type { Ref } from 'react'
import { cn, padIndex } from '@/lib/utils'
import type { IPlanet } from '@/types/planet'

interface IRouletteItemProps {
  planet: IPlanet
  isActive: boolean
  onClick: () => void
  showLabel?: boolean
  className?: string
  ref?: Ref<HTMLButtonElement>
}

export function RouletteItem({
  planet,
  isActive,
  onClick,
  showLabel = false,
  className,
  ref,
}: IRouletteItemProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={`Selecionar ${planet.name}`}
      aria-current={isActive || undefined}
      data-cursor-label={isActive ? undefined : 'Visitar'}
      className={cn(
        'group absolute flex cursor-pointer items-center gap-4 text-left will-change-transform',
        className
      )}
    >
      <span className="relative block size-14 shrink-0">
        {/* anel do planeta ativo */}
        <span
          className={cn(
            'absolute -inset-2 rounded-full border border-planet/70 transition-all duration-700',
            isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
          )}
        />

        {/* textura equiretangular deslizando: a miniatura parece girar */}
        <span
          className="absolute inset-0 animate-planet-spin rounded-full bg-size-[200%_100%] bg-repeat-x shadow-[inset_-10px_-6px_16px_rgba(0,0,0,0.85),inset_3px_2px_6px_rgba(255,255,255,0.14)] transition-transform duration-500 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url(${planet.texture})` }}
        />

        {planet.ringTexture && (
          <span className="absolute top-1/2 left-1/2 h-[30%] w-[185%] -translate-1/2 -rotate-[18deg] rounded-[50%] border border-[#e8d3a8]/60" />
        )}
      </span>

      {showLabel && (
        <span className="flex flex-col font-mono text-[10px] tracking-[0.25em] uppercase">
          <span
            className={cn(
              'transition-colors duration-500',
              isActive ? 'text-planet' : 'text-star-400'
            )}
          >
            {padIndex(planet.index)}
          </span>
          <span
            className={cn(
              'mt-0.5 font-serif text-[1.35rem] leading-none font-light tracking-normal normal-case transition-colors duration-500',
              isActive
                ? 'text-star-100'
                : 'text-star-300 group-hover:text-star-100'
            )}
          >
            {planet.name}
          </span>
        </span>
      )}
    </button>
  )
}
