import { UploadScreen } from './components/upload/UploadScreen'

function App() {
  return (
    <div className="min-h-svh bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <h1 className="text-xl font-semibold">Analisador de Descontos</h1>
          <p className="text-sm text-slate-500">
            Compare o desconto Fidelidade e o desconto Limite entre cidades e categorias.
          </p>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-12">
        <UploadScreen />
      </main>
    </div>
  )
}

export default App
