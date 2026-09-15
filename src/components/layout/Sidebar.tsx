import { APP_SECTIONS, useNavigationStore } from '../../state/useNavigationStore'

export function Sidebar() {
  const activeSection = useNavigationStore((state) => state.activeSection)
  const setActiveSection = useNavigationStore((state) => state.setActiveSection)

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-5">
        <h1 className="text-base font-semibold text-slate-900">Analisador de Descontos</h1>
        <p className="mt-1 text-xs text-slate-500">Fidelidade × Limite por cidade e categoria</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {APP_SECTIONS.map((section) => {
          const isActive = section.id === activeSection
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`rounded-md px-3 py-2 text-left text-sm transition-colors ${
                isActive ? 'bg-slate-800 text-white' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="block font-medium">{section.label}</span>
              <span className={`block text-xs ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                {section.description}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 px-5 py-3 text-xs text-slate-400">v{__APP_VERSION__}</div>
    </aside>
  )
}
