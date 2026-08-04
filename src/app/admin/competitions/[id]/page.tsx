import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CompetitionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: comp } = await supabase.from('competitions').select('*').eq('id', id).single()
  if (!comp) notFound()

  const { data: criteria } = await supabase.from('scoring_criteria').select('*').eq('competition_id', id).order('order_index')
  const { data: teams } = await supabase.from('teams').select('*').eq('competition_id', id).order('created_at')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{comp.name}</h1>
          <p className="text-gray-500 mt-1">{comp.theme} • {comp.age_group} • Status: <span className="capitalize font-semibold">{comp.status}</span></p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/competitions/${id}/results`}>
            <Button>View Results</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Scoring Criteria</CardTitle>
            <Link href={`/admin/competitions/${id}/criteria/new`}>
              <Button size="sm" variant="outline">Add Criterion</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {criteria?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Max</TableHead>
                    <TableHead>Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteria.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.max_score}</TableCell>
                      <TableCell>{c.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-gray-500">No criteria defined yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Teams</CardTitle>
            <Link href={`/admin/competitions/${id}/teams`}>
              <Button size="sm" variant="outline">Manage Teams</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {teams?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Robot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell>{t.robot_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-gray-500">No teams added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
