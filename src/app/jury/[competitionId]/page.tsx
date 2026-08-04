import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react'

export default async function JuryCompetitionDetails({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify assignment
  const { data: assignment } = await supabase
    .from('jury_assignments')
    .select('*')
    .eq('jury_id', user.id)
    .eq('competition_id', competitionId)
    .single()
  
  if (!assignment) notFound()

  const { data: comp } = await supabase.from('competitions').select('*').eq('id', competitionId).single()
  const { data: teams } = await supabase.from('teams').select('*').eq('competition_id', competitionId).order('name')
  
  // Get scores to check if a team is already scored by this jury
  const { data: scores } = await supabase
    .from('scores')
    .select('team_id')
    .eq('jury_id', user.id)

  const scoredTeamIds = new Set(scores?.map(s => s.team_id))

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between bg-card/30 backdrop-blur-sm border border-border/50 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.05)]">
        <div className="flex gap-4">
          <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary mb-1">{comp.name}</h1>
            <p className="text-muted-foreground font-mono text-sm uppercase flex gap-4">
              <span>Theme: <span className="text-foreground">{comp.theme}</span></span>
              <span>Status: <span className="text-primary">{comp.status}</span></span>
            </p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-primary font-mono tracking-widest uppercase mb-4">Target Squadrons</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {teams?.map(t => {
            const isScored = scoredTeamIds.has(t.id)
            return (
              <Card key={t.id} className={`hover:border-primary/50 transition-colors ${isScored ? 'bg-card/20' : ''}`}>
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{t.robot_name}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {isScored ? (
                      <span className="flex items-center gap-1 text-sm font-mono text-primary/80 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4" /> Evaluated
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm font-mono text-secondary-foreground uppercase tracking-widest">
                        <AlertCircle className="w-4 h-4" /> Pending
                      </span>
                    )}
                    <Link href={`/jury/${competitionId}/teams/${t.id}`}>
                      <Button variant={isScored ? "outline" : "default"} className="font-mono uppercase tracking-widest text-xs shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                        {isScored ? 'Update' : 'Evaluate'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {!teams?.length && (
            <p className="text-muted-foreground font-mono text-sm col-span-full">No squadrons available for evaluation.</p>
          )}
        </div>
      </div>
    </div>
  )
}
