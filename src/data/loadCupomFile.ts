import { ACCEPTED_EXTENSIONS } from '../config/fileFormat'
import { err, type Result } from '../domain/result'
import { parseCupomFile, type CupomStructureError, type ParsedCupomFile } from './parseCupomFile'
import { readCupomWorkbook } from './readCupomWorkbook'
import { hasAcceptedExtension } from './validateFileExtension'

export type CupomLoadError =
  | CupomStructureError
  | { code: 'extensao_invalida'; message: string }
  | { code: 'arquivo_corrompido'; message: string }

/** Ponto único que une leitura (I/O) + parsing do relatório de cupons. */
export async function loadCupomFile(file: File): Promise<Result<ParsedCupomFile, CupomLoadError>> {
  if (!hasAcceptedExtension(file.name)) {
    return err({
      code: 'extensao_invalida',
      message: `"${file.name}" não é um formato aceito. Formatos aceitos: ${ACCEPTED_EXTENSIONS.join(', ')}.`,
    })
  }

  let rawSheets
  try {
    rawSheets = await readCupomWorkbook(file)
  } catch {
    return err({
      code: 'arquivo_corrompido',
      message: `Não foi possível ler "${file.name}". O arquivo pode estar corrompido ou não é um arquivo válido, mesmo com essa extensão.`,
    })
  }

  return parseCupomFile(rawSheets)
}
