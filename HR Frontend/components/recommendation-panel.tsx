
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Clock, Loader2, Sparkles, Brain } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type RecommendationProps = {
  detailed?: boolean
}

type Recommendation = {
  title: string
  description: string
  impact: "High" | "Medium" | "Low"
  timeframe: "Short-term" | "Medium-term" | "Long-term"
  category: string
  steps?: string[]
  aiGenerated?: boolean
}

const baseRecommendations: Recommendation[] = [
  {
    title: "Implement AI-powered skills assessment",
    description:
      "Deploy an AI-based skills assessment tool to identify skill gaps and create personalized development plans.",
    impact: "High",
    timeframe: "Medium-term",
    category: "People & Skills",
    steps: [
      "Select an AI-powered skills assessment platform",
      "Integrate with existing HRIS",
      "Pilot with one department",
      "Analyze results and refine approach",
      "Roll out company-wide",
    ],
  },
  {
    title: "Automate routine HR processes",
    description:
      "Identify and automate repetitive HR tasks using workflow automation and AI to free up HR staff for strategic work.",
    impact: "High",
    timeframe: "Short-term",
    category: "Processes",
    steps: [
      "Conduct process audit to identify automation candidates",
      "Prioritize based on time savings and complexity",
      "Select automation tools",
      "Implement and test workflows",
      "Train HR team on new processes",
    ],
  },
  {
    title: "Develop data governance framework",
    description:
      "Create a comprehensive data governance framework to ensure data quality, privacy, and accessibility for AI initiatives.",
    impact: "Medium",
    timeframe: "Medium-term",
    category: "Data Readiness",
    steps: [
      "Assess current data quality and accessibility",
      "Define data ownership and stewardship roles",
      "Establish data quality standards",
      "Implement data cleaning and enrichment processes",
      "Create monitoring and compliance protocols",
    ],
  },
]

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export function RecommendationPanel({ detailed = false }: RecommendationProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(baseRecommendations)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedRec, setExpandedRec] = useState<number | null>(null)

  const generateMoreRecommendations = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/generate-recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentRecommendations: recommendations.map((r) => r.title),
          organizationContext: {
            maturityLevel: "Transitioning",
            focusAreas: ["AI Adoption", "Process Automation", "Skills Development"],
            industry: "Technology",
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.recommendations) {
        const newRecommendations = data.recommendations.map((rec: any) => ({
          ...rec,
          aiGenerated: true,
        }))
        setRecommendations((prev) => [...prev, ...newRecommendations])
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      console.error("Error generating recommendations:", err)
      setError("Failed to generate new recommendations. Please try again.")

      // Fallback: Add some predefined AI-generated recommendations
      const fallbackRecommendations: Recommendation[] = [
        {
          title: "Implement predictive analytics for talent retention",
          description:
            "Use AI to analyze employee data and predict turnover risk, enabling proactive retention strategies.",
          impact: "High",
          timeframe: "Medium-term",
          category: "AI Adoption",
          aiGenerated: true,
          steps: [
            "Collect and clean historical employee data",
            "Select predictive analytics platform",
            "Train models on historical turnover data",
            "Implement early warning system",
            "Create intervention protocols for at-risk employees",
          ],
        },
        {
          title: "Deploy conversational AI for employee support",
          description: "Implement an AI chatbot to handle routine HR inquiries and provide 24/7 employee support.",
          impact: "Medium",
          timeframe: "Short-term",
          category: "Systems & Technology",
          aiGenerated: true,
          steps: [
            "Analyze common HR inquiries and FAQs",
            "Select conversational AI platform",
            "Train chatbot on HR knowledge base",
            "Integrate with existing HR systems",
            "Launch pilot and gather feedback",
          ],
        },
      ]
      setRecommendations((prev) => [...prev, ...fallbackRecommendations])
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleExpanded = (index: number) => {
    setExpandedRec(expandedRec === index ? null : index)
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-800">{error}</AlertDescription>
        </Alert>
      )}

      {recommendations.map((rec, index) => (
        <Card
          key={index}
          className={`border-l-4 transition-all duration-200 ${
            rec.aiGenerated ? "bg-gradient-to-r from-purple-50 to-blue-50 border-l-purple-500" : ""
          }`}
          style={{ borderLeftColor: !rec.aiGenerated ? (rec.impact === "High" ? "#10b981" : "#f59e0b") : undefined }}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">{rec.title}</CardTitle>
                {rec.aiGenerated && (
                  <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">AI Generated</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="bg-slate-100">
                  {rec.category}
                </Badge>
                <Badge
                  variant={rec.impact === "High" ? "default" : "outline"}
                  className={rec.impact === "High" ? "bg-emerald-600" : ""}
                >
                  {rec.impact} Impact
                </Badge>
              </div>
            </div>
            <CardDescription className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {rec.timeframe}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{rec.description}</p>

            {(detailed || expandedRec === index) && rec.steps && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Implementation Steps:</h4>
                <ul className="space-y-2">
                  {rec.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex justify-end">
                  <Button className="gap-1">
                    View Detailed Plan <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {!detailed && !expandedRec && (
              <div className="flex justify-end">
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => toggleExpanded(index)}>
                  View Details <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {!detailed && expandedRec === index && (
              <div className="flex justify-end mt-4">
                <Button variant="ghost" size="sm" className="gap-1" onClick={() => toggleExpanded(index)}>
                  Hide Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center mt-6">
        <Button className="gap-2" onClick={generateMoreRecommendations} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating AI Recommendations...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Generate More AI Recommendations
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
