import { useStoreOverridesStore } from '../../state/useStoreOverridesStore'
import type { StoreAssignmentProblem } from '../../validation/findStoreAssignmentProblems'

interface StoreAssignmentAlertProps {
  problems: StoreAssignmentProblem[]
  availableTabelas: string[]
}

/**
 * Alerta de erro (não um aviso neutro): uma loja atribuída à tabela errada
 * afeta diretamente o cálculo de GAP daquela cidade/tabela. Permite corrigir
 * na hora, escolhendo a tabela certa — a correção fica só nesta análise, os
 * arquivos originais nunca são alterados.
 */
export function StoreAssignmentAlert({ problems, availableTabelas }: StoreAssignmentAlertProps) {
  const overrides = useStoreOverridesStore((state) => state.overrides)
  const setOverride = useStoreOverridesStore((state) => state.setOverride)
  const clearOverride = useStoreOverridesStore((state) => state.clearOverride)

  const correctedEntries = Object.entries(overrides)

  if (problems.length === 0 && correctedEntries.length === 0) return null

  return (
    <div className="flex flex-col gap-4">
      {problems.length > 0 && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-5">
          <h2 className="flex items-center gap-2 text-base font-semibold text-red-800">
            <span aria-hidden="true">⚠</span>
            {problems.length} loja(s) com tabela de desconto incorreta
          </h2>
          <p className="mt-1 text-sm text-red-700">
            Essas lojas estão atribuídas a mais de uma tabela de desconto, ou a uma tabela
            diferente da cidade real da loja. Escolha a tabela correta para cada uma — a correção
            fica só nesta análise, o arquivo original não é alterado.
          </p>

          <div className="mt-3 overflow-x-auto rounded-md border border-red-200 bg-white">
            <table className="min-w-full divide-y divide-red-100 text-left text-sm">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-3 py-2 font-medium text-red-800">Loja</th>
                  <th className="px-3 py-2 font-medium text-red-800">Cidade real</th>
                  <th className="px-3 py-2 font-medium text-red-800">Atribuída a</th>
                  <th className="px-3 py-2 font-medium text-red-800">Tabela correta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-100">
                {problems.map((problem) => (
                  <tr key={problem.storeCode}>
                    <td className="px-3 py-2 text-slate-700">
                      {problem.storeCode} — {problem.storeName}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {problem.expectedCity ?? (
                        <span className="text-amber-700">não consta na lista oficial</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-slate-700">{problem.assignedTabelas.join(', ')}</td>
                    <td className="px-3 py-2">
                      <select
                        defaultValue=""
                        onChange={(event) => {
                          if (event.target.value) setOverride(problem.storeCode, event.target.value)
                        }}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700"
                      >
                        <option value="" disabled>
                          Selecionar...
                        </option>
                        {availableTabelas.map((tabela) => (
                          <option key={tabela} value={tabela}>
                            {tabela}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {correctedEntries.length > 0 && (
        <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
            <span aria-hidden="true">✓</span>
            {correctedEntries.length} loja(s) corrigida(s) manualmente
          </h2>
          <ul className="mt-2 flex flex-col gap-1 text-sm">
            {correctedEntries.map(([code, tabela]) => (
              <li key={code} className="flex items-center justify-between border-b border-emerald-100 py-1">
                <span className="text-slate-700">
                  Loja {code} → <span className="font-medium">{tabela}</span>
                </span>
                <button
                  type="button"
                  onClick={() => clearOverride(Number(code))}
                  className="text-xs text-emerald-700 hover:underline"
                >
                  Desfazer
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
