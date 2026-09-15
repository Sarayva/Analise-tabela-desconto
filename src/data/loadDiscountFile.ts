import { ACCEPTED_EXTENSIONS, SOURCE_FILE_LABEL } from '../config/fileFormat'
import type { SourceFile } from '../domain/types'
import { err, type Result } from '../domain/result'
import { parseDiscountFile, type FileStructureError, type ParsedFile } from './parseDiscountFile'
import type { RawSheet } from './rawSheet'
import { readWorkbook } from './readWorkbook'
import { hasAcceptedExtension } from './validateFileExtension'

export type FileLoadError =
  | FileStructureError
  | { code: 'extensao_invalida'; message: string }
  | { code: 'arquivo_corrompido'; message: string }

/**
 * Ponto único que une leitura do(s) arquivo(s) (I/O) + mapeamento de colunas
 * (regra pura). Único lugar que sabe que o processamento parte de `File`s do
 * navegador. Aceita mais de um arquivo (ex.: "lojas de fora" + "Maringá")
 * tratando as abas de todos como se fossem um único arquivo maior — cada
 * arquivo pode contribuir cidades/tabelas diferentes.
 */
export async function loadDiscountFile(
  files: File[],
  source: SourceFile,
): Promise<Result<ParsedFile, FileLoadError>> {
  for (const file of files) {
    if (!hasAcceptedExtension(file.name)) {
      return err({
        code: 'extensao_invalida',
        message: `"${file.name}" não é um formato aceito para ${SOURCE_FILE_LABEL[source]}. Formatos aceitos: ${ACCEPTED_EXTENSIONS.join(', ')}.`,
      })
    }
  }

  const rawSheets: RawSheet[] = []
  for (const file of files) {
    try {
      rawSheets.push(...(await readWorkbook(file)))
    } catch {
      // O binário enviado pelo usuário não é confiável (regra 15 do calude.md) — a
      // biblioteca de leitura pode lançar exceção para um .xlsx corrompido/truncado.
      return err({
        code: 'arquivo_corrompido',
        message: `Não foi possível ler "${file.name}". O arquivo pode estar corrompido ou não é um arquivo ${ACCEPTED_EXTENSIONS.join('/')} válido, mesmo com essa extensão.`,
      })
    }
  }

  return parseDiscountFile(rawSheets, source)
}
