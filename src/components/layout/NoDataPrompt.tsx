import { useNavigationStore } from '../../state/useNavigationStore'

/** Estado explícito para quando o usuário navega para uma tela de análise antes de enviar os arquivos. */
export function NoDataPrompt() {
  const setActiveSection = useNavigationStore((state) => state.setActiveSection)

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-10 text-center">
      <p className="text-sm font-medium text-slate-700">Envie os arquivos de Fidelidade e Limite primeiro.</p>
      <p className="mt-1 text-xs text-slate-500">
        Essa análise depende dos dois arquivos processados na tela de upload.
      </p>
      <button
        type="button"
        onClick={() => setActiveSection('upload')}
        className="mt-4 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Ir para Upload e validação
      </button>
    </div>
  )
}
