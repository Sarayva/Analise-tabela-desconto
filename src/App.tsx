import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/dashboard/Dashboard'
import { NoDataPrompt } from './components/layout/NoDataPrompt'
import { UploadScreen } from './components/upload/UploadScreen'
import { useAnalysisData } from './state/useAnalysisData'
import { useNavigationStore } from './state/useNavigationStore'

function App() {
  const activeSection = useNavigationStore((state) => state.activeSection)
  const { records } = useAnalysisData()

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl px-6 py-8">
          {activeSection === 'upload' ? (
            <UploadScreen />
          ) : records ? (
            <Dashboard records={records} activeSection={activeSection} />
          ) : (
            <NoDataPrompt />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
