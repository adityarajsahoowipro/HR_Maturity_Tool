"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Radar } from "@/components/radar-chart"
import { MaturityScorecard } from "@/components/maturity-scorecard"
import { BackendAssessmentForm } from "@/components/backend-assessment-form"
import { IndustryComparison } from "@/components/industry-comparison"
import { HeroSection } from "@/components/hero-section"
import { useEffect, useState } from "react"
import { RecommendationPanel } from "@/components/recommendation-panel"
import type { Recommendation } from "@/components/recommendation-panel"

export default function Home() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [score, setScore] = useState<number | null>(null)
  const [result, setResult] = useState<any>(null)
  const [showOrgModal, setShowOrgModal] = useState(true)
  const [organizationName, setOrganizationName] = useState("")
  const [username, setUsername] = useState("")
  const [rawIndustryArray, setRawIndustryArray] = useState<any[] | undefined>(undefined);
  const [industryData, setIndustryData] = useState<{
    industry: string;
    categories: { [key: string]: { yourScore: number; industryAvg: number; leaders: number } };
  } | null>(null)

  useEffect(() => {
    const storedResult = localStorage.getItem("hr-maturity-result")
    if (storedResult) {
      const parsed = JSON.parse(storedResult)
      setResult(parsed)
      if (parsed?.analysis?.overallScore) setScore(parsed.analysis.overallScore)
    }
  }, [])
  useEffect(() => {
    if (result) {
      localStorage.setItem("hr-maturity-result", JSON.stringify(result))
    }
  }, [result])

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {showOrgModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg min-w-[320px] shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Enter Organization Details</h2>
            <input
              value={organizationName}
              onChange={e => setOrganizationName(e.target.value)}
              placeholder="Organization Name"
              className="w-full mb-4 p-2 border border-gray-300 rounded font-medium"
            />
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full mb-4 p-2 border border-gray-300 rounded font-medium"
            />
            <button
              className={`w-full bg-emerald-600 text-white py-2 rounded font-bold transition-colors ${organizationName.trim() && username.trim()
                ? "hover:bg-emerald-700 cursor-pointer"
                : "opacity-60 cursor-not-allowed"
                }`}
              disabled={!organizationName.trim() || !username.trim()}
              onClick={async () => {
                if (!organizationName.trim() || !username.trim()) return;
                setShowOrgModal(false);

                // Call your backend API
                const res = await fetch("http://localhost:3001/api/industry-comparison", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ organizationName }),
                });
                const data = await res.json();
                const arr = data.data;
                setRawIndustryArray(arr);

                // Transform array to object with categories
                const orgData = arr.find((d: { organization: string }) => d.organization.toLowerCase() === organizationName.toLowerCase());
                const competitors = arr.filter((d: { organization: string }) => d.organization.toLowerCase() !== organizationName.toLowerCase());
                const categories = orgData ? Object.keys(orgData.scores) : [];
                const categoryScores: { [key: string]: { yourScore: number; industryAvg: number; leaders: number } } = {};
                categories.forEach(cat => {
                  const avg = competitors.reduce((sum: any, c: { scores: { [x: string]: any } }) => sum + (c.scores[cat] || 0), 0) / competitors.length;
                  const leader = Math.max(...competitors.map((c: { scores: { [x: string]: any } }) => c.scores[cat] || 0));
                  categoryScores[cat] = {
                    yourScore: orgData ? orgData.scores[cat] : 0,
                    industryAvg: avg,
                    leaders: leader,
                  };
                });
                const transformed = {
                  industry: "Industry",
                  categories: categoryScores,
                };
                setIndustryData(transformed);
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="comparison">Industry Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Maturity Score</CardTitle>
                  <CardDescription>Your organization's HR maturity level</CardDescription>
                </CardHeader>
                <CardContent>
                  {score !== null ? (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl font-bold text-emerald-600">
                        {score.toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">out of 5.0</div>
                      <Progress value={(score / 5) * 100} className="h-2 mt-4" />
                      <div className="text-sm text-muted-foreground mt-2">Transitioning</div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      Complete the assessment to see your overall maturity score.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industry Position</CardTitle>
                  <CardDescription>How you compare to industry peers</CardDescription>
                </CardHeader>
                <CardContent>
                  {score !== null ? (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl font-bold text-amber-500">Top 35%</div>
                      <div className="text-sm text-muted-foreground mt-2">Above average</div>
                      <Progress value={65} className="h-2 mt-4" />
                      <div className="text-sm text-muted-foreground mt-2">Room for improvement</div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      Complete the assessment to see your overall maturity score.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Readiness</CardTitle>
                  <CardDescription>Preparedness for AI transformation</CardDescription>
                </CardHeader>
                <CardContent>
                  {result?.analysis?.categoryScores?.["ai-adoption"] !== undefined ? (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl font-bold text-blue-600">
                        {result.analysis.categoryScores["ai-adoption"].toFixed(1)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">out of 5.0</div>
                      <Progress value={(result.analysis.categoryScores["ai-adoption"] / 5) * 100} className="h-2 mt-4" />
                      <div className="text-sm text-muted-foreground mt-2">Early adoption phase</div>
                    </div>
                  ) : (
                    <div className="text-muted-foreground text-center py-8">
                      Complete the assessment to see your AI readiness score.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Maturity Dimensions</CardTitle>
                  <CardDescription>Assessment across key HR dimensions</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <Radar />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Maturity Scorecard</CardTitle>
                  <CardDescription>Detailed breakdown by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <MaturityScorecard categoryScores={result?.analysis?.categoryScores} />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transformation Roadmap</CardTitle>
                <CardDescription>AI-generated recommendations to improve maturity</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationPanel
                  recommendations={recommendations}
                  setRecommendations={setRecommendations}
                  detailed={false}
                  short={false}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>HR Maturity Assessment</CardTitle>
                <CardDescription>
                  Complete the assessment to evaluate your organization's HR maturity across people, processes, and
                  systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BackendAssessmentForm setRecommendations={setRecommendations} setScore={setScore} setResult={setResult} result={result} organizationName={organizationName}
                  username={username} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Recommendations</CardTitle>
                <CardDescription>
                  Personalized transformation initiatives based on your assessment results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recommendations.length === 0 ? (
                  <p className="text-muted-foreground">Complete the assessment to see your personalized recommendations.</p>
                ) : (
                  <RecommendationPanel recommendations={recommendations} setRecommendations={setRecommendations} detailed />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry Comparison</CardTitle>
                <CardDescription>See how your organization compares to industry benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <IndustryComparison organizationName={organizationName} industryData={industryData}  rawIndustryArray={rawIndustryArray} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
