import type { ReactNode } from 'react'
import { useMagnetic } from '@/hooks/useMagnetic'
import { cn } from '@/lib/utils'

type PillVariant = 'solid' | 'outline'

interface IPillBaseProps {
  children: ReactNode
  variant?: PillVariant
  cursorLabel?: string
}

interface IPillLinkProps extends IPillBaseProps {
  href: string
}

interface IPillButtonProps extends IPillBaseProps {
  onClick: () => void
}

function getPillClasses(variant: PillVariant) {
  return cn(
    'group relative inline-flex items-center gap-3 overflow-hidden rounded-full border px-6 py-3.5 font-mono text-[11px] tracking-[0.25em] uppercase transition-colors duration-500',
    variant === 'solid'
      ? 'border-planet bg-planet text-space-950'
      : 'border-star-100/20 text-star-100 hover:border-planet hover:text-space-950'
  )
}

// preenchimento que sobe no hover, com o texto por cima
function PillContent({ children, variant }: IPillBaseProps) {
  return (
    <>
      <span
        className={cn(
          'absolute inset-0 translate-y-full rounded-full transition-transform duration-500 ease-out group-hover:translate-y-0',
          variant === 'solid' ? 'bg-star-100' : 'bg-planet'
        )}
      />
      <span className="relative flex items-center gap-3">{children}</span>
    </>
  )
}

export function PillLink({
  href,
  children,
  variant = 'outline',
  cursorLabel,
}: IPillLinkProps) {
  const linkRef = useMagnetic<HTMLAnchorElement>(0.3)

  return (
    <a
      ref={linkRef}
      href={href}
      data-cursor-label={cursorLabel}
      className={getPillClasses(variant)}
    >
      <PillContent variant={variant}>{children}</PillContent>
    </a>
  )
}

export function PillButton({
  onClick,
  children,
  variant = 'outline',
  cursorLabel,
}: IPillButtonProps) {
  const buttonRef = useMagnetic<HTMLButtonElement>(0.3)

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onClick}
      data-cursor-label={cursorLabel}
      className={getPillClasses(variant)}
    >
      <PillContent variant={variant}>{children}</PillContent>
    </button>
  )
}
