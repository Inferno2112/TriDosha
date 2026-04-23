import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { PageHeader } from '../components/PageHeader'

function readUserEmail() {
  if (typeof window === 'undefined') return ''
  try {
    const user = JSON.parse(window.localStorage.getItem('user') || '{}')
    return typeof user?.email === 'string' ? user.email : ''
  } catch {
    return ''
  }
}

function Settings() {
  const navigate = useNavigate()
  const [userEmail] = useState(readUserEmail)

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage your account and TriDosha AI preferences."
      />
      <section className="mx-auto max-w-3xl space-y-6 px-6 py-10 lg:px-10">
        <Panel title="Account" description="Your signed-in identity.">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white">
              {userEmail.slice(0, 1).toUpperCase() || 'U'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">
                {userEmail || 'Not signed in'}
              </p>
              <p className="text-xs text-slate-500">Demo account</p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Appearance"
          description="TriDosha currently uses a clean light theme tuned for readability."
        >
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-slate-900">Theme</p>
              <p className="text-xs text-slate-500">Light — system default</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 ring-1 ring-emerald-100">
              Default
            </span>
          </div>
        </Panel>

        <Panel
          title="Session"
          description="Sign out of this device."
          tone="danger"
        >
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:border-red-300 hover:bg-red-50"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Log out
          </button>
        </Panel>
      </section>
    </AppShell>
  )
}

function Panel({ title, description, children, tone = 'default' }) {
  return (
    <div
      className={
        'rounded-2xl border bg-white/85 p-6 shadow-sm ring-1 ring-black/[0.02] backdrop-blur-sm ' +
        (tone === 'danger'
          ? 'border-red-100'
          : 'border-emerald-100/70')
      }
    >
      <div className="mb-4">
        <h2 className="text-sm font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  )
}

export default Settings
