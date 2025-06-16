"use client"

import { useState, useEffect, useRef } from "react"
import { Chart, BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

type CategoryScores = {
  [key: string]: {
    yourScore: number
    industryAvg: number
    leaders: number
  }
}

type IndustryData = {
  industry: string
  categories: CategoryScores
}
export function IndustryComparison({
  organizationName,
  industryData,
  yourScores,
  rawIndustryArray,
}: {
  organizationName: string
  yourScores?: Record<string, number>
  industryData?: any
  rawIndustryArray?: any[]
}) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

console.log("-----------------------IndustryComparison received:", industryData);
  // Update yourScore after assessment
  useEffect(() => {
    if ( !industryData) return
  }, [industryData])

  // Chart rendering
  useEffect(() => {
    if (!chartRef.current || !industryData) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const categories = Object.keys(industryData.categories)
    const data = industryData.categories

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: categories,
        datasets: [
          {
            label: "Your Organization",
            data: categories.map(cat => data[cat].yourScore),
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderColor: "rgba(16, 185, 129, 1)",
            borderWidth: 1,
          },
          {
            label: "Industry Average",
            data: categories.map(cat => data[cat].industryAvg),
            backgroundColor: "rgba(99, 102, 241, 0.7)",
            borderColor: "rgba(99, 102, 241, 1)",
            borderWidth: 1,
          },
          {
            label: "Industry Leaders",
            data: categories.map(cat => data[cat].leaders),
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
            ticks: { stepSize: 1 },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [industryData])
    console.log(industryData);
    
 if (!industryData || !industryData.categories) {
    return <div className="text-center py-10">Loading industry data...</div>;
  }
  const hasAssessment = !!yourScores && Object.keys(yourScores).length > 0;
  const displayCategories = hasAssessment
  ? industryData.categories
  : Object.fromEntries(
      Object.entries(industryData.categories).map(([cat, val]) => [
        cat,
        { ...(typeof val === "object" && val !== null ? val : {}), yourScore: 0 }
      ])
    );

  const categories = Object.keys(industryData.categories)
  const avg =
    categories.reduce((sum, cat) => sum + industryData.categories[cat].industryAvg, 0) / categories.length
  const yourAvg =
    categories.reduce((sum, cat) => sum + industryData.categories[cat].yourScore, 0) / categories.length
  const leaderAvg =
    categories.reduce((sum, cat) => sum + industryData.categories[cat].leaders, 0) / categories.length
let leaderName = "Top Performer"
console.log("**************rawIndustryArray:", rawIndustryArray);

  if (rawIndustryArray && rawIndustryArray.length > 0) {
    // Calculate average for each org
    const orgAverages = rawIndustryArray.map(org => {
      const scores = Object.values(org.scores) as number[]
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      return { name: org.organization, avg }
    })
    orgAverages.sort((a, b) => b.avg - a.avg)
    console.log("**************Top organizations:", orgAverages);
    
    leaderName = orgAverages[0].name
  }
    


  return (
    <div className="space-y-6">
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
            <div className="text-4xl font-bold text-emerald-600">{yourAvg.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {yourAvg > avg
                ? "Above industry average"
                : yourAvg < avg
                ? "Below industry average"
                : "On par with industry average"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Industry Average</CardTitle>
            <CardDescription>Average maturity score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-indigo-600">{avg.toFixed(1)}</div>
            <p className="text-sm text-muted-foreground mt-1">Based on data from similar organizations</p>
          </CardContent>
        </Card>

        <Card>
         <CardHeader className="pb-2">
            <CardTitle className="text-lg">Gap to Leaders</CardTitle>
            <CardDescription>
              Distance to industry leader: <span className="font-semibold">{leaderName}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-amber-500">{(leaderAvg - yourAvg).toFixed(1)}</div>
            <p className="text-sm text-muted-foreground mt-1">Points needed to reach top performers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
