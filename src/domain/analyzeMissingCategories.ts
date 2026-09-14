import { matrixKey, type CityCategoryMatrix } from './buildCityCategoryMatrix'

export interface CategoryRef {
  code: number
  description: string
}

export interface MissingCategoriesByCity {
  city: string
  missingCategories: CategoryRef[]
}

export interface CategoryAbsence extends CategoryRef {
  missingInCities: string[]
  presentInCities: string[]
}

export interface MissingCategoryAnalysis {
  /** Uma entrada por cidade, ordenada da que tem mais categorias ausentes para a que tem menos. */
  byCity: MissingCategoriesByCity[]
  /** Categorias ausentes em pelo menos uma cidade, ordenadas da mais ausente para a menos. */
  categoriesWithAnyAbsence: CategoryAbsence[]
  /** Categorias que só aparecem em uma única cidade. */
  exclusiveCategories: CategoryAbsence[]
}

/**
 * Aponta onde a estrutura de categorias diverge entre cidades. Não julga se a
 * ausência é um erro — só descreve onde ela ocorre; a interpretação é do usuário.
 */
export function analyzeMissingCategories(matrix: CityCategoryMatrix): MissingCategoryAnalysis {
  const byCity: MissingCategoriesByCity[] = matrix.cities
    .map((city) => ({
      city,
      missingCategories: matrix.categories.filter(
        (category) => !matrix.cellByKey.has(matrixKey(city, category.code)),
      ),
    }))
    .sort((a, b) => b.missingCategories.length - a.missingCategories.length)

  const categoriesWithAnyAbsence: CategoryAbsence[] = []
  const exclusiveCategories: CategoryAbsence[] = []

  for (const category of matrix.categories) {
    const presentInCities = matrix.cities.filter((city) => matrix.cellByKey.has(matrixKey(city, category.code)))
    const missingInCities = matrix.cities.filter((city) => !presentInCities.includes(city))
    const entry: CategoryAbsence = { ...category, missingInCities, presentInCities }

    if (missingInCities.length > 0) categoriesWithAnyAbsence.push(entry)
    if (presentInCities.length === 1) exclusiveCategories.push(entry)
  }

  categoriesWithAnyAbsence.sort((a, b) => b.missingInCities.length - a.missingInCities.length)

  return { byCity, categoriesWithAnyAbsence, exclusiveCategories }
}
