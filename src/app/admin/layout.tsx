import Link from 'next/link'
import { logout } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Cpu, LayoutDashboard, Trophy, Users, LogOut, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const NavLinks = () => (
    <>
      <nav className="flex flex-col gap-3 flex-1 font-mono uppercase tracking-wider text-sm mt-8">
        <Link href="/admin" className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20">
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>
        <Link href="/admin/competitions" className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20">
          <Trophy className="w-4 h-4" /> Competitions
        </Link>
        <Link href="/admin/juries" className="flex items-center gap-3 rounded-md px-3 py-3 font-medium hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20">
          <Users className="w-4 h-4" /> Juries
        </Link>
      </nav>
      <form action={logout} className="mt-8">
        <Button variant="outline" className="w-full gap-2 border-primary/30 hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground">
          <LogOut className="w-4 h-4" /> Disconnect
        </Button>
      </form>
    </>
  )

  const Logo = () => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/30 shadow-[0_0_10px_rgba(0,240,255,0.1)] shrink-0">
        <Cpu className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-wider text-primary">ADMIN</h2>
        <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase">Command</p>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card/40 backdrop-blur-md sticky top-0 z-50">
        <Logo />
        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon" className="border-primary/30 text-primary" />}>
            <Menu className="w-5 h-5" />
          </SheetTrigger>
          <SheetContent side="left" className="bg-background border-r-primary/20 w-72 p-6">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Logo />
            <NavLinks />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar with Glassmorphism */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/40 backdrop-blur-md p-6 relative z-10 shrink-0">
        <Logo />
        <NavLinks />
      </aside>
      
      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto relative z-0">
        <div className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50 blur-3xl"></div>
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
