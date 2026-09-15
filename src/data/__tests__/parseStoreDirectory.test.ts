import { describe, expect, it } from 'vitest'
import { parseStoreDirectory } from '../parseStoreDirectory'

describe('parseStoreDirectory', () => {
  it('parseia linhas no formato "código - nome - cidade"', () => {
    const result = parseStoreDirectory('055 - LOANDA - Loanda\n008 - SARANDI - Sarandi')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toEqual([
      { code: 55, label: 'LOANDA', city: 'Loanda' },
      { code: 8, label: 'SARANDI', city: 'Sarandi' },
    ])
  })

  it('ignora linhas em branco', () => {
    const result = parseStoreDirectory('055 - LOANDA - Loanda\n\n\n008 - SARANDI - Sarandi\n')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value).toHaveLength(2)
  })

  it('lida com nome de loja que contém hífen', () => {
    const result = parseStoreDirectory('016 - PAIÇANDU 1 - Paiçandu')

    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.value[0]).toEqual({ code: 16, label: 'PAIÇANDU 1', city: 'Paiçandu' })
  })

  it('retorna erro para arquivo vazio', () => {
    const result = parseStoreDirectory('   \n  \n')
    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.code).toBe('arquivo_vazio')
  })

  it('retorna erro apontando linhas que não seguem o formato esperado', () => {
    const result = parseStoreDirectory('055 - LOANDA - Loanda\nlinha sem o formato certo')

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.code).toBe('linha_invalida')
    expect(result.error.message).toContain('linha sem o formato certo')
  })
})
