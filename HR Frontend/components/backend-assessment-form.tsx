"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, AlertCircle, Download, Share2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

type Category = {
  id: string
  name: string
  description: string
  questions: Question[]
}

type Question = {
  id: string
  text: string
  category: string
  weight: number
  options: Option[]
}

type Option = {
  value: number
  text: string
}

type AssessmentData = {
  categories: Category[]
}

export function BackendAssessmentForm() {
  const [activeTab, setActiveTab] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [comments, setComments] = useState<Record<string, string>>({})
  const [organizationName, setOrganizationName] = useState("")
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/questions`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setAssessmentData(data)
        if (data.categories && data.categories.length > 0) {
          setActiveTab(data.categories[0].id)
        }
      } catch (err) {
        console.error("Error fetching questions:", err)
        setError("Unable to connect to the assessment server. Please check if the backend is running.")
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  const handleNext = () => {
    if (!assessmentData) return

    const currentIndex = assessmentData.categories.findIndex((cat) => cat.id === activeTab)
    if (currentIndex < assessmentData.categories.length - 1) {
      setActiveTab(assessmentData.categories[currentIndex + 1].id)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (!assessmentData) return

    const currentIndex = assessmentData.categories.findIndex((cat) => cat.id === activeTab)
    if (currentIndex > 0) {
      setActiveTab(assessmentData.categories[currentIndex - 1].id)
    }
  }

  const handleSubmit = async () => {
    if (!organizationName.trim()) {
      setError("Please enter your organization name")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`${API_URL}/submit-assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationName,
          answers,
          comments,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.result)
      setIsSubmitting(false)
      setIsComplete(true)
    } catch (err) {
      console.error("Error submitting assessment:", err)
      setError("Failed to submit assessment. Please check your connection and try again.")
      setIsSubmitting(false)
    }
  }

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleCommentChange = (questionId: string, value: string) => {
    setComments((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const isCurrentCategoryComplete = () => {
    if (!assessmentData) return false

    const currentCategory = assessmentData.categories.find((cat) => cat.id === activeTab)
    if (!currentCategory) return false

    return currentCategory.questions.every((q) => answers[q.id] !== undefined)
  }

  const isFinalCategory = () => {
    if (!assessmentData) return false
    return assessmentData.categories.findIndex((cat) => cat.id === activeTab) === assessmentData.categories.length - 1
  }

  const getCompletionPercentage = () => {
    if (!assessmentData) return 0
    const totalQuestions = assessmentData.categories.reduce((sum, cat) => sum + cat.questions.length, 0)
    const answeredQuestions = Object.keys(answers).length
    return Math.round((answeredQuestions / totalQuestions) * 100)
  }

  const downloadReport = () => {
    if (!result) return

    const reportData = {
      organizationName: result.organizationName,
      submittedAt: result.submittedAt,
      analysis: result.analysis,
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `hr-maturity-report-${result.organizationName.replace(/\s+/g, "-").toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-2">Loading assessment questions...</span>
      </div>
    )
  }

  if (error && !assessmentData) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription>
          {error}
          <br />
          <br />
          Please ensure:
          <ul className="list-disc ml-4 mt-2">
            <li>The backend server is running on port 3001</li>
            <li>Your NEXT_PUBLIC_API_URL environment variable is set correctly</li>
            <li>There are no firewall or network issues</li>
          </ul>
        </AlertDescription>
      </Alert>
    )
  }

  if (isComplete && result) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="rounded-full bg-emerald-100 p-3 mb-4">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Assessment Complete!</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Thank you for completing the HR Maturity Assessment. Your results have been analyzed using AI.
        </p>

        <Card className="w-full max-w-4xl mb-6">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Assessment Results for {result.organizationName}</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Overall Maturity Score</h4>
              <div className="text-4xl font-bold text-emerald-600 mb-2">{result.analysis.overallScore.toFixed(1)}</div>
              <Progress value={(result.analysis.overallScore / 5) * 100} className="h-3 mb-2" />
              <p className="text-sm text-muted-foreground">{result.analysis.maturityLevel}</p>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Category Scores</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(result.analysis.categoryScores).map(([category, score]: [string, any]) => (
                  <div key={category} className="bg-slate-50 p-3 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-sm">
                        {assessmentData?.categories.find((cat) => cat.id === category)?.name || category}
                      </span>
                      <span className="font-bold">{score.toFixed(1)}</span>
                    </div>
                    <Progress value={(score / 5) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-3 text-emerald-600">Strengths</h4>
                <ul className="space-y-2">
                  {result.analysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-3 text-amber-600">Areas for Improvement</h4>
                <ul className="space-y-2">
                  {result.analysis.areasForImprovement.map((area: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">AI-Generated Recommendations</h4>
              <div className="space-y-3">
                {result.analysis.recommendations.map((recommendation: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium">{recommendation.title}</h5>
                      <div className="flex gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            recommendation.priority === "High"
                              ? "bg-red-100 text-red-800"
                              : recommendation.priority === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {recommendation.priority}
                        </span>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {recommendation.timeframe}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Next Steps</h4>
              <ol className="list-decimal list-inside space-y-1">
                {result.analysis.nextSteps.map((step: string, index: number) => (
                  <li key={index} className="text-sm">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={downloadReport}>
            <Download className="h-5 w-5 mr-2" />
            Download Full Report
          </Button>
          <Button size="lg" variant="outline" onClick={() => window.location.reload()}>
            Take Another Assessment
          </Button>
        </div>
      </div>
    )
  }

  if (!assessmentData || assessmentData.categories.length === 0) {
    return (
      <Alert className="my-4">
        <AlertTitle>No Questions Available</AlertTitle>
        <AlertDescription>No assessment questions are currently available.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Label htmlFor="organization-name" className="text-base font-medium">
            Organization Name
          </Label>
          <span className="text-sm text-muted-foreground">{getCompletionPercentage()}% Complete</span>
        </div>
        <Input
          id="organization-name"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          placeholder="Enter your organization name"
          className="mb-2"
        />
        <Progress value={getCompletionPercentage()} className="h-2" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList
          className="grid w-full"
          style={{ gridTemplateColumns: `repeat(${assessmentData.categories.length}, 1fr)` }}
        >
          {assessmentData.categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {assessmentData.categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <div className="space-y-8">
                  {category.questions.map((question, questionIndex) => (
                    <div key={question.id} className="space-y-4">
                      <h4 className="font-medium">
                        {questionIndex + 1}. {question.text}
                      </h4>
                      <RadioGroup
                        value={answers[question.id]?.toString()}
                        onValueChange={(value) => handleAnswerChange(question.id, Number.parseInt(value))}
                        className="space-y-3"
                      >
                        {question.options.map((option) => (
                          <div key={option.value} className="flex items-start space-x-3">
                            <RadioGroupItem
                              value={option.value.toString()}
                              id={`${question.id}-${option.value}`}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <Label htmlFor={`${question.id}-${option.value}`} className="font-medium cursor-pointer">
                                <span className="font-bold text-emerald-600">{option.value}</span> - {option.text}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                      <div>
                        <Label htmlFor={`comment-${question.id}`} className="text-sm text-muted-foreground">
                          Additional comments (optional)
                        </Label>
                        <Textarea
                          id={`comment-${question.id}`}
                          value={comments[question.id] || ""}
                          onChange={(e) => handleCommentChange(question.id, e.target.value)}
                          className="mt-1"
                          placeholder="Add any specific details or context..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={
            assessmentData.categories.indexOf(assessmentData.categories.find((cat) => cat.id === activeTab)!) === 0
          }
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isCurrentCategoryComplete() || isSubmitting}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Analyzing with AI...
            </>
          ) : isFinalCategory() ? (
            <>
              Submit Assessment <CheckCircle2 className="h-4 w-4" />
            </>
          ) : (
            <>
              Next <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
