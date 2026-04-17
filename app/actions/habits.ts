'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { toDateStr } from '@/lib/utils'

export async function createHabit(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name: formData.get('name') as string,
    description: formData.get('description') as string || null,
    color: formData.get('color') as string || '#6366f1',
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/habits')
}

export async function updateHabit(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('habits')
    .update({
      name: formData.get('name') as string,
      description: formData.get('description') as string || null,
      color: formData.get('color') as string,
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/habits')
}

export async function deleteHabit(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/habits')
}

export async function archiveHabit(id: string, isActive: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('habits')
    .update({ is_active: isActive })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  revalidatePath('/habits')
}

export async function toggleEntry(habitId: string, dateStr: string, isCompleted: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  if (isCompleted) {
    await supabase
      .from('habit_entries')
      .delete()
      .eq('habit_id', habitId)
      .eq('user_id', user.id)
      .eq('completed_date', dateStr)
  } else {
    await supabase
      .from('habit_entries')
      .insert({ habit_id: habitId, user_id: user.id, completed_date: dateStr })
  }

  revalidatePath('/dashboard')
}
