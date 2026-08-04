import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Users, ShieldAlert } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Basic stats
  const { count: competitionsCount } = await supabase.from('competitions').select('*', { count: 'exact', head: true })
  const { count: teamsCount } = await supabase.from('teams').select('*', { count: 'exact', head: true })
  const { count: juriesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'jury')

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-widest text-primary mb-8 glow-text">SYSTEM OVERVIEW</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-mono tracking-wider font-medium text-muted-foreground uppercase">
              Active Competitions
            </CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground font-mono">{competitionsCount || 0}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-mono tracking-wider font-medium text-muted-foreground uppercase">
              Registered Squadrons
            </CardTitle>
            <ShieldAlert className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground font-mono">{teamsCount || 0}</div>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-mono tracking-wider font-medium text-muted-foreground uppercase">
              Jury Terminals
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-foreground font-mono">{juriesCount || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
