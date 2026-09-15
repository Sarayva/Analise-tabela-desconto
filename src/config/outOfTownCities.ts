/** As 10 cidades cobertas pelos arquivos de desconto "lojas de fora" — usado para distinguir uma tabela de cidade legítima de uma tabela de Maringá (ou de outra origem) atribuída por engano. */
export const OUT_OF_TOWN_CITIES = [
  'Loanda',
  'Jandaia',
  'Mandaguari',
  'Marialva',
  'Paiçandu',
  'Paranavai',
  'Porto Rico',
  'Sarandi',
  'Tapejara',
  'Terra Boa',
] as const

/**
 * Códigos que aparecem na tabela de lojas dos arquivos de desconto mas não
 * são lojas de verdade (ex.: CNPJ principal usado como código por engano).
 * Ignorados em toda a análise de atribuição de loja.
 */
export const IGNORED_STORE_CODES = [1001] as const
