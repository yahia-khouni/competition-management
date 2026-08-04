'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitScores(competitionId: string, teamId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const criteriaKeys = Array.from(formData.keys()).filter(k => k.startsWith('score_'))
  
  for (const key of criteriaKeys) {
    const criterionId = key.replace('score_', '')
    const scoreVal = formData.get(key)
    if (!scoreVal) continue
    
    const { error } = await supabase.from('scores').upsert({
      jury_id: user.id,
      team_id: teamId,
      criterion_id: criterionId,
      score: Number(scoreVal),
    }, { onConflict: 'jury_id, team_id, criterion_id' })

    if (error) {
      console.error(error)
      throw new Error('Failed to save scores')
    }
  }

  revalidatePath(`/jury/${competitionId}`)
  revalidatePath(`/jury/${competitionId}/teams/${teamId}`)
  redirect(`/jury/${competitionId}/teams/${teamId}?success=true`)
}
