import { normalizeCityName } from '../domain/normalizeCityName'
import { levenshteinDistance } from './levenshteinDistance'

export interface CityNameVariant {
  cityA: string
  cityB: string
}

/** Diferenças pequenas o suficiente (ex.: acento, espaço, 1-2 letras) para provavelmente ser a mesma cidade. */
const MAX_VARIANT_DISTANCE = 2

/**
 * Compara os nomes de cidade de dois arquivos e aponta pares que só existem
 * em um dos lados, mas parecem ser a mesma cidade escrita de forma diferente
 * (acento, espaçamento, pequena diferença de grafia). Não decide qual é a
 * forma "correta" — apenas sinaliza para o usuário interpretar.
 */
export function detectCityNameVariants(citiesA: string[], citiesB: string[]): CityNameVariant[] {
  const setB = new Set(citiesB)
  const setA = new Set(citiesA)
  const onlyInA = citiesA.filter((city) => !setB.has(city))
  const onlyInB = citiesB.filter((city) => !setA.has(city))

  const variants: CityNameVariant[] = []
  for (const cityA of onlyInA) {
    for (const cityB of onlyInB) {
      const normalizedA = normalizeCityName(cityA)
      const normalizedB = normalizeCityName(cityB)
      const isLikelyVariant =
        normalizedA === normalizedB || levenshteinDistance(normalizedA, normalizedB) <= MAX_VARIANT_DISTANCE
      if (isLikelyVariant) variants.push({ cityA, cityB })
    }
  }
  return variants
}
