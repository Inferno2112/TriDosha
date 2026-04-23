import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { cn } from '../utils/cn'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    {
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
    },
    {
      label: 'AI Chat',
      icon: '💬',
      path: '/chat',
    },
    {
      label: 'Symptoms',
      icon: '🩺',
      path: '/symptoms',
    },
    {
      label: 'Reports',
      icon: '📋',
      path: '/reports',
    },
    {
      label: 'History',
      icon: '📜',
      path: '/history',
    },
    {
      label: 'Settings',
      icon: '⚙️',
      path: '/settings',
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className={cn(
      'fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-lg transition-all duration-300',
      isOpen ? 'w-64' : 'w-20'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 p-4">
        {isOpen && <h1 className="text-xl font-bold">TriDosha</h1>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 hover:bg-slate-700"
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="space-y-2 p-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-4 py-3 transition-colors',
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Logout Button */}
      <div className="border-t border-slate-700 p-4">
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition-colors hover:bg-slate-700',
            !isOpen && 'justify-center'
          )}
        >
          <span className="text-xl">🚪</span>
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  )
}
