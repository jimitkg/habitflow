'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { deleteHabit, archiveHabit } from '@/app/actions/habits'
import { Habit } from '@/lib/types'
import HabitModal from '@/components/HabitModal'
import { Plus, Pencil, Trash2, Archive, ArchiveRestore } from 'lucide-react'

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Habit | undefined>()
  const [showArchived, setShowArchived] = useState(false)
  const [loading, setLoading] = useState(true)

  async function loadHabits() {
    const supabase = createClient()
    const { data } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true })
    setHabits(data ?? [])
    setLoading(false)
  }

  useEffect(() => { loadHabits() }, [])

  function openEdit(habit: Habit) {
    setEditing(habit)
    setShowModal(true)
  }

  function openNew() {
    setEditing(undefined)
    setShowModal(true)
  }

  function closeModal() {
    setShowModal(false)
    setEditing(undefined)
    loadHabits()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this habit and all its history?')) return
    await deleteHabit(id)
    loadHabits()
  }

  async function handleArchive(id: string, isActive: boolean) {
    await archiveHabit(id, !isActive)
    loadHabits()
  }

  const active = habits.filter(h => h.is_active)
  const archived = habits.filter(h => !h.is_active)
  const displayed = showArchived ? archived : active

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Habits</h1>
          <p className="text-gray-400 text-sm mt-0.5">{active.length} active · {archived.length} archived</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowArchived(v => !v)}
            className="px-4 py-2 border border-gray-700 rounded-xl text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
          >
            {showArchived ? 'Show active' : 'Show archived'}
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            New habit
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-16">Loading…</div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          {showArchived ? 'No archived habits.' : (
            <>
              <p className="text-lg mb-1">No habits yet</p>
              <p className="text-sm">Click "New habit" to get started.</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((habit) => (
            <div
              key={habit.id}
              className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4"
            >
              <div
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: habit.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-200 truncate">{habit.name}</p>
                {habit.description && (
                  <p className="text-sm text-gray-500 truncate mt-0.5">{habit.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {habit.is_active && (
                  <button
                    onClick={() => openEdit(habit)}
                    className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleArchive(habit.id, habit.is_active)}
                  className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                  title={habit.is_active ? 'Archive' : 'Restore'}
                >
                  {habit.is_active ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <HabitModal habit={editing} onClose={closeModal} />
      )}
    </div>
  )
}
