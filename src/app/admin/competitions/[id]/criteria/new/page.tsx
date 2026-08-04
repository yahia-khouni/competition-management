import { createCriterion } from '../../../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default async function NewCriterionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const createForComp = createCriterion.bind(null, id)

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg border shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Add Scoring Criterion</h1>
      <form action={createForComp} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Criterion Name</Label>
          <Input id="name" name="name" required placeholder="e.g. Robot Design" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" placeholder="Short explanation of what to look for" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="max_score">Max Score</Label>
          <Input id="max_score" name="max_score" type="number" defaultValue={10} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight</Label>
          <Input id="weight" name="weight" type="number" step="0.1" defaultValue={1} required />
        </div>
        <div className="pt-4 flex gap-2">
          <Button type="submit">Add Criterion</Button>
          <Button variant="outline" asChild>
            <a href={`/admin/competitions/${id}`}>Cancel</a>
          </Button>
        </div>
      </form>
    </div>
  )
}
