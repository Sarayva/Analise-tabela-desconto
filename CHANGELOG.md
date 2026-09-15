# Changelog

Todas as mudanças relevantes do projeto ficam documentadas aqui. O formato
segue livremente o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/);
o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [1.1.0] - 2026-09-15

### Adicionado
- Upload de mais de um arquivo por campo (Fidelidade/Limite), permitindo somar
  "lojas de fora" e tabelas adicionais (ex.: Maringá) numa mesma análise.
- Leitura da tabela auxiliar de lojas (Código + Nome da filial) embutida nos
  arquivos de desconto, e da lista oficial de lojas (`.txt`, código/nome/cidade).
- Validação cruzada de atribuição de loja: aponta lojas atribuídas a mais de
  uma tabela de desconto, ou a uma tabela diferente da cidade real segundo a
  lista oficial.
- Correção manual da tabela de uma loja diretamente pelo dashboard (não altera
  os arquivos originais; fica salva no navegador).
- Navegação por menu lateral, substituindo a rolagem única por 7 telas
  (Upload, Visão geral, Ranking de cidades, Análise por categoria, Matriz,
  Categorias ausentes, Tabela detalhada).
- Leitor do relatório de cupons (vendas com desconto excepcional) — ainda não
  conectado à tela, preparação para o cruzamento com o GAP de desconto.
- Número da versão visível no rodapé do menu lateral.

### Corrigido
- Comparação de nome de cidade na validação de loja não reconhecia variações
  como "Paranavaí" x "Paranavai" (acento) ou "Jandaia do Sul" x "Jandaia"
  (forma completa x abreviada), gerando falsos positivos.

## [1.0.0] - 2026-09-14

### Adicionado
- Upload dos arquivos de Desconto Fidelidade e Desconto Limite com detecção e
  mapeamento automático de colunas.
- Validação cruzada dos dois arquivos: duplicados, campos ausentes, percentuais
  fora da faixa, combinações Cidade + Categoria presentes em só um arquivo,
  cidades com grafia divergente.
- Cálculo do GAP (Limite − Fidelidade) e classificação em Inconsistência / Sem
  espaço adicional / Regular.
- Dashboard com KPIs, gráfico de GAP médio por cidade, ranking de cidades e
  análise por categoria.
- Matriz Cidade × Categoria (heatmap de Fidelidade, Limite, GAP e presença) e
  análise de categorias ausentes por cidade.
- Filtros globais (Cidade, Categoria, Situação) com drill-down e navegação por
  breadcrumb.
- Tabela detalhada com busca, ordenação e paginação.
- Exportação para Excel (dados filtrados, ranking de cidades, ranking de
  categorias, inconsistências) em um único arquivo com várias abas.
- Publicação via GitHub Pages, 100% client-side — nenhum arquivo enviado pelo
  usuário sai do navegador.
