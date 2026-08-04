import Link from 'next/link'
import { logout } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Cpu, Trophy, LogOut } from 'lucide-react'

export default function JuryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      <aside className="flex flex-col w-full md:w-64 border-r border-border bg-card/40 backdrop-blur-md p-6 relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-wider text-primary">JURY</h2>
            <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">Terminal</p>
          </div>
        </div>
        
        <nav className="flex flex-col gap-3 flex-1 font-mono uppercase tracking-wider text-sm">
          <Link href="/jury" className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20">
            <Trophy className="w-4 h-4" /> Competitions
          </Link>
        </nav>
        
        <form action={logout} className="mt-8">
          <Button variant="outline" className="w-full gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground">
            <LogOut className="w-4 h-4" /> Disconnect
          </Button>
        </form>
      </aside>
      
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-0">
        <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 blur-3xl"></div>
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
