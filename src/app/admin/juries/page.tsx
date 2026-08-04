import { createClient } from '@/lib/supabase/server'
import { createJury, assignJury } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Link as LinkIcon } from 'lucide-react'

export default async function JuriesPage() {
  const supabase = await createClient()
  const { data: juries } = await supabase.from('profiles').select('*').eq('role', 'jury').order('created_at')
  const { data: competitions } = await supabase.from('competitions').select('*').eq('status', 'upcoming')

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight text-primary">Manage Juries</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-primary flex items-center gap-2">CREATE JURY ACCOUNT</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createJury} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-xs uppercase font-mono tracking-wider">Full Name</Label>
                <Input id="full_name" name="full_name" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs uppercase font-mono tracking-wider">Username</Label>
                <Input id="username" name="username" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase font-mono tracking-wider">Password</Label>
                <Input id="password" name="password" type="password" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
              </div>
              <Button type="submit" className="w-full font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.2)]">Create Jury</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-mono text-primary flex items-center gap-2"><LinkIcon className="w-4 h-4"/> ASSIGN JURY</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={assignJury} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="jury_id" className="text-xs uppercase font-mono tracking-wider">Select Jury</Label>
                <select id="jury_id" name="jury_id" className="flex h-10 w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm ring-offset-background font-mono focus:border-primary focus:ring-1 focus:ring-primary/50 text-foreground" required>
                  <option value="" className="bg-background text-foreground">-- Select Jury --</option>
                  {juries?.map(j => <option key={j.id} value={j.id} className="bg-background text-foreground">{j.full_name} ({j.username})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="competition_id" className="text-xs uppercase font-mono tracking-wider">Select Competition</Label>
                <select id="competition_id" name="competition_id" className="flex h-10 w-full rounded-md border border-primary/20 bg-background/50 px-3 py-2 text-sm ring-offset-background font-mono focus:border-primary focus:ring-1 focus:ring-primary/50 text-foreground" required>
                  <option value="" className="bg-background text-foreground">-- Select Competition --</option>
                  {competitions?.map(c => <option key={c.id} value={c.id} className="bg-background text-foreground">{c.name}</option>)}
                </select>
              </div>
              <Button type="submit" className="w-full font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.2)]">Assign</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.05)] overflow-x-auto">
        <Table className="min-w-full w-full">
          <TableHeader className="bg-black/20">
            <TableRow className="border-border/50">
              <TableHead className="font-mono text-primary whitespace-nowrap">FULL NAME</TableHead>
              <TableHead className="font-mono text-primary whitespace-nowrap">USERNAME</TableHead>
              <TableHead className="font-mono text-primary whitespace-nowrap">STATUS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {juries?.map((j) => (
              <TableRow key={j.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                <TableCell className="font-medium text-foreground whitespace-nowrap">{j.full_name}</TableCell>
                <TableCell className="text-muted-foreground font-mono whitespace-nowrap">{j.username}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-mono tracking-widest uppercase rounded border ${
                    j.is_active ? 'bg-primary/20 text-primary border-primary/50' : 'bg-muted text-muted-foreground border-border'
                  }`}>
                    {j.is_active ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
            {!juries?.length && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6 text-muted-foreground font-mono">No juries created yet.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
