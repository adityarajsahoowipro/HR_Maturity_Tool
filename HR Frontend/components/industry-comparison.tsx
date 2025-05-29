// "use client"

// import { useState } from "react"

// import { useEffect, useRef } from "react"
// import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

// type IndustryData = {
//   industry: string
//   categories: {
//     [key: string]: {
//       yourScore: number
//       industryAvg: number
//       leaders: number
//     }
//   }
// }

// const industryData: Record<string, IndustryData> = {
//   "All Industries": {
//     industry: "All Industries",
//     categories: {
//       "People & Skills": { yourScore: 3.2, industryAvg: 2.9, leaders: 4.5 },
//       Processes: { yourScore: 2.8, industryAvg: 2.5, leaders: 4.2 },
//       "Systems & Technology": { yourScore: 3.5, industryAvg: 3.2, leaders: 4.7 },
//       "AI Adoption": { yourScore: 2.6, industryAvg: 2.3, leaders: 4.3 },
//       "Data Readiness": { yourScore: 3.0, industryAvg: 2.7, leaders: 4.6 },
//       "Hybrid Work Model": { yourScore: 3.8, industryAvg: 3.1, leaders: 4.4 },
//     },
//   },
//   Technology: {
//     industry: "Technology",
//     categories: {
//       "People & Skills": { yourScore: 3.2, industryAvg: 3.4, leaders: 4.7 },
//       Processes: { yourScore: 2.8, industryAvg: 3.0, leaders: 4.5 },
//       "Systems & Technology": { yourScore: 3.5, industryAvg: 3.8, leaders: 4.9 },
//       "AI Adoption": { yourScore: 2.6, industryAvg: 3.2, leaders: 4.6 },
//       "Data Readiness": { yourScore: 3.0, industryAvg: 3.5, leaders: 4.8 },
//       "Hybrid Work Model": { yourScore: 3.8, industryAvg: 3.9, leaders: 4.7 },
//     },
//   },
//   "Financial Services": {
//     industry: "Financial Services",
//     categories: {
//       "People & Skills": { yourScore: 3.2, industryAvg: 2.8, leaders: 4.3 },
//       Processes: { yourScore: 2.8, industryAvg: 2.7, leaders: 4.4 },
//       "Systems & Technology": { yourScore: 3.5, industryAvg: 3.0, leaders: 4.5 },
//       "AI Adoption": { yourScore: 2.6, industryAvg: 2.5, leaders: 4.2 },
//       "Data Readiness": { yourScore: 3.0, industryAvg: 2.9, leaders: 4.5 },
//       "Hybrid Work Model": { yourScore: 3.8, industryAvg: 2.8, leaders: 4.1 },
//     },
//   },
//   Healthcare: {
//     industry: "Healthcare",
//     categories: {
//       "People & Skills": { yourScore: 3.2, industryAvg: 2.6, leaders: 4.2 },
//       Processes: { yourScore: 2.8, industryAvg: 2.3, leaders: 4.0 },
//       "Systems & Technology": { yourScore: 3.5, industryAvg: 2.7, leaders: 4.3 },
//       "AI Adoption": { yourScore: 2.6, industryAvg: 2.0, leaders: 3.9 },
//       "Data Readiness": { yourScore: 3.0, industryAvg: 2.4, leaders: 4.2 },
//       "Hybrid Work Model": { yourScore: 3.8, industryAvg: 2.5, leaders: 4.0 },
//     },
//   },
// }

// export function IndustryComparison() {
//   const chartRef = useRef<HTMLCanvasElement>(null)
//   const chartInstance = useRef<Chart | null>(null)
//   const [selectedIndustry, setSelectedIndustry] = useState<string>("All Industries")

//   useEffect(() => {
//     if (!chartRef.current) return

//     if (chartInstance.current) {
//       chartInstance.current.destroy()
//     }

//     const ctx = chartRef.current.getContext("2d")
//     if (!ctx) return

//     const data = industryData[selectedIndustry]
//     const categories = Object.keys(data.categories)

//     chartInstance.current = new Chart(ctx, {
//       type: "bar",
//       data: {
//         labels: categories,
//         datasets: [
//           {
//             label: "Your Organization",
//             data: categories.map((cat) => data.categories[cat].yourScore),
//             backgroundColor: "rgba(16, 185, 129, 0.7)",
//             borderColor: "rgba(16, 185, 129, 1)",
//             borderWidth: 1,
//           },
//           {
//             label: "Industry Average",
//             data: categories.map((cat) => data.categories[cat].industryAvg),
//             backgroundColor: "rgba(99, 102, 241, 0.7)",
//             borderColor: "rgba(99, 102, 241, 1)",
//             borderWidth: 1,
//           },
//           {
//             label: "Industry Leaders",
//             data: categories.map((cat) => data.categories[cat].leaders),
//             backgroundColor: "rgba(245, 158, 11, 0.7)",
//             borderColor: "rgba(245, 158, 11, 1)",
//             borderWidth: 1,
//           },
//         ],
//       },
//       options: {
//         responsive: true,
//         scales: {
//           y: {
//             beginAtZero: true,
//             max: 5,
//             ticks: {
//               stepSize: 1,
//             },
//           },
//         },
//       },
//     })

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy()
//       }
//     }
//   }, [selectedIndustry])

//   return (
//     <div className="space-y-6">
//       <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="w-full">
//         <TabsList className="grid grid-cols-2 md:grid-cols-4">
//           {Object.keys(industryData).map((industry) => (
//             <TabsTrigger key={industry} value={industry}>
//               {industry}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//       </Tabs>

//       <div className="h-80">
//         <canvas ref={chartRef} />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg">Your Organization</CardTitle>
//             <CardDescription>Overall maturity score compared to industry</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-4xl font-bold text-emerald-600">3.2</div>
//             <p className="text-sm text-muted-foreground mt-1">
//               {selectedIndustry === "Technology" || selectedIndustry === "Healthcare"
//                 ? "Above industry average"
//                 : selectedIndustry === "Financial Services"
//                   ? "On par with industry average"
//                   : "Above industry average"}
//             </p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg">Industry Average</CardTitle>
//             <CardDescription>Average maturity score in {selectedIndustry}</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-4xl font-bold text-indigo-600">
//               {(
//                 Object.values(industryData[selectedIndustry].categories).reduce(
//                   (sum, cat) => sum + cat.industryAvg,
//                   0,
//                 ) / Object.keys(industryData[selectedIndustry].categories).length
//               ).toFixed(1)}
//             </div>
//             <p className="text-sm text-muted-foreground mt-1">Based on data from similar organizations</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-lg">Gap to Leaders</CardTitle>
//             <CardDescription>Distance to industry leaders</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="text-4xl font-bold text-amber-500">
//               {(
//                 Object.values(industryData[selectedIndustry].categories).reduce((sum, cat) => sum + cat.leaders, 0) /
//                   Object.keys(industryData[selectedIndustry].categories).length -
//                 Object.values(industryData[selectedIndustry].categories).reduce((sum, cat) => sum + cat.yourScore, 0) /
//                   Object.keys(industryData[selectedIndustry].categories).length
//               ).toFixed(1)}
//             </div>
//             <p className="text-sm text-muted-foreground mt-1">Points needed to reach top performers</p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type IndustryData = {
  industry: string
  categories: {
    [key: string]: {
      yourScore: number
      industryAvg: number
      leaders: number
    }
  }
}

const industryData: Record<string, IndustryData> = {
  "All Industries": {
    industry: "All Industries",
    categories: {
      "People & Skills": { yourScore: 3.2, industryAvg: 2.9, leaders: 4.5 },
      Processes: { yourScore: 2.8, industryAvg: 2.5, leaders: 4.2 },
      "Systems & Technology": { yourScore: 3.5, industryAvg: 3.2, leaders: 4.7 },
      "AI Adoption": { yourScore: 2.6, industryAvg: 2.3, leaders: 4.3 },
      "Data Readiness": { yourScore: 3.0, industryAvg: 2.7, leaders: 4.6 },
      "Hybrid Work Model": { yourScore: 3.8, industryAvg: 3.1, leaders: 4.4 },
    },
  },
  Technology: {
    industry: "Technology",
    categories: {
      "People & Skills": { yourScore: 3.2, industryAvg: 3.4, leaders: 4.7 },
      Processes: { yourScore: 2.8, industryAvg: 3.0, leaders: 4.5 },
      "Systems & Technology": { yourScore: 3.5, industryAvg: 3.8, leaders: 4.9 },
      "AI Adoption": { yourScore: 2.6, industryAvg: 3.2, leaders: 4.6 },
      "Data Readiness": { yourScore: 3.0, industryAvg: 3.5, leaders: 4.8 },
      "Hybrid Work Model": { yourScore: 3.8, industryAvg: 3.9, leaders: 4.7 },
    },
  },
  "Financial Services": {
    industry: "Financial Services",
    categories: {
      "People & Skills": { yourScore: 3.2, industryAvg: 2.8, leaders: 4.3 },
      Processes: { yourScore: 2.8, industryAvg: 2.7, leaders: 4.4 },
      "Systems & Technology": { yourScore: 3.5, industryAvg: 3.0, leaders: 4.5 },
      "AI Adoption": { yourScore: 2.6, industryAvg: 2.5, leaders: 4.2 },
      "Data Readiness": { yourScore: 3.0, industryAvg: 2.9, leaders: 4.5 },
      "Hybrid Work Model": { yourScore: 3.8, industryAvg: 2.8, leaders: 4.1 },
    },
  },
  Healthcare: {
    industry: "Healthcare",
    categories: {
      "People & Skills": { yourScore: 3.2, industryAvg: 2.6, leaders: 4.2 },
      Processes: { yourScore: 2.8, industryAvg: 2.3, leaders: 4.0 },
      "Systems & Technology": { yourScore: 3.5, industryAvg: 2.7, leaders: 4.3 },
      "AI Adoption": { yourScore: 2.6, industryAvg: 2.0, leaders: 3.9 },
      "Data Readiness": { yourScore: 3.0, industryAvg: 2.4, leaders: 4.2 },
      "Hybrid Work Model": { yourScore: 3.8, industryAvg: 2.5, leaders: 4.0 },
    },
  },
}

export function IndustryComparison() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [selectedIndustry, setSelectedIndustry] = useState<string>("All Industries")

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    const data = industryData[selectedIndustry]
    const categories = Object.keys(data.categories)

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "Your Organization",
            data: categories.map((cat) => data.categories[cat].yourScore),
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 1,
          },
          {
            label: "Industry Average",
            data: categories.map((cat) => data.categories[cat].industryAvg),
            backgroundColor: "rgba(99, 102, 241, 0.7)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
          },
          {
            label: "Industry Leaders",
            data: categories.map((cat) => data.categories[cat].leaders),
            backgroundColor: "rgba(245, 158, 11, 0.7)",
            borderColor: "rgba(245, 158, 11, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [selectedIndustry])

  return (
    <div className="space-y-6">
      <Tabs value={selectedIndustry} onValueChange={setSelectedIndustry} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4">
          {Object.keys(industryData).map((industry) => (
            <TabsTrigger key={industry} value={industry}>
              {industry}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="h-80">
        <canvas ref={chartRef} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Organization</CardTitle>
            <CardDescription>Overall maturity score compared to industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-emerald-600">3.2</div>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedIndustry === "Technology" || selectedIndustry === "Healthcare"
                ? "Above industry average"
                : selectedIndustry === "Financial Services"
                  ? "On par with industry average"
                  : "Above industry average"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Industry Average</CardTitle>
            <CardDescription>Average maturity score in {selectedIndustry}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-600">
              {(
                Object.values(industryData[selectedIndustry].categories).reduce(
                  (sum, cat) => sum + cat.industryAvg,
                  0,
                ) / Object.keys(industryData[selectedIndustry].categories).length
              ).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Based on data from similar organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Gap to Leaders</CardTitle>
            <CardDescription>Distance to industry leaders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-500">
              {(
                Object.values(industryData[selectedIndustry].categories).reduce((sum, cat) => sum + cat.leaders, 0) /
                  Object.keys(industryData[selectedIndustry].categories).length -
                Object.values(industryData[selectedIndustry].categories).reduce((sum, cat) => sum + cat.yourScore, 0) /
                  Object.keys(industryData[selectedIndustry].categories).length
              ).toFixed(1)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Points needed to reach top performers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
