import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getWeekDays, formatWeekRange, toDateStr } from '@/lib/utils'
import { HabitWithEntries } from '@/lib/types'
import WeeklyGrid from '@/components/WeeklyGrid'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const weekDays = getWeekDays()
  const startDate = weekDays[0].dateStr
  const endDate = weekDays[6].dateStr

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  const { data: entries } = await supabase
    .from('habit_entries')
    .select('*')
    .eq('user_id', user.id)
    .gte('completed_date', startDate)
    .lte('completed_date', endDate)

  const habitsWithEntries: HabitWithEntries[] = (habits ?? []).map((h) => ({
    ...h,
    entries: (entries ?? []).filter((e) => e.habit_id === h.id),
  }))

  const today = toDateStr(new Date())
  const completedToday = (entries ?? []).filter(e => e.completed_date === today).length
  const totalActive = habits?.length ?? 0
  const totalCompleted = (entries ?? []).length
  const weekTotal = totalActive * 7
  const weekPercent = weekTotal > 0 ? Math.round((totalCompleted / weekTotal) * 100) : 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Weekly Overview</h1>
          <p className="text-gray-400 text-sm mt-0.5">{formatWeekRange(weekDays)}</p>
        </div>
        <Link
          href="/habits"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add habit
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Today</p>
          <p className="text-3xl font-bold">
            {completedToday}
            <span className="text-gray-600 text-xl font-normal">/{totalActive}</span>
          </p>
          <p className="text-sm text-gray-400 mt-0.5">habits done</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">This week</p>
          <p className="text-3xl font-bold">
            {totalCompleted}
            <span className="text-gray-600 text-xl font-normal">/{weekTotal}</span>
          </p>
          <p className="text-sm text-gray-400 mt-0.5">check-ins</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Week score</p>
          <p className="text-3xl font-bold">{weekPercent}%</p>
          <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${weekPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Weekly grid */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <WeeklyGrid habits={habitsWithEntries} weekDays={weekDays} />
      </div>
    </div>
  )
}
