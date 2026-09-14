import { describe, expect, it } from 'vitest'
import { normalizeHeader } from '../normalizeHeader'

describe('normalizeHeader', () => {
  it('remove acentos, pontuação e caixa', () => {
    expect(normalizeHeader('% Desc. padrão')).toBe('desc padrao')
  })

  it('trata múltiplos espaços como um só', () => {
    expect(normalizeHeader('Descrição   da categoria')).toBe('descricao da categoria')
  })

  it('reconhece variações equivalentes como o mesmo valor normalizado', () => {
    expect(normalizeHeader('Código')).toBe(normalizeHeader('codigo'))
  })
})
