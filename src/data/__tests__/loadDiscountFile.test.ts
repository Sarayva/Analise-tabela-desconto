import { describe, expect, it } from 'vitest'
import { loadDiscountFile } from '../loadDiscountFile'

function corruptedXlsxFile(): File {
  // Cabeçalho de ZIP (assinatura de .xlsx) seguido de bytes aleatórios — simula um
  // arquivo .xlsx corrompido/truncado, não um arquivo de texto disfarçado.
  const bytes = new Uint8Array(500)
  bytes[0] = 0x50
  bytes[1] = 0x4b
  bytes[2] = 0x03
  bytes[3] = 0x04
  for (let i = 4; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256)
  return new File([bytes], 'corrompido.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

describe('loadDiscountFile', () => {
  it('retorna um erro tratado (não lança exceção) quando o arquivo está corrompido', async () => {
    const result = await loadDiscountFile([corruptedXlsxFile()], 'fidelidade')

    expect(result.ok).toBe(false)
    if (result.ok) return
    expect(result.error.code).toBe('arquivo_corrompido')
    expect(result.error.message).toContain('corrompido.xlsx')
  })
})
