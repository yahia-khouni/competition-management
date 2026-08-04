import { createTeam } from './actions'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

export default async function TeamsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: teams } = await supabase.from('teams').select('*').eq('competition_id', id).order('created_at')

  const createForComp = createTeam.bind(null, id)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Teams</h1>
        <Link href={`/admin/competitions/${id}`}>
          <Button variant="outline">Back to Competition</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-4">Add Team</h2>
            <form action={createForComp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Team Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="robot_name">Robot Name</Label>
                <Input id="robot_name" name="robot_name" />
              </div>
              <Button type="submit" className="w-full">Add Team</Button>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Robot Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams?.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name}</TableCell>
                    <TableCell>{t.robot_name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!teams?.length && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-gray-500">No teams added yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}
