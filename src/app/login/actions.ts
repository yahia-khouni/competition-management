'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const slug = process.env.CLUB_SLUG || 'robotics.internal'
  
  const email = username.includes('@') ? username : `${username}@${slug}`

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Invalid login credentials' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
