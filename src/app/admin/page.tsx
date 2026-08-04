import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { count: competitionsCount } = await supabase.from('competitions').select('*', { count: 'exact', head: true })
  const { count: teamsCount } = await supabase.from('teams').select('*', { count: 'exact', head: true })
  const { count: juriesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'jury')

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Competitions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{competitionsCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamsCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Juries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{juriesCount || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
