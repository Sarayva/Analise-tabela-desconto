import { describe, expect, it } from 'vitest'
import { parseCupomFile } from '../parseCupomFile'
import type { CupomRawSheet } from '../readCupomWorkbook'

/** Monta um sheet no mesmo formato do relatório real: título, metadados, cabeçalho, dados com preenchimento para baixo, rodapé. */
function sheetLikeRealReport(dataRows: unknown[][]): CupomRawSheet {
  return {
    sheetName: 'Vendas e descontos por periodo',
    rows: [
      ['Vendas e descontos por periodo'],
      ['Árvore mercadológica\nPeríodo consulta: 06/09/2026 13/09/2026\n'],
      ['CodFilial', 'Categoria', 'NrCupom', 'NmVendedor', 'DataVenda', 'VlrVenda', 'VlrDescItens', '%DescontoFinal'],
      ...dataRows,
      ['Totais', null, null, null, null, 1000, 500, null],
      ['H:abc123|Usuário: FULANO - 2026-09-14'],
    ],
  }
}

describe('parseCupomFile', () => {
  it('reconhece o cabeçalho real ignorando as linhas de título antes dele', () => {
    const sheet = sheetLikeRealReport([
      [55, 'ANALGESICO GENERICO', '100', 'JOAO', '10/09/2026', 100, 20, 20],
    ])

    const result = parseCupomFile([sheet])

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.entries).toHaveLength(1)
    expect(result.value.entries[0]).toMatchObject({ city: 'Loanda', storeCode: 55, categoryDescription: 'ANALGESICO GENERICO' })
  })

  it('preenche Filial e Categoria "para baixo" quando a célula vem em branco (linhas agrupadas)', () => {
    const sheet = sheetLikeRealReport([
      [55, 'ANALGESICO GENERICO', '100', 'JOAO', '10/09/2026', 100, 20, 20],
      [null, 'ANALGESICO SIMILAR', '101', 'MARIA', '10/09/2026', 80, 10, 12.5],
    ])

    const result = parseCupomFile([sheet])

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.entries).toHaveLength(2)
    expect(result.value.entries[1].city).toBe('Loanda')
    expect(result.value.entries[1].categoryDescription).toBe('ANALGESICO SIMILAR')
  })

  it('ignora a linha de rodapé (Totais / Usuário) sem contar como registro nem erro', () => {
    const sheet = sheetLikeRealReport([[55, 'ANALGESICO GENERICO', '100', 'JOAO', '10/09/2026', 100, 20, 20]])

    const result = parseCupomFile([sheet])

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.entries).toHaveLength(1)
    expect(result.value.skippedRowCount).toBe(0)
  })

  it('separa vendas de lojas fora do escopo das "lojas de fora" em vez de misturar ou descartar sem aviso', () => {
    const sheet = sheetLikeRealReport([
      [55, 'ANALGESICO GENERICO', '100', 'JOAO', '10/09/2026', 100, 20, 20], // Loanda, dentro do escopo
      [2, 'ANALGESICO GENERICO', '101', 'MARIA', '10/09/2026', 80, 10, 12.5], // Cerro Azul, fora do escopo
    ])

    const result = parseCupomFile([sheet])

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.entries).toHaveLength(1)
    expect(result.value.outOfScopeStoreCodes).toEqual([2])
  })

  it('conta linhas com campos obrigatórios ausentes como ignoradas, sem quebrar o parsing', () => {
    const sheet = sheetLikeRealReport([
      [55, 'ANALGESICO GENERICO', '100', 'JOAO', '10/09/2026', 100, 20, 20],
      [55, 'SEM CUPOM', null, 'MARIA', '10/09/2026', 80, 10, 12.5],
    ])

    const result = parseCupomFile([sheet])

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.entries).toHaveLength(1)
    expect(result.value.skippedRowCount).toBe(1)
  })

  it('retorna erro quando não encontra uma linha de cabeçalho reconhecível', () => {
    const sheet: CupomRawSheet = {
      sheetName: 'Vazio',
      rows: [['isto', 'nao', 'e', 'um', 'relatorio', 'de', 'cupons']],
    }

    const result = parseCupomFile([sheet])

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.code).toBe('cabecalho_nao_encontrado')
  })

  it('retorna erro para arquivo sem nenhuma linha com dados', () => {
    const result = parseCupomFile([{ sheetName: 'Vazio', rows: [] }])

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.code).toBe('arquivo_vazio')
  })

  it('lista as cidades detectadas, ordenadas', () => {
    const sheet = sheetLikeRealReport([
      [55, 'A', '1', 'X', '10/09/2026', 10, 1, 10],
      [8, 'A', '2', 'X', '10/09/2026', 10, 1, 10],
    ])

    const result = parseCupomFile([sheet])

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value.citiesDetected).toEqual(['Loanda', 'Sarandi'])
  })
})
