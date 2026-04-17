import { createAdminClient } from '@/lib/supabase/server'
import { getWeekDays, formatWeekRange } from '@/lib/utils'
import { HabitWithEntries, Profile } from '@/lib/types'
import WeeklyGrid from '@/components/WeeklyGrid'
import { Users, ListChecks, CheckSquare } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createAdminClient()
  const weekDays = getWeekDays()
  const startDate = weekDays[0].dateStr
  const endDate = weekDays[6].dateStr

  // Fetch all profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true })

  // Fetch all habits
  const { data: allHabits } = await supabase
    .from('habits')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  // Fetch this week's entries for all users
  const { data: allEntries } = await supabase
    .from('habit_entries')
    .select('*')
    .gte('completed_date', startDate)
    .lte('completed_date', endDate)

  const totalUsers = profiles?.length ?? 0
  const totalHabits = allHabits?.length ?? 0
  const totalCheckIns = allEntries?.length ?? 0

  // Group habits and entries by user
  const userRows = (profiles ?? []).map((profile: Profile) => {
    const habits = (allHabits ?? []).filter(h => h.user_id === profile.id)
    const habitsWithEntries: HabitWithEntries[] = habits.map(h => ({
      ...h,
      entries: (allEntries ?? []).filter(e => e.habit_id === h.id),
    }))
    return { profile, habitsWithEntries }
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm mt-0.5">{formatWeekRange(weekDays)}</p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-amber-400" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total users</p>
          </div>
          <p className="text-3xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <ListChecks className="w-4 h-4 text-amber-400" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active habits</p>
          </div>
          <p className="text-3xl font-bold">{totalHabits}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CheckSquare className="w-4 h-4 text-amber-400" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Check-ins this week</p>
          </div>
          <p className="text-3xl font-bold">{totalCheckIns}</p>
        </div>
      </div>

      {/* Per-user breakdown */}
      <div className="space-y-6">
        {userRows.map(({ profile, habitsWithEntries }) => (
          <div key={profile.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-semibold">
                {profile.email?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div>
                <p className="font-medium text-gray-200">{profile.email}</p>
                <p className="text-xs text-gray-500">
                  {habitsWithEntries.length} active habit{habitsWithEntries.length !== 1 ? 's' : ''}
                  {' · '}
                  <span className={profile.role === 'admin' ? 'text-amber-400' : 'text-gray-500'}>
                    {profile.role}
                  </span>
                </p>
              </div>
            </div>

            {habitsWithEntries.length === 0 ? (
              <p className="text-sm text-gray-600 italic">No active habits</p>
            ) : (
              <WeeklyGrid habits={habitsWithEntries} weekDays={weekDays} readOnly />
            )}
          </div>
        ))}

        {userRows.length === 0 && (
          <div className="text-center py-12 text-gray-500">No users yet.</div>
        )}
      </div>
    </div>
  )
}
