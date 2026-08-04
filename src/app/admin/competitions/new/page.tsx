import { createCompetition } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function NewCompetitionPage() {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight mb-6">New Competition</h1>
      <form action={createCompetition} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="e.g. Regional Championship 2024" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="theme">Theme / Topic</Label>
          <Input id="theme" name="theme" placeholder="e.g. City Shaper" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age_group">Age Group</Label>
          <Input id="age_group" name="age_group" placeholder="e.g. 9-12" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_date">Event Date</Label>
          <Input id="event_date" name="event_date" type="date" />
        </div>
        <div className="pt-4 flex gap-2">
          <Button type="submit">Create</Button>
          <Button variant="outline" asChild>
            <a href="/admin/competitions">Cancel</a>
          </Button>
        </div>
      </form>
    </div>
  )
}
