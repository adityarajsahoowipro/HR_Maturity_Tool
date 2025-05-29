// import { Progress } from "@/components/ui/progress"

// type MaturityCategory = {
//   name: string
//   score: number
//   color: string
//   description: string
// }

// const categories: MaturityCategory[] = [
//   {
//     name: "People & Skills",
//     score: 3.2,
//     color: "bg-emerald-600",
//     description: "Workforce capabilities and skills development",
//   },
//   {
//     name: "Processes",
//     score: 2.8,
//     color: "bg-amber-500",
//     description: "HR operational processes and workflows",
//   },
//   {
//     name: "Systems & Technology",
//     score: 3.5,
//     color: "bg-emerald-600",
//     description: "HR technology stack and integration",
//   },
//   {
//     name: "AI Adoption",
//     score: 2.6,
//     color: "bg-amber-500",
//     description: "Implementation of AI in HR functions",
//   },
//   {
//     name: "Data Readiness",
//     score: 3.0,
//     color: "bg-amber-500",
//     description: "Quality and accessibility of HR data",
//   },
//   {
//     name: "Hybrid Work Model",
//     score: 3.8,
//     color: "bg-emerald-600",
//     description: "Effectiveness of hybrid work arrangements",
//   },
// ]

// export function MaturityScorecard() {
//   return (
//     <div className="space-y-4">
//       {categories.map((category) => (
//         <div key={category.name} className="space-y-2">
//           <div className="flex justify-between items-center">
//             <div>
//               <div className="font-medium">{category.name}</div>
//               <div className="text-sm text-muted-foreground">{category.description}</div>
//             </div>
//             <div className="text-xl font-bold">{category.score.toFixed(1)}</div>
//           </div>
//           <Progress value={category.score * 20} className={`h-2 ${category.color}`} />
//         </div>
//       ))}
//     </div>
//   )
// }
import { Progress } from "@/components/ui/progress"

type MaturityCategory = {
  name: string
  score: number
  color: string
  description: string
}

const categories: MaturityCategory[] = [
  {
    name: "People & Skills",
    score: 3.2,
    color: "bg-emerald-600",
    description: "Workforce capabilities and skills development",
  },
  {
    name: "Processes",
    score: 2.8,
    color: "bg-amber-500",
    description: "HR operational processes and workflows",
  },
  {
    name: "Systems & Technology",
    score: 3.5,
    color: "bg-emerald-600",
    description: "HR technology stack and integration",
  },
  {
    name: "AI Adoption",
    score: 2.6,
    color: "bg-red-500",
    description: "Implementation of AI in HR functions",
  },
  {
    name: "Data Readiness",
    score: 3.0,
    color: "bg-amber-500",
    description: "Quality and accessibility of HR data",
  },
  {
    name: "Hybrid Work Model",
    score: 3.8,
    color: "bg-emerald-600",
    description: "Effectiveness of hybrid work arrangements",
  },
]

export function MaturityScorecard() {
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
