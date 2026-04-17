export type Role = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  role: Role
  created_at: string
}

export interface Habit {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  is_active: boolean
  created_at: string
}

export interface HabitEntry {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  created_at: string
}

export interface HabitWithEntries extends Habit {
  entries: HabitEntry[]
}

export interface WeekDay {
  date: Date
  dateStr: string
  label: string
  isToday: boolean
}
