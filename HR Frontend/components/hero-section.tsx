// import { Button } from "@/components/ui/button"

// export function HeroSection() {
//   return (
//     <div className="bg-slate-900 text-white py-16">
//       <div className="container mx-auto px-4">
//         <div className="max-w-3xl">
//           <h1 className="text-4xl font-bold mb-4">HR Maturity Framework Assessment</h1>
//           <p className="text-xl mb-6">
//             Evaluate your organization's HR maturity and get AI-powered recommendations to transform from legacy models
//             to AI-first, skills-based, and hybrid-optimized operating models.
//           </p>
//           <div className="flex flex-wrap gap-4">
//             <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white hover:text-white">
//               Start Assessment
//             </Button>
//             <Button size="lg" variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white">
//               Learn More
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, Brain, TrendingUp, Zap } from "lucide-react"

export function HeroSection() {
  const scrollToAssessment = () => {
    const assessmentTab = document.querySelector('[value="assessment"]') as HTMLElement
    if (assessmentTab) {
      assessmentTab.click()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="bg-slate-900 text-white py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 bg-emerald-600/20 px-3 py-1 rounded-full">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 font-medium text-sm">AI-Powered Assessment</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-600/20 px-3 py-1 rounded-full">
              <Brain className="h-4 w-4 text-blue-400" />
              <span className="text-blue-400 font-medium text-sm">Smart Analytics</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-600/20 px-3 py-1 rounded-full">
              <Zap className="h-4 w-4 text-purple-400" />
              <span className="text-purple-400 font-medium text-sm">Real-time Insights</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            HR Maturity Framework
            <span className="block text-emerald-400">Assessment Platform</span>
          </h1>
          <p className="text-xl mb-8 text-slate-300 leading-relaxed">
            Transform your HR operations with our AI-powered maturity assessment. Get personalized recommendations to
            evolve from legacy models to AI-first, skills-based, and hybrid-optimized operating models.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
              onClick={scrollToAssessment}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Start AI Assessment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-black hover:bg-white hover:text-slate-900 px-8 py-3"
            >
              View Demo
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>6 Key Maturity Dimensions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>AI-Generated Insights</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
              <span>Industry Benchmarking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
