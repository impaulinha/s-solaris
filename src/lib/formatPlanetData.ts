export interface IStatValue {
  // valor numérico animado na interface; null quando a API não informa
  value: number | null
  decimals: number
  unit: string
}

const AU_IN_KM = 149_597_870.7
const KELVIN_TO_CELSIUS = 273.15
const SUPERSCRIPT_DIGITS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹']
const UNKNOWN: IStatValue = { value: null, decimals: 0, unit: '' }

const numberFormatters = new Map<number, Intl.NumberFormat>()

export function formatNumber(value: number, decimals = 0): string {
  let formatter = numberFormatters.get(decimals)

  if (!formatter) {
    formatter = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
    numberFormatters.set(decimals, formatter)
  }

  return formatter.format(value)
}

export function formatStat({ value, decimals, unit }: IStatValue): string {
  if (value === null) return 'Desconhecido'

  const separator = unit === '°' ? '' : ' '
  return `${formatNumber(value, decimals)}${separator}${unit}`.trim()
}

function toSuperscript(value: number): string {
  return String(value)
    .split('')
    .map((char) => (char === '-' ? '⁻' : SUPERSCRIPT_DIGITS[Number(char)]))
    .join('')
}

export function formatMass(
  massValue: number | null,
  massExponent: number | null
): IStatValue {
  if (!massValue || !massExponent) return UNKNOWN
  return {
    value: massValue,
    decimals: 2,
    unit: `× 10${toSuperscript(massExponent)} kg`,
  }
}

export function formatGravity(gravity: number | null): IStatValue {
  if (!gravity) return UNKNOWN
  return { value: gravity, decimals: 1, unit: 'm/s²' }
}

export function formatRadius(radius: number | null): IStatValue {
  if (!radius) return UNKNOWN
  return { value: radius, decimals: 0, unit: 'km' }
}

export function formatOrbit(days: number | null): IStatValue {
  if (!days) return UNKNOWN
  if (days > 366) return { value: days / 365.25, decimals: 2, unit: 'anos' }
  return { value: days, decimals: 0, unit: 'dias' }
}

export function formatMoons(moons: unknown[] | null): IStatValue {
  return { value: moons?.length ?? 0, decimals: 0, unit: '' }
}

export function formatTemp(kelvin: number | null): IStatValue {
  if (!kelvin) return UNKNOWN
  return { value: kelvin - KELVIN_TO_CELSIUS, decimals: 0, unit: '°C' }
}

export function formatDistance(km: number | null): IStatValue {
  if (!km) return UNKNOWN
  return { value: km / AU_IN_KM, decimals: 2, unit: 'UA' }
}

export function formatRotation(hours: number | null): IStatValue {
  if (!hours) return UNKNOWN

  const absoluteHours = Math.abs(hours)
  if (absoluteHours > 48) {
    return { value: absoluteHours / 24, decimals: 1, unit: 'dias' }
  }
  return { value: absoluteHours, decimals: 1, unit: 'h' }
}

export function formatTilt(degrees: number): IStatValue {
  return { value: degrees, decimals: 2, unit: '°' }
}
