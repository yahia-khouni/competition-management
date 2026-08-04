import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, ShieldAlert, Cpu } from 'lucide-react'

export default async function CompetitionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: comp } = await supabase.from('competitions').select('*').eq('id', id).single()
  if (!comp) notFound()

  const { data: criteria } = await supabase.from('scoring_criteria').select('*').eq('competition_id', id).order('order_index')
  const { data: teams } = await supabase.from('teams').select('*').eq('competition_id', id).order('created_at')

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-card/30 backdrop-blur-sm border border-border/50 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.05)]">
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-1">{comp.name}</h1>
            <p className="text-muted-foreground font-mono text-sm uppercase flex flex-wrap gap-x-4 gap-y-1">
              <span>Theme: <span className="text-foreground">{comp.theme}</span></span>
              <span>Age: <span className="text-foreground">{comp.age_group}</span></span>
              <span>Status: <span className="text-primary glow-text">{comp.status}</span></span>
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/competitions/${id}/results`}>
            <Button className="font-mono uppercase tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.2)]">View Results</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <CardTitle className="font-mono text-primary flex items-center gap-2"><ShieldAlert className="w-4 h-4"/> SCORING MATRIX</CardTitle>
            <Link href={`/admin/competitions/${id}/criteria/new`}>
              <Button size="sm" variant="outline" className="font-mono text-xs">Add Criterion</Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 p-0">
            {criteria?.length ? (
              <Table>
                <TableHeader className="bg-black/10">
                  <TableRow className="border-border/50">
                    <TableHead className="font-mono">NAME</TableHead>
                    <TableHead className="font-mono text-center">MAX</TableHead>
                    <TableHead className="font-mono text-center">WEIGHT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {criteria.map((c) => (
                    <TableRow key={c.id} className="border-border/50">
                      <TableCell className="font-medium text-foreground">{c.name}</TableCell>
                      <TableCell className="text-center text-primary font-mono">{c.max_score}</TableCell>
                      <TableCell className="text-center text-secondary-foreground font-mono">{c.weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground font-mono">No criteria defined yet.</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <CardTitle className="font-mono text-primary flex items-center gap-2"><Cpu className="w-4 h-4"/> SQUADRONS</CardTitle>
            <Link href={`/admin/competitions/${id}/teams`}>
              <Button size="sm" variant="outline" className="font-mono text-xs">Manage Teams</Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-4 p-0">
            {teams?.length ? (
              <Table>
                <TableHeader className="bg-black/10">
                  <TableRow className="border-border/50">
                    <TableHead className="font-mono">NAME</TableHead>
                    <TableHead className="font-mono">ROBOT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((t) => (
                    <TableRow key={t.id} className="border-border/50">
                      <TableCell className="font-medium text-foreground">{t.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono">{t.robot_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground font-mono">No teams added yet.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
