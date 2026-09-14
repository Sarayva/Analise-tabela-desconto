# Analisador de Descontos

Aplicação web para comparar o desconto Fidelidade (praticado) e o desconto Limite (máximo
permitido) entre cidades e categorias, a partir de arquivos Excel/CSV enviados pelo usuário.

Todo o processamento acontece **no navegador** — os arquivos enviados nunca são transmitidos
para nenhum servidor.

**Publicado em:** https://sarayva.github.io/Analise-tabela-desconto/

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

## Publicação

O site é publicado via GitHub Pages, servido a partir da branch `gh-pages` (só os arquivos
compilados, gerados por `npm run build`).

**Para publicar uma atualização:**

```bash
npm run build
git worktree add --orphan -b gh-pages /tmp/gh-pages-deploy   # se a branch ainda não existir localmente
cp -r dist/. /tmp/gh-pages-deploy/
touch /tmp/gh-pages-deploy/.nojekyll
cd /tmp/gh-pages-deploy && git add -A && git commit -m "deploy: atualização" && git push
```

Existe um workflow do GitHub Actions pronto em `.github/workflows/deploy.yml` (ainda não
enviado ao repositório — o token usado na configuração inicial não tinha a permissão
`workflow` do GitHub). Para automatizar o deploy a cada push na `main`:

1. Rode `gh auth refresh -h github.com -s workflow` (ou adicione o arquivo manualmente pela
   interface do GitHub, em Actions → New workflow).
2. Depois disso, `git add .github && git commit -m "ci: workflow de deploy" && git push`.
3. A partir daí, todo push na `main` builda, testa e publica automaticamente — não é mais
   necessário repetir os passos manuais acima.
