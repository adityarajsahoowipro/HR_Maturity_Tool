import { Progress } from "@/components/ui/progress"

type MaturityCategory = {
  name: string
  score: number
  color: string
  description: string
}

type MaturityScorecardProps = {
  categoryScores?: Record<string, number>
}

export function MaturityScorecard({ categoryScores }: MaturityScorecardProps) {
  if (!categoryScores) {
    return (
      <div className="text-muted-foreground text-center py-8">
        Complete the assessment to see your maturity scorecard.
      </div>
    )
  }
  console.log("Category Scores:", categoryScores);
  
   const categories: MaturityCategory[] = [
    {
      name: "People & Skills",
      score: categoryScores?.["people-skills"] ?? 0,
      color: "bg-emerald-600",
      description: "Workforce capabilities and skills development",
    },
    {
      name: "Processes",
      score: categoryScores?.["processes"] ?? 0,
      color: "bg-amber-500",
      description: "HR operational processes and workflows",
    },
    // {
    //   name: "Systems & Technology",
    //   score: categoryScores?.["systems-technology"] ?? 0,
    //   color: "bg-emerald-600",
    //   description: "HR technology stack and integration",
    // },
    {
      name: "AI Adoption",
      score: categoryScores?.["ai-adoption"] ?? 0,
      color: "bg-red-500",
      description: "Implementation of AI in HR functions",
    },
    {
      name: "Data Readiness",
      score: categoryScores?.["data-readiness"] ?? 0,
      color: "bg-amber-500",
      description: "Quality and accessibility of HR data",
    },
    {
      name: "Hybrid Work Model",
      score: categoryScores?.["hybrid-work"] ?? 0,
      color: "bg-emerald-600",
      description: "Effectiveness of hybrid work arrangements",
    },
  ]
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium">{category.name}</div>
              <div className="text-sm text-muted-foreground">{category.description}</div>
            </div>
            <div className="text-xl font-bold">{category.score.toFixed(1)}</div>
          </div>
          <Progress value={category.score * 20} className="h-2" />
        </div>
      ))}
    </div>
  )
}
