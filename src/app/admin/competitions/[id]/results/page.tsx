import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trophy, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function CompetitionResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Get competition
  const { data: comp } = await supabase.from('competitions').select('*').eq('id', id).single()
  if (!comp) notFound()

  // 2. Get all criteria for weights
  const { data: criteria } = await supabase.from('scoring_criteria').select('*').eq('competition_id', id)
  
  // 3. Get all teams
  const { data: teams } = await supabase.from('teams').select('*').eq('competition_id', id)

  // 4. Get all scores
  const { data: scores } = await supabase.from('scores').select(`
    *,
    scoring_criteria!inner(competition_id)
  `).eq('scoring_criteria.competition_id', id)

  // Calculate Weighted Averages
  const teamScores = teams?.map(team => {
    let totalScore = 0
    let evaluatedCriteriaCount = 0

    criteria?.forEach(c => {
      // Find all scores for this team + criterion
      const criterionScores = scores?.filter(s => s.team_id === team.id && s.criterion_id === c.id) || []
      
      if (criterionScores.length > 0) {
        // Average score from all juries for this specific criterion
        const avgScore = criterionScores.reduce((acc, s) => acc + s.score, 0) / criterionScores.length
        totalScore += avgScore * c.weight
        evaluatedCriteriaCount++
      }
    })

    return {
      ...team,
      totalScore: Number(totalScore.toFixed(2)),
      progress: criteria?.length ? `${evaluatedCriteriaCount}/${criteria.length}` : '0/0'
    }
  }).sort((a, b) => b.totalScore - a.totalScore)

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/admin/competitions/${id}`}>
          <Button variant="outline" size="icon" className="border-primary/30 text-primary hover:bg-primary/10">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Trophy className="w-8 h-8" /> {comp.name} - Leaderboard
          </h1>
          <p className="text-muted-foreground font-mono mt-1 tracking-widest uppercase">Live Telemetry</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-md shadow-[0_0_20px_rgba(0,240,255,0.05)] overflow-hidden">
        <Table>
          <TableHeader className="bg-black/30">
            <TableRow className="border-border/50">
              <TableHead className="w-16 text-center font-mono text-primary">RANK</TableHead>
              <TableHead className="font-mono text-primary">SQUADRON</TableHead>
              <TableHead className="font-mono text-primary">ROBOT</TableHead>
              <TableHead className="text-center font-mono text-primary">EVALUATION PROGRESS</TableHead>
              <TableHead className="text-right font-mono text-primary">FINAL SCORE</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teamScores?.map((team, index) => (
              <TableRow key={team.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                <TableCell className="text-center font-bold text-lg font-mono text-primary">{index + 1}</TableCell>
                <TableCell className="font-medium text-foreground">{team.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono">{team.robot_name}</TableCell>
                <TableCell className="text-center text-secondary-foreground font-mono">{team.progress}</TableCell>
                <TableCell className="text-right font-bold text-xl text-primary font-mono glow-text">{team.totalScore}</TableCell>
              </TableRow>
            ))}
            {!teamScores?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-mono">No data available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
