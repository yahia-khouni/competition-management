import { createClient } from '@/lib/supabase/server'
import { createJury, assignJury } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function JuriesPage() {
  const supabase = await createClient()
  const { data: juries } = await supabase.from('profiles').select('*').eq('role', 'jury').order('created_at')
  const { data: competitions } = await supabase.from('competitions').select('*').eq('status', 'upcoming')

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Manage Juries</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Create Jury Account</h2>
          <form action={createJury} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" name="full_name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">Create Jury</Button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-bold mb-4">Assign Jury to Competition</h2>
          <form action={assignJury} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jury_id">Select Jury</Label>
              <select id="jury_id" name="jury_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                <option value="">-- Select Jury --</option>
                {juries?.map(j => <option key={j.id} value={j.id}>{j.full_name} ({j.username})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="competition_id">Select Competition</Label>
              <select id="competition_id" name="competition_id" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                <option value="">-- Select Competition --</option>
                {competitions?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <Button type="submit" className="w-full">Assign</Button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {juries?.map((j) => (
              <TableRow key={j.id}>
                <TableCell className="font-medium">{j.full_name}</TableCell>
                <TableCell>{j.username}</TableCell>
                <TableCell>{j.is_active ? 'Active' : 'Inactive'}</TableCell>
              </TableRow>
            ))}
            {!juries?.length && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-gray-500">No juries created yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
