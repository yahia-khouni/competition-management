import { createClient } from '@/lib/supabase/server'
import { submitScores } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default async function ScoringPage({ params, searchParams }: { params: Promise<{ competitionId: string, teamId: string }>, searchParams: Promise<{ success?: string }> }) {
  const { competitionId, teamId } = await params
  const { success } = await searchParams
  const supabase = await createClient()

  const { data: team } = await supabase.from('teams').select('name, robot_name').eq('id', teamId).single()
  const { data: criteria } = await supabase.from('scoring_criteria').select('*').eq('competition_id', competitionId).order('order_index')
  
  const { data: { user } } = await supabase.auth.getUser()
  const { data: existingScores } = await supabase.from('scores').select('*').eq('team_id', teamId).eq('jury_id', user?.id)

  const submitAction = submitScores.bind(null, competitionId, teamId)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Score: {team?.name}</h1>
          <p className="text-gray-500">Robot: {team?.robot_name}</p>
        </div>
        <Link href={`/jury/${competitionId}`}>
          <Button variant="outline">Back to Teams</Button>
        </Link>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
          Scores saved successfully!
        </div>
      )}

      <form action={submitAction} className="space-y-8 bg-white p-6 rounded-lg border shadow-sm">
        {criteria?.map((c) => {
          const existing = existingScores?.find(s => s.criterion_id === c.id)
          return (
            <div key={c.id} className="space-y-3 pb-6 border-b last:border-0 last:pb-0">
              <div>
                <Label htmlFor={`score_${c.id}`} className="text-lg font-semibold">{c.name}</Label>
                {c.description && <p className="text-sm text-gray-500 mb-2">{c.description}</p>}
              </div>
              <div className="flex items-center gap-4">
                <Input 
                  id={`score_${c.id}`} 
                  name={`score_${c.id}`} 
                  type="number" 
                  step="0.1" 
                  min={0} 
                  max={c.max_score} 
                  required 
                  defaultValue={existing?.score}
                  className="w-32" 
                />
                <span className="text-sm text-gray-500">/ {c.max_score} (Weight: {c.weight})</span>
              </div>
            </div>
          )
        })}

        <div className="pt-4 flex gap-4">
          <Button type="submit" size="lg" className="w-full md:w-auto">Save Scores</Button>
        </div>
      </form>
    </div>
  )
}
