export interface CupomStoreInfo {
  code: number
  label: string
  /** Cidade correspondente, na mesma grafia usada nos arquivos de desconto. `null` = loja fora do escopo "lojas de fora". */
  city: string | null
}

/**
 * Mapa Código de Filial -> Loja/Cidade, portado do projeto Relatorio-Cupons
 * (fonte: js/overview.js, STORE_MAP). A rede de cupons cobre bem mais lojas
 * do que as 10 "lojas de fora" analisadas aqui — só essas têm `city`
 * preenchida; o restante fica `null` e é tratado como fora do escopo, nunca
 * descartado silenciosamente.
 */
export const CUPOM_STORE_MAP: Record<number, CupomStoreInfo> = {
  2: { code: 2, label: '002 - CERRO AZUL', city: null },
  3: { code: 3, label: '003 - BORBA GATO', city: null },
  4: { code: 4, label: '004 - OPERÁRIA', city: null },
  6: { code: 6, label: '006 - 24HORAS', city: null },
  7: { code: 7, label: '007 - PEDRO TAQUES', city: null },
  8: { code: 8, label: '008 - SARANDI', city: 'Sarandi' },
  9: { code: 9, label: '009 - PRAÇA', city: null },
  10: { code: 10, label: '010 - TEIXEIRA MENDES', city: null },
  11: { code: 11, label: '011 - MANDACARU', city: null },
  12: { code: 12, label: '012 - FARROUPILHA', city: null },
  13: { code: 13, label: '013 - H.U.', city: null },
  14: { code: 14, label: '014 - MORANGUEIRA', city: null },
  15: { code: 15, label: '015 - GETULIO VARGAS', city: null },
  16: { code: 16, label: '016 - PIÇANDU 1', city: 'Paiçandu' },
  17: { code: 17, label: '017 - TUIUTI', city: null },
  18: { code: 18, label: '018 - SOUZA NAVES', city: null },
  19: { code: 19, label: '019 - PALMARES', city: null },
  20: { code: 20, label: '020 - DUBAI', city: null },
  28: { code: 28, label: '028 - NEY BRAGA', city: null },
  31: { code: 31, label: '031 - SARANDI 2', city: 'Sarandi' },
  32: { code: 32, label: '032 - CIDADE ALTA', city: null },
  33: { code: 33, label: '033 - KAKOGAWA', city: null },
  35: { code: 35, label: '035 - MUFFATO', city: null },
  36: { code: 36, label: '036 - SARANDI 3 DRIVE', city: 'Sarandi' },
  37: { code: 37, label: '037 - SARANDI 4 UPA', city: 'Sarandi' },
  38: { code: 38, label: '038 - BOM JARDIM', city: null },
  39: { code: 39, label: '039 - MARIALVA', city: 'Marialva' },
  40: { code: 40, label: '040 - PARANÁ', city: null },
  41: { code: 41, label: '041 - GASTAO VIDIGAL', city: null },
  42: { code: 42, label: '042 - MANDAGUARI', city: 'Mandaguari' },
  43: { code: 43, label: '043 - TERRA BOA', city: 'Terra Boa' },
  44: { code: 44, label: '044 - SARANDI 5 MARANGONI', city: 'Sarandi' },
  45: { code: 45, label: '045 - CAMPO MOURÃO', city: null },
  46: { code: 46, label: '046 - MARIALVA 2 HAMADA', city: 'Marialva' },
  47: { code: 47, label: '047 - PIÇANDU 2 CANCAO', city: 'Paiçandu' },
  48: { code: 48, label: '048 - TAPEJARA', city: 'Tapejara' },
  49: { code: 49, label: '049 - JANDAIA DO SUL', city: 'Jandaia' },
  50: { code: 50, label: '050 - SOMACO', city: null },
  51: { code: 51, label: '051 - FIM DA PICADA', city: null },
  52: { code: 52, label: '052 - MUFFATO 2 JOÃO PAULINO', city: null },
  53: { code: 53, label: '053 - PORTO RICO', city: 'Porto Rico' },
  54: { code: 54, label: '054 - ITAIPU', city: null },
  55: { code: 55, label: '055 - LOANDA', city: 'Loanda' },
  56: { code: 56, label: '056 - PARANAVAÍ', city: 'Paranavai' },
  57: { code: 57, label: '057 - BOLA DE NEVE', city: null },
  59: { code: 59, label: '059 - NILO RIBEIRO', city: null },
  60: { code: 60, label: '060 - AV SÃO PAULO', city: null },
}
