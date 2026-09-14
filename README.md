# Analisador de Descontos

Aplicação web para comparar o desconto Fidelidade (praticado) e o desconto Limite (máximo
permitido) entre cidades e categorias, a partir de arquivos Excel/CSV enviados pelo usuário.

Todo o processamento acontece **no navegador** — os arquivos enviados nunca são transmitidos
para nenhum servidor.

## Como rodar

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — ambiente de desenvolvimento
- `npm run build` — build de produção
- `npm run test` — testes automatizados (Vitest)
- `npm run lint` — checagem de lint

## Estrutura do projeto

```
src/
  domain/        Regras de negócio puras (cálculo de GAP, classificação, tipos).
                 Sem dependência de React nem de I/O — é a camada mais testada.
  data/          Leitura e parsing dos arquivos (.xlsx/.xls/.csv) e mapeamento de colunas.
  validation/    Validação dos dados carregados (obrigatórios, duplicados, ausências)
                 e geração do relatório de qualidade.
  state/         Estado da aplicação (fluxo de telas, dados processados, filtros ativos).
  components/    Componentes de interface, organizados por área:
    upload/        Área de upload e validação dos arquivos.
    dashboard/      KPIs, gráficos, rankings, matriz cidade x categoria.
    common/         Componentes reutilizáveis (botões, cards, tooltips, tabela).
  config/        Valores configuráveis (formatos aceitos, aliases de coluna, limiares).
  export/        Geração dos relatórios exportáveis (.xlsx) a partir dos dados já processados.
```

Dado original enviado pelo usuário nunca é alterado. A normalização, validação e os cálculos
produzem sempre novas estruturas derivadas, mantendo o dado bruto como fonte de verdade.

## Privacidade

Os arquivos `.xlsx`/`.csv` de exemplo usados durante o desenvolvimento local ficam na raiz do
projeto, mas são ignorados pelo Git (`.gitignore`) — dados corporativos não são versionados.
