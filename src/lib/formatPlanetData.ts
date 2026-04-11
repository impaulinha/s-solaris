export function formatMass(
  massValue: number | null,
  massExponent: number | null
): string {
  if (!massValue || !massExponent) return 'Desconhecido'
  return `${massValue.toFixed(2)} × 10^${massExponent} kg`
}

export function formatGravity(gravity: number | null): string {
  if (!gravity) return 'Unknown'
  return `${gravity.toFixed(1)} m/s²`
}

export function formatRadius(radius: number | null): string {
  if (!radius) return 'Desconhecido'
  return `${radius.toLocaleString()} km`
}

export function formatOrbit(days: number | null): string {
  if (!days) return 'Desconhecido'
  if (days > 365) {
    return `${(days / 365.25).toFixed(2)} anos`
  }
  return `${days.toFixed(0)} dias`
}

export function formatMoons(moons: unknown[] | null): string {
  if (!moons) return '0'
  return moons.length.toString()
}

export function formatTemp(temp: number | null): string {
  if (!temp) return 'Desconhecido'

  const celsius = temp - 273.15

  return `${celsius.toFixed(1)} °C`
}
