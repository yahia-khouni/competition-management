import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trophy, Plus } from 'lucide-react'

export default async function CompetitionsPage() {
  const supabase = await createClient()
  const { data: competitions } = await supabase.from('competitions').select('*').order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-primary shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">Competitions</h1>
        </div>
        <Link href="/admin/competitions/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto gap-2 font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Plus className="w-4 h-4"/> Create
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-card/50 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.05)] overflow-x-auto w-full max-w-full">
        <Table className="min-w-[600px] w-full">
          <TableHeader className="bg-black/20">
            <TableRow className="border-border/50">
              <TableHead className="font-mono text-primary">NAME</TableHead>
              <TableHead className="font-mono text-primary">THEME</TableHead>
              <TableHead className="font-mono text-primary">DATE</TableHead>
              <TableHead className="font-mono text-primary">STATUS</TableHead>
              <TableHead className="font-mono text-primary text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitions?.map((c) => (
              <TableRow key={c.id} className="border-border/50 hover:bg-primary/5 transition-colors">
                <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.theme}</TableCell>
                <TableCell className="text-muted-foreground font-mono">{c.event_date}</TableCell>
                <TableCell>
                  <span className={`inline-flex px-2 py-1 text-xs font-mono tracking-widest uppercase rounded border ${
                    c.status === 'upcoming' ? 'bg-secondary/50 text-secondary-foreground border-secondary' : 
                    c.status === 'active' ? 'bg-primary/20 text-primary border-primary/50' : 'bg-muted text-muted-foreground border-border'
                  }`}>
                    {c.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/competitions/${c.id}`}>
                    <Button variant="outline" size="sm" className="font-mono text-xs hover:border-primary/50 hover:text-primary transition-colors">Manage</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {!competitions?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-mono">No competitions initialized.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
