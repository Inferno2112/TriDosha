import { Sidebar } from './Sidebar'

export function AppShell({ children, contentClassName = '' }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#ecfdf5_0%,#f8fafc_40%,#ffffff_100%)]">
      <Sidebar />
      <main className="ml-[72px] flex min-h-screen flex-col transition-[margin] duration-300 lg:ml-[260px]">
        <div className={contentClassName || 'flex-1'}>{children}</div>
      </main>
    </div>
  )
}
