'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCompetition(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const theme = formData.get('theme') as string
  const age_group = formData.get('age_group') as string
  const event_date = formData.get('event_date') as string

  const { data, error } = await supabase.from('competitions').insert({
    name,
    theme,
    age_group,
    event_date: event_date || null,
    created_by: user.id
  }).select().single()

  if (error) throw new Error(error.message)

  revalidatePath('/admin/competitions')
  redirect(`/admin/competitions/${data.id}`)
}

export async function createCriterion(competitionId: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const max_score = parseInt(formData.get('max_score') as string)
  const weight = parseFloat(formData.get('weight') as string)

  const { error } = await supabase.from('scoring_criteria').insert({
    competition_id: competitionId,
    name,
    description,
    max_score,
    weight,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/competitions/${competitionId}`)
  redirect(`/admin/competitions/${competitionId}`)
}
