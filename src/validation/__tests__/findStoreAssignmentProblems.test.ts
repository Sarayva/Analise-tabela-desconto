import { describe, expect, it } from 'vitest'
import { findStoreAssignmentProblems } from '../findStoreAssignmentProblems'
import type { StoreAssignment, StoreDirectoryEntry } from '../../domain/types'

const directory: StoreDirectoryEntry[] = [
  { code: 8, label: 'SARANDI', city: 'Sarandi' },
  { code: 36, label: 'SARANDI 3 DRIVE', city: 'Sarandi' },
  { code: 44, label: 'SARANDI 5 MARANGONI', city: 'Sarandi' },
  { code: 16, label: 'PAIÇANDU 1', city: 'Paiçandu' },
  { code: 47, label: 'PAIÇANDU 2 CANCAO', city: 'Paiçandu' },
  { code: 4, label: 'FARMACIAS SAO PAULO', city: 'Maringá' },
]

describe('findStoreAssignmentProblems', () => {
  it('não aponta nada quando a loja está numa única tabela que bate com a lista oficial', () => {
    const assignments: StoreAssignment[] = [{ storeCode: 8, storeName: 'X', tabela: 'Sarandi' }]
    expect(findStoreAssignmentProblems(assignments, directory)).toEqual([])
  })

  it('aponta uma loja de Sarandi atribuída também a uma tabela de Maringá como incorreta (caso real: loja 36)', () => {
    const assignments: StoreAssignment[] = [
      { storeCode: 36, storeName: 'X', tabela: 'Sarandi' },
      { storeCode: 36, storeName: 'X', tabela: 'Popular' },
    ]

    const [problem] = findStoreAssignmentProblems(assignments, directory)

    expect(problem.expectedCity).toBe('Sarandi')
    expect(problem.assignedTabelas).toEqual(['Popular', 'Sarandi'])
    expect(problem.incorrectTabelas).toEqual(['Popular'])
  })

  it('aponta a tabela errada mesmo quando a loja só tem uma atribuição, se ela não bate com a lista oficial', () => {
    const assignments: StoreAssignment[] = [{ storeCode: 47, storeName: 'X', tabela: 'Popular Plus' }]

    const [problem] = findStoreAssignmentProblems(assignments, directory)

    expect(problem.expectedCity).toBe('Paiçandu')
    expect(problem.incorrectTabelas).toEqual(['Popular Plus'])
  })

  it('para loja de Maringá, não sabe qual das sub-tabelas é a certa, mas identifica atribuição a cidade "de fora" como erro', () => {
    const assignments: StoreAssignment[] = [
      { storeCode: 4, storeName: 'X', tabela: 'Popular' },
      { storeCode: 4, storeName: 'X', tabela: 'Sarandi' },
    ]

    const [problem] = findStoreAssignmentProblems(assignments, directory)

    expect(problem.expectedCity).toBe('Maringá')
    expect(problem.incorrectTabelas).toEqual(['Sarandi'])
  })

  it('quando o código não está na lista oficial, ainda aponta ambiguidade de múltiplas tabelas, sem apontar qual é a errada', () => {
    const assignments: StoreAssignment[] = [
      { storeCode: 999, storeName: 'X', tabela: 'Loanda' },
      { storeCode: 999, storeName: 'X', tabela: 'Marialva' },
    ]

    const [problem] = findStoreAssignmentProblems(assignments, directory)

    expect(problem.expectedCity).toBeNull()
    expect(problem.assignedTabelas).toEqual(['Loanda', 'Marialva'])
    expect(problem.incorrectTabelas).toEqual([])
  })

  it('não relata nada quando o código não está na lista e há só uma tabela atribuída', () => {
    const assignments: StoreAssignment[] = [{ storeCode: 999, storeName: 'X', tabela: 'Loanda' }]
    expect(findStoreAssignmentProblems(assignments, directory)).toEqual([])
  })

  it('não aponta falso positivo quando a cidade da lista oficial só difere por acento (ex.: Paranavaí x Paranavai)', () => {
    const directoryWithAccent: StoreDirectoryEntry[] = [{ code: 56, label: 'PARANAVAÍ', city: 'Paranavaí' }]
    const assignments: StoreAssignment[] = [{ storeCode: 56, storeName: 'X', tabela: 'Paranavai' }]

    expect(findStoreAssignmentProblems(assignments, directoryWithAccent)).toEqual([])
  })

  it('não aponta falso positivo quando a lista oficial usa o nome completo da cidade (ex.: "Jandaia do Sul" x "Jandaia")', () => {
    const directoryWithFullName: StoreDirectoryEntry[] = [
      { code: 49, label: 'JANDAIA DO SUL', city: 'Jandaia do Sul' },
    ]
    const assignments: StoreAssignment[] = [{ storeCode: 49, storeName: 'X', tabela: 'Jandaia' }]

    expect(findStoreAssignmentProblems(assignments, directoryWithFullName)).toEqual([])
  })
})
