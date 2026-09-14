import { describe, expect, it } from 'vitest'
import { normalizeSearchText } from '../normalizeSearchText'

describe('normalizeSearchText', () => {
  it('remove acentos e caixa', () => {
    expect(normalizeSearchText('Paiçandu')).toBe('paicandu')
  })

  it('permite comparar texto com e sem acento como iguais', () => {
    expect(normalizeSearchText('Paicandu')).toBe(normalizeSearchText('Paiçandu'))
  })
})
