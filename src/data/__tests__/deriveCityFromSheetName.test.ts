import { describe, expect, it } from 'vitest'
import { deriveCityFromSheetName } from '../deriveCityFromSheetName'

describe('deriveCityFromSheetName', () => {
  it('remove o sufixo de código de loja', () => {
    expect(deriveCityFromSheetName('Loanda - 2225')).toBe('Loanda')
  })

  it('mantém nomes de cidade com espaço', () => {
    expect(deriveCityFromSheetName('Porto Rico - 1842')).toBe('Porto Rico')
  })

  it('mantém o nome original quando não há sufixo numérico', () => {
    expect(deriveCityFromSheetName('Loanda')).toBe('Loanda')
  })
})
