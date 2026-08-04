import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, ArrowRight } from 'lucide-react'

export default async function JuryDashboard() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Get competitions this jury is assigned to
  const { data: assignments } = await supabase
    .from('jury_assignments')
    .select('competitions(*)')
    .eq('jury_id', user.id)

  const competitions = assignments?.map(a => a.competitions).filter(Boolean)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-widest text-primary mb-8">ASSIGNED DIRECTIVES</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {competitions?.map((comp: any) => (
          <Card key={comp.id} className="hover:border-primary/50 transition-all shadow-[0_0_15px_rgba(0,240,255,0.05)] hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono text-xl text-primary">
                <Trophy className="w-5 h-5" />
                {comp.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-2 mb-6 text-sm text-muted-foreground font-mono">
                <p>Theme: <span className="text-foreground">{comp.theme}</span></p>
                <p>Status: <span className="text-primary">{comp.status}</span></p>
              </div>
              <Link href={`/jury/${comp.id}`} className="block w-full">
                <Button className="w-full gap-2 font-mono tracking-widest uppercase">
                  Access Terminal <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        {!competitions?.length && (
          <div className="col-span-full p-8 text-center text-muted-foreground font-mono bg-card/20 rounded-xl border border-border/50">
            No active directives assigned to this terminal.
          </div>
        )}
      </div>
    </div>
  )
}
