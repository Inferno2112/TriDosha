import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { PageHeader } from '../components/PageHeader'

function History() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <PageHeader
        eyebrow="Your timeline"
        title="History"
        description="Past chats and assessments will appear here."
      />
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-emerald-200 bg-white/70 px-6 py-16 text-center shadow-sm">
          <div
            aria-hidden="true"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 12a9 9 0 1 0 3-6.7" />
              <path d="M3 4v5h5" />
              <path d="M12 7v5l3 2" />
            </svg>
          </div>
          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            No history yet
          </h2>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Start a conversation with TriDosha AI and your past sessions will
            show up here for quick reference.
          </p>
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Start a new chat
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m13 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </AppShell>
  )
}

export default History
