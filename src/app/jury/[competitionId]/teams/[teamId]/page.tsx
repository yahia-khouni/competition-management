import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ScoringForm } from './scoring-form'
import { ChevronLeft, Crosshair } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function TeamScoringPage({ params }: { params: Promise<{ competitionId: string, teamId: string }> }) {
  const { competitionId, teamId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify jury assignment
  const { data: assignment } = await supabase
    .from('jury_assignments')
    .select('*')
    .eq('jury_id', user.id)
    .eq('competition_id', competitionId)
    .single()
  
  if (!assignment) notFound()

  // Get Team & Competition
  const { data: team } = await supabase.from('teams').select('*').eq('id', teamId).eq('competition_id', competitionId).single()
  const { data: comp } = await supabase.from('competitions').select('*').eq('id', competitionId).single()
  if (!team || !comp) notFound()

  // Get Criteria
  const { data: criteria } = await supabase.from('scoring_criteria').select('*').eq('competition_id', competitionId).order('order_index')

  // Get Existing Scores from this Jury
  const { data: existingScores } = await supabase
    .from('scores')
    .select('*')
    .eq('team_id', teamId)
    .eq('jury_id', user.id)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href={`/jury/${competitionId}`}>
          <Button variant="outline" size="icon" className="border-primary/30 text-primary hover:bg-primary/10">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Crosshair className="w-8 h-8" /> {team.name}
          </h1>
          <p className="text-muted-foreground font-mono mt-1 tracking-widest uppercase">Robot: {team.robot_name}</p>
        </div>
      </div>

      <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-xl p-6 shadow-[0_0_20px_rgba(0,240,255,0.05)]">
        <div className="mb-6 pb-4 border-b border-border/50">
          <h2 className="text-lg font-mono text-primary tracking-widest uppercase">Evaluation Matrix</h2>
          <p className="text-sm text-muted-foreground mt-1">Provide scores based on the defined criteria below.</p>
        </div>
        <ScoringForm 
          teamId={teamId}
          competitionId={competitionId}
          criteria={criteria || []}
          existingScores={existingScores || []}
        />
      </div>
    </div>
  )
}
