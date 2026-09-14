import { describe, expect, it } from 'vitest'
import { matchColumn } from '../matchColumn'

describe('matchColumn', () => {
  it('encontra a coluna quando um único cabeçalho bate com os aliases', () => {
    const result = matchColumn(['Código', 'Descrição da categoria', '% Desc. padrão'], [
      'desc padrao',
      'desconto fidelidade',
    ])
    expect(result).toEqual({ status: 'encontrada', header: '% Desc. padrão' })
  })

  it('retorna ausente quando nenhum cabeçalho bate', () => {
    const result = matchColumn(['Código', 'Descrição'], ['desc limite'])
    expect(result).toEqual({ status: 'ausente' })
  })

  it('retorna ambígua quando mais de um cabeçalho distinto bate com os aliases do mesmo campo', () => {
    const result = matchColumn(['Categoria', 'Descrição'], ['categoria', 'descricao'])
    expect(result.status).toBe('ambigua')
  })
})
