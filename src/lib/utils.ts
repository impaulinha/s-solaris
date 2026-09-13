import { twMerge } from 'tailwind-merge'
import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function padIndex(value: number): string {
  return String(value).padStart(2, '0')
}

// normaliza um valor para o intervalo [-length / 2, length / 2) de uma lista circular
export function wrapOffset(value: number, length: number): number {
  const wrapped = ((value % length) + length) % length
  return wrapped >= length / 2 ? wrapped - length : wrapped
}

// menor caminho entre dois índices de uma lista circular (ex.: 7 → 0 = +1)
export function getCircularOffset(
  from: number,
  to: number,
  length: number
): number {
  const offset = (((to - from) % length) + length) % length
  return offset > length / 2 ? offset - length : offset
}
