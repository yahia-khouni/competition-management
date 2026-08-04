'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTeam(competitionId: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const robot_name = formData.get('robot_name') as string

  const { error } = await supabase.from('teams').insert({
    competition_id: competitionId,
    name,
    robot_name,
  })

  if (error) throw new Error(error.message)

  revalidatePath(`/admin/competitions/${competitionId}/teams`)
  redirect(`/admin/competitions/${competitionId}/teams`)
}
