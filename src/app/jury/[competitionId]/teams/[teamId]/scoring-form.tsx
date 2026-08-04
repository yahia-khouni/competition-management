'use client'

import { useState } from 'react'
import { submitScores } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type Criterion = {
  id: string
  name: string
  description: string | null
  max_score: number
  weight: number
}

type Score = {
  criterion_id: string
  score: number
  notes: string | null
}

export function ScoringForm({ 
  teamId, 
  competitionId, 
  criteria, 
  existingScores 
}: { 
  teamId: string
  competitionId: string
  criteria: Criterion[]
  existingScores: Score[] 
}) {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    await submitScores(teamId, competitionId, formData)
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {criteria.map(c => {
        const existingScore = existingScores.find(s => s.criterion_id === c.id)
        return (
          <div key={c.id} className="p-5 rounded-lg border border-border/50 bg-black/20 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <Label className="text-lg font-bold text-foreground font-mono tracking-wider">{c.name}</Label>
                {c.description && <p className="text-sm text-muted-foreground mt-1">{c.description}</p>}
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest block mb-1">Max Score</span>
                <span className="text-xl font-bold text-primary font-mono">{c.max_score}</span>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-4">
              <div className="md:col-span-1 space-y-2">
                <Label htmlFor={`score_${c.id}`} className="text-xs uppercase font-mono tracking-wider">Score</Label>
                <Input 
                  id={`score_${c.id}`}
                  name={`score_${c.id}`}
                  type="number" 
                  min="0" 
                  max={c.max_score}
                  step="0.1"
                  required
                  defaultValue={existingScore?.score}
                  className="bg-background/50 border-primary/20 focus:border-primary font-mono text-lg"
                />
              </div>
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor={`notes_${c.id}`} className="text-xs uppercase font-mono tracking-wider">Field Notes (Optional)</Label>
                <Input 
                  id={`notes_${c.id}`}
                  name={`notes_${c.id}`}
                  type="text" 
                  defaultValue={existingScore?.notes || ''}
                  className="bg-background/50 border-primary/20 focus:border-primary font-mono"
                  placeholder="OBSERVATIONS..."
                />
              </div>
            </div>
          </div>
        )
      })}

      <Button type="submit" className="w-full h-12 uppercase tracking-widest font-bold font-mono shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all hover:bg-primary/90" disabled={loading}>
        {loading ? 'TRANSMITTING DATA...' : 'SUBMIT EVALUATION'}
      </Button>
    </form>
  )
}
