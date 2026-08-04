import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function JuryTeamsPage({ params }: { params: Promise<{ competitionId: string }> }) {
  const { competitionId } = await params
  const supabase = await createClient()

  const { data: comp } = await supabase.from('competitions').select('name, status').eq('id', competitionId).single()
  const { data: teams } = await supabase.from('teams').select('*').eq('competition_id', competitionId)
  
  const { data: { user } } = await supabase.auth.getUser()
  const { data: myScores } = await supabase.from('scores').select('team_id').eq('jury_id', user?.id)
  const scoredTeamIds = new Set(myScores?.map(s => s.team_id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{comp?.name} - Teams</h1>
        <Link href="/jury">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Name</TableHead>
              <TableHead>Robot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams?.map((t) => {
              const hasScored = scoredTeamIds.has(t.id)
              return (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.robot_name}</TableCell>
                  <TableCell>
                    {hasScored ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Scored</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/jury/${competitionId}/teams/${t.id}`}>
                      <Button variant={hasScored ? 'outline' : 'default'} size="sm">
                        {hasScored ? 'Edit Score' : 'Score'}
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
            {!teams?.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-gray-500">No teams found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
