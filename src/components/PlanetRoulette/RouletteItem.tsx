import { cn } from '@/lib/utils'
import type { IPlanet } from '@/types/planet'

interface IRouletteItemProps {
  planet: IPlanet
  position: 'prev' | 'active' | 'next' | 'hidden'
  onClick: () => void
}

export function RouletteItem({
  planet,
  position,
  onClick,
}: IRouletteItemProps) {
  const isActive = position === 'active'
  const isVisible = position === 'next' || position === 'prev'

  return (
    <button
      onClick={onClick}
      aria-label={`Selecionar o ${planet.name}`}
      style={{ backgroundImage: `url(${planet.texture})` }}
      className={cn(
        'relative rounded-full bg-cover bg-center transition-all duration-700 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nebula-600',
        'md:mx-auto',
        isActive && 'h-16 w-16 opacity-100 md:h-20 md:w-20',
        isVisible && 'h-10 w-10 opacity-40 md:h-12 md:w-12 hover:opacity-60',
        position === 'hidden' && 'h-8 w-8 opacity-0 pointer-events-none'
      )}
    />
  )
}
