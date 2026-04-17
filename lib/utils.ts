import { WeekDay } from './types'

export function getWeekDays(referenceDate: Date = new Date()): WeekDay[] {
  const days: WeekDay[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Find Monday of current week
  const monday = new Date(referenceDate)
  const day = monday.getDay()
  const diff = day === 0 ? -6 : 1 - day
  monday.setDate(monday.getDate() + diff)
  monday.setHours(0, 0, 0, 0)

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)

    days.push({
      date,
      dateStr: toDateStr(date),
      label: labels[i],
      isToday: date.getTime() === today.getTime(),
    })
  }

  return days
}

export function toDateStr(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function formatWeekRange(days: WeekDay[]): string {
  const first = days[0].date
  const last = days[6].date
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
  return `${first.toLocaleDateString('en-US', opts)} – ${last.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`
}

export function calculateStreak(entries: string[], today: string): number {
  if (entries.length === 0) return 0

  const sorted = [...entries].sort().reverse()
  let streak = 0
  const current = new Date(today)

  for (const entry of sorted) {
    const expected = toDateStr(current)
    if (entry === expected) {
      streak++
      current.setDate(current.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
