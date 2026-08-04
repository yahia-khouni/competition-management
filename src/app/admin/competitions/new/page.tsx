import { createCompetition } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronLeft, Plus } from 'lucide-react'

export default function NewCompetitionPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/competitions">
          <Button variant="outline" size="icon" className="border-primary/30 text-primary hover:bg-primary/10">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Plus className="w-8 h-8" /> Initialize Directive
          </h1>
          <p className="text-muted-foreground font-mono mt-1 tracking-widest uppercase">Create New Competition</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-primary flex items-center gap-2">DIRECTIVE PARAMETERS</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCompetition} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase font-mono tracking-wider">Competition Name</Label>
              <Input id="name" name="name" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-xs uppercase font-mono tracking-wider">Theme (Optional)</Label>
              <Input id="theme" name="theme" className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age_group" className="text-xs uppercase font-mono tracking-wider">Age Group</Label>
                <Input id="age_group" name="age_group" placeholder="e.g. Under 15" className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_date" className="text-xs uppercase font-mono tracking-wider">Event Date</Label>
                <Input id="event_date" name="event_date" type="date" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
              </div>
            </div>
            <Button type="submit" className="w-full font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.2)] h-12">Initialize Competition</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
