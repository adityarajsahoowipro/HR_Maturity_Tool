export const seedQuestions = {
  id: "default",
  version: "1.0",
  createdAt: new Date().toISOString(),
  categories: [
    {
      id: "people-skills",
      name: "People & Skills",
      description: "Assessment of workforce capabilities and skills development",
      questions: [
        {
          id: "p1",
          text: "How would you rate your organization's digital literacy and AI readiness?",
          category: "people-skills",
          weight: 1.0,
          options: [
            { value: 1, text: "Very low - Most employees lack basic digital skills" },
            { value: 2, text: "Low - Limited digital literacy across the organization" },
            { value: 3, text: "Moderate - Average digital literacy with some AI awareness" },
            { value: 4, text: "High - Good digital literacy with AI understanding" },
            { value: 5, text: "Very high - Advanced digital literacy and AI readiness" }
          ]
        },
        {
          id: "p2",
          text: "To what extent does your organization have a skills-based approach to talent management?",
          category: "people-skills",
          weight: 1.0,
          options: [
            { value: 1, text: "Not at all - Traditional role-based approach only" },
            { value: 2, text: "Limited - Beginning to consider skills in some areas" },
            { value: 3, text: "Moderate - Hybrid of role and skills-based approaches" },
            { value: 4, text: "Significant - Primarily skills-based with some role elements" },
            { value: 5, text: "Comprehensive - Fully skills-based talent management" }
          ]
        }
      ]
    },
    {
      id: "processes",
      name: "Processes",
      description: "HR operational processes and workflows",
      questions: [
        {
          id: "pr1",
          text: "How automated are your core HR processes?",
          category: "processes",
          weight: 1.0,
          options: [
            { value: 1, text: "Not automated - Primarily manual processes" },
            { value: 2, text: "Minimally automated - Basic digital tools only" },
            { value: 3, text: "Partially automated - Some key processes automated" },
            { value: 4, text: "Mostly automated - Most processes have automation" },
            { value: 5, text: "Fully automated - End-to-end process automation with AI optimization" }
          ]
        },
        {
          id: "pr2",
          text: "To what extent are your HR processes data-driven?",
          category: "processes",
          weight: 1.0,
          options: [
            { value: 1, text: "Not data-driven - Decisions based on intuition" },
            { value: 2, text: "Minimally data-driven - Basic reporting only" },
            { value: 3, text: "Partially data-driven - Some analytics used" },
            { value: 4, text: "Mostly data-driven - Regular use of analytics" },
            { value: 5, text: "Fully data-driven - Advanced analytics and predictive modeling" }
          ]
        }
      ]
    },
    {
      id: "ai-adoption",
      name: "AI Adoption",
      description: "Implementation of AI in HR functions",
      questions: [
        {
          id: "a1",
          text: "To what extent has your organization adopted AI in HR functions?",
          category: "ai-adoption",
          weight: 1.0,
          options: [
            { value: 1, text: "No adoption - No AI tools used" },
            { value: 2, text: "Early exploration - Researching AI options" },
            { value: 3, text: "Initial adoption - Piloting AI in limited areas" },
            { value: 4, text: "Partial adoption - AI used in several HR functions" },
            { value: 5, text: "Full adoption - AI integrated across all HR functions" }
          ]
        },
        {
          id: "a2",
          text: "How mature is your organization's AI governance framework?",
          category: "ai-adoption",
          weight: 1.0,
          options: [
            { value: 1, text: "Non-existent - No AI governance" },
            { value: 2, text: "Basic - Informal guidelines only" },
            { value: 3, text: "Developing - Formal policies being created" },
            { value: 4, text: "Established - Comprehensive framework in place" },
            { value: 5, text: "Advanced - Mature governance with continuous improvement" }
          ]
        }
      ]
    },
    {
      id: "data-readiness",
      name: "Data Readiness",
      description: "Quality and accessibility of HR data",
      questions: [
        {
          id: "d1",
          text: "How would you rate the quality and accessibility of your HR data?",
          category: "data-readiness",
          weight: 1.0,
          options: [
            { value: 1, text: "Poor - Inconsistent, hard to access data" },
            { value: 2, text: "Below average - Some data quality issues" },
            { value: 3, text: "Average - Decent quality with some accessibility challenges" },
            { value: 4, text: "Good - High quality, easily accessible data" },
            { value: 5, text: "Excellent - Real-time, high-quality data with advanced analytics" }
          ]
        }
      ]
    },
    {
      id: "hybrid-work",
      name: "Hybrid Work Model",
      description: "Effectiveness of hybrid work arrangements",
      questions: [
        {
          id: "h1",
          text: "How mature is your organization's hybrid work model?",
          category: "hybrid-work",
          weight: 1.0,
          options: [
            { value: 1, text: "No hybrid model - Traditional office-only approach" },
            { value: 2, text: "Basic hybrid - Limited remote work options" },
            { value: 3, text: "Moderate hybrid - Flexible work arrangements available" },
            { value: 4, text: "Advanced hybrid - Optimized for both remote and office work" },
            { value: 5, text: "AI-optimized hybrid - Dynamic work arrangements based on analytics" }
          ]
        }
      ]
    }
  ]
};