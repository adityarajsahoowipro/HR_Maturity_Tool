// "use client"

// import { useEffect, useRef } from "react"
// import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"

// Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend)

// export function Radar() {
//   const chartRef = useRef<HTMLCanvasElement>(null)
//   const chartInstance = useRef<Chart | null>(null)

//   useEffect(() => {
//     if (!chartRef.current) return

//     if (chartInstance.current) {
//       chartInstance.current.destroy()
//     }

//     const ctx = chartRef.current.getContext("2d")
//     if (!ctx) return

//     chartInstance.current = new Chart(ctx, {
//       type: "radar",
//       data: {
//         labels: [
//           "People & Skills",
//           "Processes",
//           "Systems & Technology",
//           "AI Adoption",
//           "Data Readiness",
//           "Hybrid Work Model",
//         ],
//         datasets: [
//           {
//             label: "Your Organization",
//             data: [3.2, 2.8, 3.5, 2.6, 3.0, 3.8],
//             backgroundColor: "rgba(16, 185, 129, 0.2)",
//             borderColor: "rgba(16, 185, 129, 1)",
//             pointBackgroundColor: "rgba(16, 185, 129, 1)",
//             pointBorderColor: "#fff",
//             pointHoverBackgroundColor: "#fff",
//             pointHoverBorderColor: "rgba(16, 185, 129, 1)",
//           },
//           {
//             label: "Industry Average",
//             data: [2.9, 2.5, 3.2, 2.3, 2.7, 3.1],
//             backgroundColor: "rgba(99, 102, 241, 0.2)",
//             borderColor: "rgba(99, 102, 241, 1)",
//             pointBackgroundColor: "rgba(99, 102, 241, 1)",
//             pointBorderColor: "#fff",
//             pointHoverBackgroundColor: "#fff",
//             pointHoverBorderColor: "rgba(99, 102, 241, 1)",
//           },
//           {
//             label: "Industry Leaders",
//             data: [4.5, 4.2, 4.7, 4.3, 4.6, 4.4],
//             backgroundColor: "rgba(245, 158, 11, 0.2)",
//             borderColor: "rgba(245, 158, 11, 1)",
//             pointBackgroundColor: "rgba(245, 158, 11, 1)",
//             pointBorderColor: "#fff",
//             pointHoverBackgroundColor: "#fff",
//             pointHoverBorderColor: "rgba(245, 158, 11, 1)",
//           },
//         ],
//       },
//       options: {
//         scales: {
//           r: {
//             min: 0,
//             max: 5,
//             ticks: {
//               stepSize: 1,
//             },
//           },
//         },
//         elements: {
//           line: {
//             tension: 0.1,
//           },
//         },
//       },
//     })

//     return () => {
//       if (chartInstance.current) {
//         chartInstance.current.destroy()
//       }
//     }
//   }, [])

//   return <canvas ref={chartRef} />
// }
"use client"

import { useEffect, useRef } from "react"
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js"

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend)

export function Radar() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: {
        labels: [
          "People & Skills",
          "Processes",
          "Systems & Technology",
          "AI Adoption",
          "Data Readiness",
          "Hybrid Work Model",
        ],
        datasets: [
          {
            label: "Your Organization",
            data: [3.2, 2.8, 3.5, 2.6, 3.0, 3.8],
            backgroundColor: "rgba(16, 185, 129, 0.2)",
            borderColor: "rgba(16, 185, 129, 1)",
            pointBackgroundColor: "rgba(16, 185, 129, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(16, 185, 129, 1)",
          },
          {
            label: "Industry Average",
            data: [2.9, 2.5, 3.2, 2.3, 2.7, 3.1],
            backgroundColor: "rgba(99, 102, 241, 0.2)",
            borderColor: "rgba(99, 102, 241, 1)",
            pointBackgroundColor: "rgba(99, 102, 241, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(99, 102, 241, 1)",
          },
          {
            label: "Industry Leaders",
            data: [4.5, 4.2, 4.7, 4.3, 4.6, 4.4],
            backgroundColor: "rgba(245, 158, 11, 0.2)",
            borderColor: "rgba(245, 158, 11, 1)",
            pointBackgroundColor: "rgba(245, 158, 11, 1)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgba(245, 158, 11, 1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0,
            max: 5,
            ticks: {
              stepSize: 1,
            },
          },
        },
        elements: {
          line: {
            tension: 0.1,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return <canvas ref={chartRef} />
}
