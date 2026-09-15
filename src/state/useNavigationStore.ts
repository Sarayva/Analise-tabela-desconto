import { create } from 'zustand'

export type AppSection =
  | 'upload'
  | 'visao-geral'
  | 'ranking-cidades'
  | 'analise-categoria'
  | 'matriz'
  | 'categorias-ausentes'
  | 'tabela-detalhada'

export interface SectionInfo {
  id: AppSection
  label: string
  description: string
}

export const APP_SECTIONS: SectionInfo[] = [
  { id: 'upload', label: 'Upload e validação', description: 'Arquivos, qualidade dos dados e lojas' },
  { id: 'visao-geral', label: 'Visão geral', description: 'KPIs e GAP médio por cidade' },
  { id: 'ranking-cidades', label: 'Ranking de cidades', description: 'Comparação entre cidades' },
  { id: 'analise-categoria', label: 'Análise por categoria', description: 'GAP por categoria' },
  { id: 'matriz', label: 'Matriz Cidade × Categoria', description: 'Heatmap e presença' },
  { id: 'categorias-ausentes', label: 'Categorias ausentes', description: 'Lacunas entre cidades' },
  { id: 'tabela-detalhada', label: 'Tabela detalhada', description: 'Todos os registros' },
]

interface NavigationState {
  activeSection: AppSection
  setActiveSection: (section: AppSection) => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeSection: 'upload',
  setActiveSection: (section) => set({ activeSection: section }),
}))
