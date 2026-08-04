import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: comp } = await supabase.from('competitions').select('name').eq('id', id).single()
  const { data: criteria } = await supabase.from('scoring_criteria').select('*').eq('competition_id', id)
  const { data: teams } = await supabase.from('teams').select('*').eq('competition_id', id)
  const { data: scores } = await supabase.from('scores')
    .select('team_id, criterion_id, score, jury_id')
    .in('team_id', teams?.map(t => t.id) || [])

  const results = teams?.map(team => {
    let totalScore = 0
    const teamScores = scores?.filter(s => s.team_id === team.id) || []
    
    criteria?.forEach(criterion => {
      const criterionScores = teamScores.filter(s => s.criterion_id === criterion.id)
      if (criterionScores.length > 0) {
        const avg = criterionScores.reduce((sum, s) => sum + Number(s.score), 0) / criterionScores.length
        totalScore += avg * Number(criterion.weight)
      }
    })

    return {
      ...team,
      totalScore: Number(totalScore.toFixed(2)),
      juriesScored: new Set(teamScores.map(s => s.jury_id)).size
    }
  }).sort((a, b) => b.totalScore - a.totalScore) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Results: {comp?.name}</h1>
        <Link href={`/admin/competitions/${id}`}>
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Team Name</TableHead>
              <TableHead>Robot</TableHead>
              <TableHead className="text-right">Total Score</TableHead>
              <TableHead className="text-right">Juries Scored</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((team, index) => (
              <TableRow key={team.id}>
                <TableCell className="font-bold">{index + 1}</TableCell>
                <TableCell className="font-medium">{team.name}</TableCell>
                <TableCell>{team.robot_name}</TableCell>
                <TableCell className="text-right text-lg font-bold">{team.totalScore}</TableCell>
                <TableCell className="text-right text-gray-500">{team.juriesScored}</TableCell>
              </TableRow>
            ))}
            {results.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">No teams or scores available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
