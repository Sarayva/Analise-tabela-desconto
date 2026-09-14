import { describe, expect, it } from 'vitest'
import type { RawSheet } from '../rawSheet'
import { parseDiscountFile } from '../parseDiscountFile'

function sheet(sheetName: string, rows: Record<string, unknown>[]): RawSheet {
  return { sheetName, headers: rows.length > 0 ? Object.keys(rows[0]) : [], rows }
}

describe('parseDiscountFile', () => {
  it('extrai registros de um arquivo Fidelidade com uma aba por cidade', () => {
    const sheets: RawSheet[] = [
      sheet('Loanda - 2225', [
        { Código: 418, 'Descrição da categoria': 'ANALGESICO GENERICO', '% Desc. padrão': 17, '% Desc. máx.': 17 },
      ]),
      sheet('Jandaia - 2237', [
        { Código: 418, 'Descrição da categoria': 'ANALGESICO GENERICO', '% Desc. padrão': 18, '% Desc. máx.': 18 },
      ]),
    ]

    const result = parseDiscountFile(sheets, 'fidelidade')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.citiesDetected).toEqual(['Jandaia', 'Loanda'])
    expect(result.value.rowCount).toBe(2)
    expect(result.value.skippedRowCount).toBe(0)
    expect(result.value.cityStrategy).toEqual({ mode: 'por_aba' })
    expect(result.value.entries[0]).toMatchObject({
      city: 'Loanda',
      categoryCode: 418,
      categoryDescription: 'ANALGESICO GENERICO',
      percentage: 17,
      source: 'fidelidade',
    })
  })

  it('extrai registros de um arquivo Limite com uma única aba e coluna Cidade', () => {
    const sheets: RawSheet[] = [
      sheet('Sheet1', [
        { Cidade: 'Loanda', Código: 418, 'Descrição da categoria': 'ANALGESICO GENERICO', '% Desc. Limite': 20 },
        { Cidade: 'Jandaia', Código: 418, 'Descrição da categoria': 'ANALGESICO GENERICO', '% Desc. Limite': 20 },
      ]),
    ]

    const result = parseDiscountFile(sheets, 'limite')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.cityStrategy).toEqual({ mode: 'por_coluna', header: 'Cidade' })
    expect(result.value.citiesDetected).toEqual(['Jandaia', 'Loanda'])
  })

  it('reconhece cabeçalhos com nomes alternativos (mapeamento automático)', () => {
    const sheets: RawSheet[] = [
      sheet('Loanda - 2225', [
        { Codigo: 418, Categoria: 'ANALGESICO GENERICO', 'Desconto Fidelidade': 17 },
      ]),
    ]

    const result = parseDiscountFile(sheets, 'fidelidade')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.columnMapping.categoryCode).toBe('Codigo')
    expect(result.value.columnMapping.categoryDescription).toBe('Categoria')
    expect(result.value.columnMapping.percentage).toBe('Desconto Fidelidade')
  })

  it('ignora e conta linhas com campos obrigatórios ausentes, sem descartar o restante', () => {
    const sheets: RawSheet[] = [
      sheet('Loanda - 2225', [
        { Código: 418, 'Descrição da categoria': 'ANALGESICO GENERICO', '% Desc. padrão': 17 },
        { Código: null, 'Descrição da categoria': 'SEM CODIGO', '% Desc. padrão': 10 },
        { Código: 419, 'Descrição da categoria': '', '% Desc. padrão': 10 },
        { Código: 420, 'Descrição da categoria': 'SEM PERCENTUAL', '% Desc. padrão': null },
      ]),
    ]

    const result = parseDiscountFile(sheets, 'fidelidade')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.rowCount).toBe(1)
    expect(result.value.skippedRowCount).toBe(3)
  })

  it('retorna erro quando a coluna de percentual obrigatória não é encontrada', () => {
    const sheets: RawSheet[] = [
      sheet('Loanda - 2225', [{ Código: 418, 'Descrição da categoria': 'ANALGESICO GENERICO' }]),
    ]

    const result = parseDiscountFile(sheets, 'fidelidade')

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.code).toBe('coluna_ausente')
    expect(result.error.message).toContain('Desconto Fidelidade')
  })

  it('retorna erro quando duas colunas batem ambiguamente com o mesmo campo', () => {
    const sheets: RawSheet[] = [
      sheet('Loanda - 2225', [
        { Código: 418, Categoria: 'X', Descrição: 'X', '% Desc. padrão': 17 },
      ]),
    ]

    const result = parseDiscountFile(sheets, 'fidelidade')

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.code).toBe('coluna_ambigua')
  })

  it('retorna erro quando o arquivo tem uma única aba sem coluna Cidade', () => {
    const sheets: RawSheet[] = [
      sheet('Sheet1', [
        { Código: 418, 'Descrição da categoria': 'ANALGESICO GENERICO', '% Desc. Limite': 20 },
      ]),
    ]

    const result = parseDiscountFile(sheets, 'limite')

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.code).toBe('cidade_indefinida')
  })

  it('retorna erro para arquivo sem nenhuma aba com dados', () => {
    const result = parseDiscountFile([], 'fidelidade')

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.code).toBe('arquivo_vazio')
  })

  it('não usa a coluna "% Desc. máx." no cálculo — apenas a referencia quando presente', () => {
    const sheets: RawSheet[] = [
      sheet('Loanda - 2225', [
        { Código: 418, 'Descrição da categoria': 'X', '% Desc. padrão': 17, '% Desc. máx.': 0 },
      ]),
    ]

    const result = parseDiscountFile(sheets, 'fidelidade')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.entries[0].percentage).toBe(17)
    expect(result.value.columnMapping.fidelityMaxPercentage).toBe('% Desc. máx.')
  })
})
