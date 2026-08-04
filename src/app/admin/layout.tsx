import Link from 'next/link'
import { logout } from '@/app/actions'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="flex flex-col w-full md:w-64 border-r bg-gray-50 p-4">
        <h2 className="mb-6 text-xl font-bold tracking-tight">Admin Portal</h2>
        <nav className="flex flex-col gap-2 flex-1">
          <Link href="/admin" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">Dashboard</Link>
          <Link href="/admin/competitions" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">Competitions</Link>
          <Link href="/admin/juries" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">Manage Juries</Link>
        </nav>
        <form action={logout} className="mt-4">
          <Button variant="outline" className="w-full">Log out</Button>
        </form>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
