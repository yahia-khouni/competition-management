import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function CompetitionsPage() {
  const supabase = await createClient()
  const { data: competitions } = await supabase.from('competitions').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Competitions</h1>
        <Link href="/admin/competitions/new">
          <Button>Create Competition</Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitions?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.theme}</TableCell>
                <TableCell>{c.event_date}</TableCell>
                <TableCell className="capitalize">{c.status}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/competitions/${c.id}`}>
                    <Button variant="outline" size="sm">Manage</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!competitions?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-gray-500">No competitions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
