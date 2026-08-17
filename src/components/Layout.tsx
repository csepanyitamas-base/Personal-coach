import { NavLink, Outlet } from 'react-router-dom'
import { Dumbbell, Home, LineChart, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Kezdőlap', icon: Home, end: true },
  { to: '/terv', label: 'Tervem', icon: Dumbbell, end: false },
  { to: '/elorehaladas', label: 'Haladás', icon: LineChart, end: false },
  { to: '/beallitasok', label: 'Beállítások', icon: Settings, end: false },
]

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-[#f5f4fb] dark:bg-[#0f1117]">
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-black/5 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-slate-900/90">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`
              }
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
