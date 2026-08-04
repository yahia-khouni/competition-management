import { createTeam } from './actions'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Plus, Users, ChevronLeft } from 'lucide-react'

export default async function TeamsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: teams } = await supabase.from('teams').select('*').eq('competition_id', id).order('created_at')

  const createForComp = createTeam.bind(null, id)

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
            <Users className="w-8 h-8" /> Manage Squadrons
          </h1>
          <p className="text-muted-foreground font-mono mt-1 tracking-widest uppercase">Target Directive Registry</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="font-mono text-primary flex items-center gap-2"><Plus className="w-4 h-4"/> ADD SQUADRON</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createForComp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs uppercase font-mono tracking-wider">Squadron Name</Label>
                  <Input id="name" name="name" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="robot_name" className="text-xs uppercase font-mono tracking-wider">Robot Name</Label>
                  <Input id="robot_name" name="robot_name" className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
                </div>
                <Button type="submit" className="w-full font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.2)]">Add Squadron</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.05)] overflow-x-auto w-full">
            <Table className="min-w-full">
              <TableHeader className="bg-black/20">
                <TableRow className="border-border/50">
                  <TableHead className="font-mono text-primary">SQUADRON NAME</TableHead>
                  <TableHead className="font-mono text-primary">ROBOT NAME</TableHead>
                  <TableHead className="font-mono text-primary text-right">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams?.map((t) => (
                  <TableRow key={t.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium text-foreground">{t.name}</TableCell>
                    <TableCell className="text-muted-foreground font-mono">{t.robot_name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive font-mono uppercase tracking-widest text-xs">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!teams?.length && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6 text-muted-foreground font-mono">No squadrons added yet.</TableCell>
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
