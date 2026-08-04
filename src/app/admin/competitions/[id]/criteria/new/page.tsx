import { createCriterion } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronLeft, Target } from 'lucide-react'

export default async function NewCriterionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const createForComp = createCriterion.bind(null, id)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href={`/admin/competitions/${id}`}>
          <Button variant="outline" size="icon" className="border-primary/30 text-primary hover:bg-primary/10">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3">
            <Target className="w-8 h-8" /> Define Metric
          </h1>
          <p className="text-muted-foreground font-mono mt-1 tracking-widest uppercase">New Scoring Criterion</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-mono text-primary flex items-center gap-2">METRIC PARAMETERS</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createForComp} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs uppercase font-mono tracking-wider">Criterion Name</Label>
              <Input id="name" name="name" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs uppercase font-mono tracking-wider">Description (Optional)</Label>
              <Input id="description" name="description" className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_score" className="text-xs uppercase font-mono tracking-wider">Max Score</Label>
                <Input id="max_score" name="max_score" type="number" min="1" defaultValue="10" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-xs uppercase font-mono tracking-wider">Weight (Multiplier)</Label>
                <Input id="weight" name="weight" type="number" step="0.1" min="0" defaultValue="1" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order_index" className="text-xs uppercase font-mono tracking-wider">Display Order</Label>
              <Input id="order_index" name="order_index" type="number" defaultValue="0" required className="bg-background/50 border-primary/20 focus:border-primary font-mono" />
            </div>
            <Button type="submit" className="w-full font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.2)] h-12">Save Metric</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
