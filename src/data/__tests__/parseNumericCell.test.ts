import { describe, expect, it } from 'vitest'
import { parseNumericCell, parseTextCell } from '../parseNumericCell'

describe('parseNumericCell', () => {
  it('aceita números', () => {
    expect(parseNumericCell(17)).toBe(17)
  })

  it('aceita texto com vírgula decimal', () => {
    expect(parseNumericCell('17,5')).toBe(17.5)
  })

  it('retorna null para texto vazio', () => {
    expect(parseNumericCell('   ')).toBeNull()
  })

  it('retorna null para valores não numéricos', () => {
    expect(parseNumericCell('abc')).toBeNull()
  })

  it('retorna null para null/undefined', () => {
    expect(parseNumericCell(null)).toBeNull()
    expect(parseNumericCell(undefined)).toBeNull()
  })
})

describe('parseTextCell', () => {
  it('remove espaços nas pontas', () => {
    expect(parseTextCell('  Loanda  ')).toBe('Loanda')
  })

  it('retorna null para string vazia', () => {
    expect(parseTextCell('   ')).toBeNull()
  })

  it('retorna null para null/undefined', () => {
    expect(parseTextCell(null)).toBeNull()
    expect(parseTextCell(undefined)).toBeNull()
  })
})
