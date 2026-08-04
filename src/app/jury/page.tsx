import { createClient } from '@/lib/supabase/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function JuryDashboard() {
  const supabase = await createClient()
  const { data: assignments } = await supabase.from('jury_assignments').select('competitions(*)')
  
  const competitions = assignments?.map(a => a.competitions).filter(Boolean) || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Competitions</h1>
      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitions.map((c: any) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="capitalize">{c.status}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/jury/${c.id}`}>
                    <Button variant="outline" size="sm">Score Teams</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {competitions.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-gray-500">No competitions assigned.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
