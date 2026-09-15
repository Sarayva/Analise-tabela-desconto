import { describe, expect, it } from 'vitest'
import { extractStoreAssignments } from '../extractStoreAssignments'
import type { RawSheet } from '../rawSheet'

function sheetWithStoreTable(sheetName: string, arrayRows: unknown[][]): RawSheet {
  return { sheetName, headers: [], rows: [], arrayRows }
}

describe('extractStoreAssignments', () => {
  it('extrai loja + código a partir da tabela auxiliar, localizando a coluna pelo texto do cabeçalho', () => {
    const sheet = sheetWithStoreTable('Loanda - 2225', [
      ['Código', 'Descrição da categoria', '% Desc. padrão', '% Desc. máx.', null, null, 'Código', 'Nome da filial'],
      [418, 'ANALGESICO GENERICO', 17, 17, null, null, 55, 'FARMACIAS SAO PAULO LTDA'],
      [584, 'ANALGESICO RX CONTROLADO', 21, 21, null, null, 60, 'FARMACIAS SAO PAULO LTDA.'],
      [530, 'ANALGESICO SIMILAR', 8, 8, null, null, null, null],
    ])

    const assignments = extractStoreAssignments([sheet])

    expect(assignments).toEqual([
      { storeCode: 55, storeName: 'FARMACIAS SAO PAULO LTDA', tabela: 'Loanda' },
      { storeCode: 60, storeName: 'FARMACIAS SAO PAULO LTDA.', tabela: 'Loanda' },
    ])
  })

  it('ignora o código 1001 (CNPJ principal usado por engano como código de loja)', () => {
    const sheet = sheetWithStoreTable('Loanda - 2225', [
      ['Código', 'Nome da filial'],
      [55, 'FARMACIAS SAO PAULO LTDA'],
      [1001, 'FARMACIAS SAO PAULO LTDA.'],
    ])

    expect(extractStoreAssignments([sheet])).toEqual([
      { storeCode: 55, storeName: 'FARMACIAS SAO PAULO LTDA', tabela: 'Loanda' },
    ])
  })

  it('funciona mesmo se a coluna de lojas estiver em outra posição, desde que o cabeçalho "Nome da filial" exista', () => {
    const sheet = sheetWithStoreTable('Jandaia - 2237', [
      ['Categoria', 'Código', 'Nome da filial'],
      ['X', 49, 'LOJA JANDAIA'],
    ])

    const assignments = extractStoreAssignments([sheet])

    expect(assignments).toEqual([{ storeCode: 49, storeName: 'LOJA JANDAIA', tabela: 'Jandaia' }])
  })

  it('não retorna nada (e não dá erro) para uma aba sem a tabela auxiliar de lojas', () => {
    const sheet = sheetWithStoreTable('Loanda - 2225', [
      ['Código', 'Descrição da categoria', '% Desc. padrão'],
      [418, 'ANALGESICO GENERICO', 17],
    ])

    expect(extractStoreAssignments([sheet])).toEqual([])
  })

  it('ignora linhas sem código ou sem nome de loja preenchidos', () => {
    const sheet = sheetWithStoreTable('Loanda - 2225', [
      ['Código', 'Nome da filial'],
      [55, 'FARMACIAS SAO PAULO LTDA'],
      [null, 'SEM CODIGO'],
      [60, null],
    ])

    expect(extractStoreAssignments([sheet])).toEqual([
      { storeCode: 55, storeName: 'FARMACIAS SAO PAULO LTDA', tabela: 'Loanda' },
    ])
  })
})
