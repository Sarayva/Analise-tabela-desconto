/**
 * Estados possíveis do fluxo da aplicação, do upload até a análise pronta.
 * Cada estado corresponde a uma tela distinta (ver item 21 do escopo do produto).
 */
export type AppState =
  | 'sem_arquivos'
  | 'arquivos_selecionados'
  | 'validando'
  | 'erro_validacao'
  | 'processando'
  | 'analise_pronta'
