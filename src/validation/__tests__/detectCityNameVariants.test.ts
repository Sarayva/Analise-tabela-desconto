import { describe, expect, it } from 'vitest'
import { detectCityNameVariants } from '../detectCityNameVariants'

describe('detectCityNameVariants', () => {
  it('não aponta nada quando as cidades são exatamente as mesmas nos dois arquivos', () => {
    expect(detectCityNameVariants(['Loanda', 'Jandaia'], ['Loanda', 'Jandaia'])).toEqual([])
  })

  it('aponta cidades que só diferem por acento/espaçamento', () => {
    const result = detectCityNameVariants(['São Paulo'], ['Sao Paulo'])
    expect(result).toEqual([{ cityA: 'São Paulo', cityB: 'Sao Paulo' }])
  })

  it('aponta pequenas diferenças de grafia (poucas letras)', () => {
    const result = detectCityNameVariants(['Paranavai'], ['Paranavaí'])
    expect(result).toEqual([{ cityA: 'Paranavai', cityB: 'Paranavaí' }])
  })

  it('não aponta cidades genuinamente diferentes como variante', () => {
    expect(detectCityNameVariants(['Loanda'], ['Maringá'])).toEqual([])
  })
})
