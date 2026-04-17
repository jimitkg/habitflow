import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Zap, LayoutDashboard, ListChecks, ShieldCheck, LogOut } from 'lucide-react'

interface NavbarProps {
  email: string
  isAdmin: boolean
}

export default function Navbar({ email, isAdmin }: NavbarProps) {
  return (
    <aside className="w-56 shrink-0 flex flex-col bg-gray-900 border-r border-gray-800 min-h-screen px-4 py-6">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-lg">HabitFlow</span>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </Link>
        <Link
          href="/habits"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ListChecks className="w-4 h-4" />
          My Habits
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-400 hover:bg-amber-950/30 hover:text-amber-300 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </Link>
        )}
      </nav>

      <div className="border-t border-gray-800 pt-4 mt-4">
        <p className="text-xs text-gray-500 px-3 mb-3 truncate">{email}</p>
        <form action={logout}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
