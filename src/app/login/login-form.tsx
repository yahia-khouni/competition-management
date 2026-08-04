'use client'

import { useState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="username" className="text-muted-foreground uppercase tracking-wider text-xs font-mono">Operator ID</Label>
        <Input 
          id="username" 
          name="username" 
          type="text" 
          required 
          autoFocus 
          className="bg-black/20 border-primary/20 focus:border-primary focus:ring-primary/50 font-mono transition-all duration-300"
          placeholder="ENTER IDENTIFIER"
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="password" className="text-muted-foreground uppercase tracking-wider text-xs font-mono">Passcode</Label>
        <Input 
          id="password" 
          name="password" 
          type="password" 
          required 
          className="bg-black/20 border-primary/20 focus:border-primary focus:ring-primary/50 font-mono transition-all duration-300"
          placeholder="••••••••"
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 p-2 rounded text-center">{error}</p>}
      <Button type="submit" className="w-full h-12 uppercase tracking-widest font-bold font-mono border border-primary hover:bg-primary/90 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.4)]" disabled={loading}>
        {loading ? 'Authenticating...' : 'Initialize'}
      </Button>
    </form>
  )
}
