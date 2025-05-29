import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Radar } from "@/components/radar-chart"
import { MaturityScorecard } from "@/components/maturity-scorecard"
import { RecommendationPanel } from "@/components/recommendation-panel"
// import { AssessmentForm } from "@/components/assessment-form"
import { BackendAssessmentForm } from "@/components/backend-assessment-form"
import { IndustryComparison } from "@/components/industry-comparison"
import { HeroSection } from "@/components/hero-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
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
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-emerald-600">3.2</div>
                    <div className="text-sm text-muted-foreground mt-2">out of 5.0</div>
                    <Progress value={64} className="h-2 mt-4" />
                    <div className="text-sm text-muted-foreground mt-2">Transitioning</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Industry Position</CardTitle>
                  <CardDescription>How you compare to industry peers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-amber-500">Top 35%</div>
                    <div className="text-sm text-muted-foreground mt-2">Above average</div>
                    <Progress value={65} className="h-2 mt-4" />
                    <div className="text-sm text-muted-foreground mt-2">Room for improvement</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI Readiness</CardTitle>
                  <CardDescription>Preparedness for AI transformation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-blue-600">2.8</div>
                    <div className="text-sm text-muted-foreground mt-2">out of 5.0</div>
                    <Progress value={56} className="h-2 mt-4" />
                    <div className="text-sm text-muted-foreground mt-2">Early adoption phase</div>
                  </div>
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
                  <MaturityScorecard />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transformation Roadmap</CardTitle>
                <CardDescription>AI-generated recommendations to improve maturity</CardDescription>
              </CardHeader>
              <CardContent>
                <RecommendationPanel />
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
                <BackendAssessmentForm />
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
                <RecommendationPanel detailed={true} />
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
                <IndustryComparison />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
