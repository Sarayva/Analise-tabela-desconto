import { describe, expect, it } from 'vitest'
import * as XLSX from 'xlsx'
import { buildExportWorkbook } from '../buildExportWorkbook'

describe('buildExportWorkbook', () => {
  it('cria uma aba por relatório, com os dados corretos', async () => {
    const workbook = await buildExportWorkbook([
      { name: 'Dados filtrados', rows: [{ Cidade: 'Loanda', Categoria: 'A' }] },
      { name: 'Ranking de cidades', rows: [{ Cidade: 'Loanda', 'GAP médio (p.p.)': 5 }] },
    ])

    expect(workbook.SheetNames).toEqual(['Dados filtrados', 'Ranking de cidades'])
    const firstSheetRows = XLSX.utils.sheet_to_json(workbook.Sheets['Dados filtrados'])
    expect(firstSheetRows).toEqual([{ Cidade: 'Loanda', Categoria: 'A' }])
  })

  it('sanitiza nomes de aba com caracteres inválidos e corta em 31 caracteres', async () => {
    const workbook = await buildExportWorkbook([
      { name: 'Relatório: Cidade/Categoria [detalhado ao máximo possível]', rows: [] },
    ])

    expect(workbook.SheetNames[0]).not.toMatch(/[:\\/?*[\]]/)
    expect(workbook.SheetNames[0].length).toBeLessThanOrEqual(31)
  })

  it('lida com uma aba sem nenhuma linha', async () => {
    const workbook = await buildExportWorkbook([{ name: 'Vazia', rows: [] }])
    expect(workbook.SheetNames).toEqual(['Vazia'])
  })
})
