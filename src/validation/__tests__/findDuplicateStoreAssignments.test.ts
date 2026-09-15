import { describe, expect, it } from 'vitest'
import { findDuplicateStoreAssignments } from '../findDuplicateStoreAssignments'
import type { StoreAssignment } from '../../domain/types'

describe('findDuplicateStoreAssignments', () => {
  it('não aponta nada quando cada loja está em uma única tabela', () => {
    const assignments: StoreAssignment[] = [
      { storeCode: 55, storeName: 'A', tabela: 'Loanda' },
      { storeCode: 49, storeName: 'B', tabela: 'Jandaia' },
    ]
    expect(findDuplicateStoreAssignments(assignments)).toEqual([])
  })

  it('aponta uma loja atribuída a mais de uma tabela', () => {
    const assignments: StoreAssignment[] = [
      { storeCode: 55, storeName: 'A', tabela: 'Loanda' },
      { storeCode: 55, storeName: 'A', tabela: 'Jandaia' },
    ]
    expect(findDuplicateStoreAssignments(assignments)).toEqual([
      { storeCode: 55, storeName: 'A', tabelas: ['Jandaia', 'Loanda'] },
    ])
  })

  it('não conta a mesma loja duas vezes na mesma tabela como duplicidade', () => {
    const assignments: StoreAssignment[] = [
      { storeCode: 55, storeName: 'A', tabela: 'Loanda' },
      { storeCode: 55, storeName: 'A', tabela: 'Loanda' },
    ]
    expect(findDuplicateStoreAssignments(assignments)).toEqual([])
  })
})
