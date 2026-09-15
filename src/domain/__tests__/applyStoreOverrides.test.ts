import { describe, expect, it } from 'vitest'
import { applyStoreOverrides } from '../applyStoreOverrides'
import type { StoreAssignment } from '../types'

describe('applyStoreOverrides', () => {
  it('sem overrides, retorna as atribuições originais inalteradas', () => {
    const assignments: StoreAssignment[] = [{ storeCode: 36, storeName: 'X', tabela: 'Sarandi' }]
    expect(applyStoreOverrides(assignments, {})).toEqual(assignments)
  })

  it('substitui todas as atribuições de uma loja corrigida por uma única, com a tabela escolhida', () => {
    const assignments: StoreAssignment[] = [
      { storeCode: 36, storeName: 'X', tabela: 'Sarandi' },
      { storeCode: 36, storeName: 'X', tabela: 'Popular' },
    ]

    const result = applyStoreOverrides(assignments, { 36: 'Sarandi' })

    expect(result).toEqual([{ storeCode: 36, storeName: 'X', tabela: 'Sarandi' }])
  })

  it('não afeta lojas sem correção manual', () => {
    const assignments: StoreAssignment[] = [
      { storeCode: 36, storeName: 'X', tabela: 'Sarandi' },
      { storeCode: 36, storeName: 'X', tabela: 'Popular' },
      { storeCode: 8, storeName: 'Y', tabela: 'Sarandi' },
    ]

    const result = applyStoreOverrides(assignments, { 36: 'Sarandi' })

    expect(result).toContainEqual({ storeCode: 8, storeName: 'Y', tabela: 'Sarandi' })
    expect(result).toHaveLength(2)
  })

  it('preserva o nome da loja original ao aplicar a correção', () => {
    const assignments: StoreAssignment[] = [{ storeCode: 36, storeName: 'FARMACIAS SAO PAULO LTDA.', tabela: 'Popular' }]
    const [result] = applyStoreOverrides(assignments, { 36: 'Sarandi' })
    expect(result.storeName).toBe('FARMACIAS SAO PAULO LTDA.')
  })
})
