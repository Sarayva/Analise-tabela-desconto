import { describe, expect, it } from 'vitest'
import { findStoreAssignmentMismatches } from '../findStoreAssignmentMismatches'
import type { StoreAssignment } from '../../domain/types'

describe('findStoreAssignmentMismatches', () => {
  it('não aponta nada quando a loja está na mesma tabela nos dois arquivos', () => {
    const fidelity: StoreAssignment[] = [{ storeCode: 55, storeName: 'A', tabela: 'Loanda' }]
    const limit: StoreAssignment[] = [{ storeCode: 55, storeName: 'A', tabela: 'Loanda' }]
    expect(findStoreAssignmentMismatches(fidelity, limit)).toEqual([])
  })

  it('aponta quando a loja está em tabelas diferentes entre Fidelidade e Limite', () => {
    const fidelity: StoreAssignment[] = [{ storeCode: 55, storeName: 'A', tabela: 'Loanda' }]
    const limit: StoreAssignment[] = [{ storeCode: 55, storeName: 'A', tabela: 'Jandaia' }]

    expect(findStoreAssignmentMismatches(fidelity, limit)).toEqual([
      { storeCode: 55, storeName: 'A', fidelityTabela: 'Loanda', limitTabela: 'Jandaia' },
    ])
  })

  it('não aponta nada quando a loja só existe em um dos dois arquivos', () => {
    const fidelity: StoreAssignment[] = [{ storeCode: 55, storeName: 'A', tabela: 'Loanda' }]
    const limit: StoreAssignment[] = []
    expect(findStoreAssignmentMismatches(fidelity, limit)).toEqual([])
  })
})
