import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { PageHeader } from '../components/PageHeader'

function Result() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <PageHeader
        eyebrow="Your dosha snapshot"
        title="Result"
        description="Your latest assessment summary will live here."
      />
      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {DOSHAS.map((dosha) => (
            <article
              key={dosha.name}
              className="rounded-2xl border border-emerald-100/70 bg-white/85 p-6 shadow-sm ring-1 ring-black/[0.02] backdrop-blur-sm"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${dosha.accent} text-white`}
                  aria-hidden="true"
                >
                  {dosha.glyph}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Unmeasured
                </span>
              </div>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-slate-900">
                {dosha.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {dosha.description}
              </p>
              <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-0 rounded-full bg-emerald-500 transition-all" />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Complete an assessment to see your balance.
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-emerald-200 bg-white/70 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No assessment yet
          </h2>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Ask TriDosha AI about your symptoms and lifestyle, and your dosha
            balance and recommendations will appear on this page.
          </p>
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            Begin an assessment
          </button>
        </div>
      </section>
    </AppShell>
  )
}

const DOSHAS = [
  {
    name: 'Vata',
    glyph: '◐',
    accent: 'bg-sky-500',
    description:
      'Air & ether. Governs movement, breath, and nervous system activity.',
  },
  {
    name: 'Pitta',
    glyph: '◉',
    accent: 'bg-amber-500',
    description:
      'Fire & water. Governs digestion, metabolism, and transformation.',
  },
  {
    name: 'Kapha',
    glyph: '◎',
    accent: 'bg-emerald-600',
    description:
      'Earth & water. Governs structure, stability, and immunity.',
  },
]

export default Result
