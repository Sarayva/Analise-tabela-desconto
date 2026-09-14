import { useFilterStore } from '../../state/useFilterStore'

/** Estado explícito para quando os filtros ativos não deixam nenhum registro — nunca uma tela em branco sem explicação. */
export function NoFilteredResults() {
  const reset = useFilterStore((state) => state.reset)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
      <p className="text-sm font-medium text-slate-700">Nenhum registro encontrado para os filtros selecionados.</p>
      <p className="mt-1 text-xs text-slate-500">Tente ajustar ou limpar os filtros para ver os dados novamente.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-3 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
      >
        Limpar filtros
      </button>
    </div>
  )
}
