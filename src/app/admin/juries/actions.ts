'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function createJury(formData: FormData) {
  const supabase = createAdminClient()
  
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  
  const slug = process.env.CLUB_SLUG || 'robotics.internal'
  const email = `${username}@${slug}`

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      username,
      full_name,
      role: 'jury'
    }
  })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/juries')
}

export async function assignJury(formData: FormData) {
  const supabase = createAdminClient()
  const jury_id = formData.get('jury_id') as string
  const competition_id = formData.get('competition_id') as string

  const { error } = await supabase.from('jury_assignments').insert({
    jury_id,
    competition_id
  })
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/juries')
}
