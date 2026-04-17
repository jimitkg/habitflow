'use client'

import { useState, useTransition } from 'react'
import { toggleEntry } from '@/app/actions/habits'
import { HabitWithEntries, WeekDay } from '@/lib/types'
import { toDateStr, calculateStreak } from '@/lib/utils'
import { Flame } from 'lucide-react'

interface WeeklyGridProps {
  habits: HabitWithEntries[]
  weekDays: WeekDay[]
  readOnly?: boolean
}

export default function WeeklyGrid({ habits, weekDays, readOnly = false }: WeeklyGridProps) {
  const [pending, startTransition] = useTransition()
  const today = toDateStr(new Date())

  function handleToggle(habitId: string, dateStr: string, isCompleted: boolean) {
    if (readOnly) return
    // Prevent toggling future dates
    if (dateStr > today) return
    startTransition(async () => { await toggleEntry(habitId, dateStr, isCompleted) })
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg mb-1">No habits yet</p>
        <p className="text-sm">Add your first habit to get started.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left pb-4 pr-4 text-sm font-medium text-gray-400 w-48">Habit</th>
            {weekDays.map((day) => (
              <th key={day.dateStr} className="pb-4 text-center w-12">
                <div className={`text-xs font-medium ${day.isToday ? 'text-indigo-400' : 'text-gray-500'}`}>
                  {day.label}
                </div>
                <div className={`text-lg font-semibold mt-0.5 ${day.isToday ? 'text-indigo-300' : 'text-gray-300'}`}>
                  {day.date.getDate()}
                </div>
              </th>
            ))}
            <th className="pb-4 pl-4 text-center text-sm font-medium text-gray-400 w-20">Streak</th>
            <th className="pb-4 pl-2 text-center text-sm font-medium text-gray-400 w-16">Week</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {habits.map((habit) => {
            const entryDates = habit.entries.map((e) => e.completed_date)
            const streak = calculateStreak(entryDates, today)
            const weekCompleted = weekDays.filter((d) => entryDates.includes(d.dateStr)).length
            const weekPercent = Math.round((weekCompleted / 7) * 100)

            return (
              <tr key={habit.id} className="group">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: habit.color }}
                    />
                    <div className="min-w-0">
                      <span className="text-sm font-medium text-gray-200 truncate max-w-[160px] block">
                        {habit.name}
                      </span>
                      {habit.description && (
                        <span className="text-xs text-gray-500 block">
                          {habit.description}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                {weekDays.map((day) => {
                  const isCompleted = entryDates.includes(day.dateStr)
                  const isFuture = day.dateStr > today
                  const isClickable = !readOnly && !isFuture

                  return (
                    <td key={day.dateStr} className="py-3 text-center">
                      <button
                        onClick={() => handleToggle(habit.id, day.dateStr, isCompleted)}
                        disabled={!isClickable || pending}
                        className={`
                          w-9 h-9 rounded-xl mx-auto flex items-center justify-center transition-all
                          ${isCompleted
                            ? 'text-white shadow-lg'
                            : isFuture
                              ? 'bg-gray-900 border border-gray-800 cursor-not-allowed opacity-30'
                              : 'bg-gray-800 border border-gray-700 hover:border-gray-500 cursor-pointer'
                          }
                          ${isClickable ? 'active:scale-90' : ''}
                        `}
                        style={isCompleted ? { backgroundColor: habit.color } : undefined}
                        aria-label={`${habit.name} ${day.dateStr} ${isCompleted ? 'completed' : 'not completed'}`}
                      >
                        {isCompleted && (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    </td>
                  )
                })}
                <td className="py-3 pl-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-orange-400' : 'text-gray-700'}`} />
                    <span className={`text-sm font-semibold ${streak > 0 ? 'text-orange-400' : 'text-gray-600'}`}>
                      {streak}
                    </span>
                  </div>
                </td>
                <td className="py-3 pl-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-400">{weekPercent}%</span>
                    <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${weekPercent}%`, backgroundColor: habit.color }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
