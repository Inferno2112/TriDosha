import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { cn } from '../utils/cn'

function readUserEmail() {
  if (typeof window === 'undefined') return ''
  try {
    const user = JSON.parse(window.localStorage.getItem('user') || '{}')
    return typeof user?.email === 'string' ? user.email : ''
  } catch {
    return ''
  }
}

const PRIMARY_NAV = [
  { label: 'Chat', path: '/chat', icon: IconChat },
  { label: 'History', path: '/history', icon: IconHistory },
  { label: 'Result', path: '/result', icon: IconResult },
]

const SECONDARY_NAV = [
  { label: 'Settings', path: '/settings', icon: IconSettings },
]

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.innerWidth >= 1024
  })
  const [userEmail] = useState(readUserEmail)

  const isActive = (path) =>
    location.pathname === path || (path === '/chat' && location.pathname === '/')

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-emerald-100/70 bg-white/85 backdrop-blur-xl transition-[width] duration-300',
        isOpen ? 'w-[260px]' : 'w-[72px]',
      )}
    >
      <div
        className={cn(
          'flex items-center border-b border-emerald-100/60 px-3 py-4',
          isOpen ? 'justify-between' : 'justify-center',
        )}
      >
        {isOpen ? (
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="rounded-lg px-1 py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
            aria-label="Go to chat"
          >
            <Logo />
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? <IconSidebarCollapse /> : <IconSidebarExpand />}
        </button>
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {PRIMARY_NAV.map((item) => (
            <li key={item.path}>
              <NavButton
                item={item}
                active={isActive(item.path)}
                collapsed={!isOpen}
                onClick={() => navigate(item.path)}
              />
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-emerald-100/60 px-3 py-4">
        <ul className="space-y-1">
          {SECONDARY_NAV.map((item) => (
            <li key={item.path}>
              <NavButton
                item={item}
                active={isActive(item.path)}
                collapsed={!isOpen}
                onClick={() => navigate(item.path)}
              />
            </li>
          ))}
        </ul>
        {isOpen && userEmail ? (
          <div
            className="mt-3 flex items-center gap-3 rounded-xl bg-emerald-50/70 px-3 py-2.5 ring-1 ring-emerald-100"
            title={userEmail}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
              {userEmail.slice(0, 1).toUpperCase() || 'U'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-slate-800">
                {userEmail}
              </p>
              <p className="text-[11px] text-slate-500">Signed in</p>
            </div>
          </div>
        ) : null}
      </div>
    </aside>
  )
}

function NavButton({ item, active, collapsed, onClick }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition',
        active
          ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100'
          : 'text-slate-600 hover:bg-emerald-50/60 hover:text-emerald-800',
        collapsed && 'justify-center px-0',
      )}
    >
      <Icon
        className={cn(
          'h-[18px] w-[18px] shrink-0 transition',
          active ? 'text-emerald-700' : 'text-slate-500 group-hover:text-emerald-700',
        )}
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </button>
  )
}

function IconChat({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12a8 8 0 0 1-11.5 7.18L4 20l.82-5.5A8 8 0 1 1 21 12Z" />
    </svg>
  )
}

function IconHistory({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}

function IconResult({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 19V6a2 2 0 0 1 2-2h9l5 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M14 4v5h5" />
      <path d="m8 13 2.5 2.5L16 10" />
    </svg>
  )
}

function IconSettings({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
    </svg>
  )
}

function IconSidebarCollapse() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="m15 10-2 2 2 2" />
    </svg>
  )
}

function IconSidebarExpand() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M9 4v16" />
      <path d="m13 10 2 2-2 2" />
    </svg>
  )
}
