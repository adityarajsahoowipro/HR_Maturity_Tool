import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import { seedQuestions } from './data/seed-questions.js';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Data paths
const questionsPath = path.join(__dirname, 'data', 'questions.json');
const resultsPath = path.join(__dirname, 'data', 'results.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(__dirname, 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Initialize data files if they don't exist
async function initializeData() {
  await ensureDataDir();

  // Initialize questions.json if it doesn't exist
  try {
    await fs.access(questionsPath);
    console.log(' Questions file already exists');
  } catch {
    await fs.writeFile(questionsPath, JSON.stringify(seedQuestions, null, 2));
    console.log(' Created questions.json from seed data');
  }

  // Initialize results.json if it doesn't exist
  try {
    await fs.access(resultsPath);
    console.log(' Results file already exists');
  } catch {
    await fs.writeFile(resultsPath, JSON.stringify([], null, 2));
    console.log(' Created empty results.json file');
  }
}

// Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    lab45Configured: !!process.env.LAB45_API_KEY
  });
});

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const data = await fs.readFile(questionsPath, 'utf8');
    const questions = JSON.parse(data);
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get questions by category
app.get('/api/questions/:categoryId', async (req, res) => {
  try {
    const data = await fs.readFile(questionsPath, 'utf8');
    const questions = JSON.parse(data);
    const category = questions.categories.find(cat => cat.id === req.params.categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    console.error('Error fetching category questions:', error);
    res.status(500).json({ error: 'Failed to fetch category questions' });
  }
});

// Submit assessment
app.post('/api/submit-assessment', async (req, res) => {
  try {
    const { answers, organizationName, comments } = req.body;

    if (!answers || !organizationName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log(` Processing assessment for: ${organizationName}`);
    console.log(`********answer******* : ${JSON.stringify(answers, null, 2)}`);


    // Prepare data for Lab45 analysis
    const analysisPrompt = await generateAnalysisPrompt(answers, comments);

    // Call Lab45 for analysis
    const analysis = await analyzeWithLab45(analysisPrompt);

    // Save results
    const results = await getResults();
    const newResult = {
      id: Date.now().toString(),
      organizationName,
      submittedAt: new Date().toISOString(),
      answers,
      comments: comments || {},
      analysis
    };

    results.push(newResult);
    await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));

    console.log(` Assessment completed for: ${organizationName}`);
    res.json({ success: true, result: newResult });
  } catch (error) {
    console.error(' Error submitting assessment:', error);
    res.status(500).json({ error: 'Failed to submit assessment' });
  }
});

// Generate AI recommendations using Lab45
app.post('/api/generate-recommendations', async (req, res) => {
  try {
    const { currentRecommendations, organizationContext } = req.body;

    console.log(' Generating AI recommendations with Lab45...');

    const recommendations = await generateLab45Recommendations(currentRecommendations, organizationContext);

    res.json({
      success: true,
      recommendations,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(' Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Get assessment result by ID
app.get('/api/results/:id', async (req, res) => {
  try {
    const results = await getResults();
    const result = results.find(r => r.id === req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching result:', error);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

// Get all results summary (for admin purposes)
app.get('/api/results', async (req, res) => {
  try {
    const results = await getResults();
    // Return summary data without detailed answers for privacy
    const summaryResults = results.map(result => ({
      id: result.id,
      organizationName: result.organizationName,
      submittedAt: result.submittedAt,
      overallScore: result.analysis?.overallScore || 0,
      maturityLevel: result.analysis?.maturityLevel || 'Unknown'
    }));

    res.json(summaryResults);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Helper functions

// Generate AI recommendations using Lab45
async function generateLab45Recommendations(currentRecommendations = [], organizationContext = {}) {
  try {
    console.log(' Calling Lab45 for recommendation generation...');

    const prompt = `
      Generate 2-3 new HR maturity recommendations that are different from the existing ones.
      
      Current recommendations already provided:
      ${currentRecommendations.join(', ')}
      
      Organization context:
      - Maturity Level: ${organizationContext.maturityLevel || 'Unknown'}
      - Focus Areas: ${organizationContext.focusAreas?.join(', ') || 'General'}
      - Industry: ${organizationContext.industry || 'General'}
      
      Please provide innovative, actionable recommendations that:
      1. Are specific to the organization's current maturity level
      2. Focus on emerging HR technologies and practices
      3. Include AI/ML applications where appropriate
      4. Are different from the existing recommendations
      5. Consider the organization's industry context
      
      Return recommendations in this JSON format:
      {
        "recommendations": [
          {
            "title": "recommendation title",
            "description": "detailed description of the recommendation",
            "impact": "High|Medium|Low",
            "timeframe": "Short-term|Medium-term|Long-term",
            "category": "category name",
            "steps": ["step1", "step2", "step3", "step4", "step5"]
          }
        ]
      }
    `;

    const endpoint = "https://api.lab45.ai/v1.1/skills/completion/query";

    const headers = {
      'Content-Type': "application/json",
      'Accept': "application/json",
      'Authorization': "Bearer token|2d49f24a-c1f7-430e-a420-aa2791b0195c|e4cc8247990686073886be526da6728f2100cfef35d8aaf9317e25f2e8181534"
    };

    const payload = {
      messages: [
        {
          role: 'system',
          content: `You are an expert HR transformation consultant specializing in AI-powered HR solutions, 
          digital transformation, and modern workplace practices. Generate innovative, practical recommendations 
          that help organizations advance their HR maturity. Focus on cutting-edge but implementable solutions.
          Always respond with valid JSON format.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      skill_parameters: {
        model_name: 'gpt-4',
        emb_type: 'openai',
        max_output_tokens: 2000,
        temperature: 0.8
      },
      stream_response: false
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lab45 API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Lab45 API raw result:', JSON.stringify(result, null, 2));

    let content = result?.choices?.[0]?.message?.content;

    // Fallback to data.content if not found
    if (!content && result?.data?.content) {
      content = result.data.content;
    }
    console.log('Lab45 API content:', content);

    if (!content) {
      // Try direct recommendations object
      if (result?.recommendations) {
        console.log('Lab45 returned recommendations object directly.');
        return result;
      }
      console.error('No content received from Lab45 API, using fallback recommendations.');
      return generateFallbackRecommendations(currentRecommendations, organizationContext);
    }

    try {
      const recommendations = JSON.parse(content);
      console.log('Lab45 recommendations completed successfully');
      return recommendations;
    } catch (parseError) {
      console.log('Error parsing Lab45 recommendations response:', parseError);
      console.log('Using fallback recommendations due to parsing error');
      return generateFallbackRecommendations(currentRecommendations, organizationContext);
    }

  } catch (error) {
    console.error(' Lab45 API error for recommendations:', error);
    console.log(' Using fallback recommendations due to Lab45 error');
    return generateFallbackRecommendations(currentRecommendations, organizationContext);
  }
}

// Fallback recommendations generator
function generateFallbackRecommendations(currentRecommendations = [], organizationContext = {}) {
  const fallbackRecommendations = [
    {
      title: "Implement predictive analytics for talent retention",
      description: "Use AI to analyze employee data and predict turnover risk, enabling proactive retention strategies and personalized career development paths.",
      impact: "High",
      timeframe: "Medium-term",
      category: "AI Adoption",
      steps: [
        "Collect and clean historical employee data",
        "Select predictive analytics platform",
        "Train models on historical turnover data",
        "Implement early warning system",
        "Create intervention protocols for at-risk employees"
      ]
    },
    {
      title: "Deploy conversational AI for employee support",
      description: "Implement an AI chatbot to handle routine HR inquiries, provide 24/7 employee support, and guide employees through HR processes.",
      impact: "Medium",
      timeframe: "Short-term",
      category: "Systems & Technology",
      steps: [
        "Analyze common HR inquiries and FAQs",
        "Select conversational AI platform",
        "Train chatbot on HR knowledge base",
        "Integrate with existing HR systems",
        "Launch pilot and gather feedback"
      ]
    },
    {
      title: "Create AI-powered learning recommendation engine",
      description: "Develop a personalized learning system that uses AI to recommend training and development opportunities based on individual skills, career goals, and performance data.",
      impact: "High",
      timeframe: "Medium-term",
      category: "People & Skills",
      steps: [
        "Assess current learning management system capabilities",
        "Implement skills assessment and tracking",
        "Deploy AI recommendation algorithms",
        "Create personalized learning pathways",
        "Monitor and optimize recommendation accuracy"
      ]
    },
    {
      title: "Establish real-time workforce analytics dashboard",
      description: "Build a comprehensive analytics dashboard that provides real-time insights into workforce metrics, productivity patterns, and organizational health indicators.",
      impact: "Medium",
      timeframe: "Short-term",
      category: "Data Readiness",
      steps: [
        "Define key workforce metrics and KPIs",
        "Integrate data sources from multiple HR systems",
        "Design intuitive dashboard interface",
        "Implement real-time data processing",
        "Train leadership team on dashboard usage"
      ]
    }
  ];

  // Filter out recommendations that are similar to existing ones
  const filteredRecommendations = fallbackRecommendations.filter(rec =>
    !currentRecommendations.some(existing =>
      existing.toLowerCase().includes(rec.title.toLowerCase().split(' ')[0])
    )
  );

  return filteredRecommendations.slice(0, 3);
}

// Generate comprehensive prompt for Lab45 analysis
async function generateAnalysisPrompt(answers, comments = {}) {
  try {
    const questionsData = await fs.readFile(questionsPath, 'utf8');
    const questions = JSON.parse(questionsData);

    const formattedAnswers = [];

    for (const category of questions.categories) {
      const categoryAnswers = [];

      for (const question of category.questions) {
        if (answers[question.id]) {
          const selectedOption = question.options.find(o => o.value === answers[question.id]);
          categoryAnswers.push({
            questionId: question.id,
            question: question.text,
            answer: answers[question.id],
            answerText: selectedOption ? selectedOption.text : `Level ${answers[question.id]}`,
            comment: comments[question.id] || null
          });
        }
      }

      if (categoryAnswers.length > 0) {
        formattedAnswers.push({
          categoryId: category.id,
          categoryName: category.name,
          categoryDescription: category.description,
          answers: categoryAnswers
        });
      }
    }

    return `
      Analyze the following HR maturity assessment responses for an organization:
      
      Assessment Data:
      ${JSON.stringify(formattedAnswers, null, 2)}
      
      Please provide a comprehensive analysis in JSON format with this exact structure:
      {
        "overallScore": number (1-5),
        "categoryScores": {
          "category-id": number (1-5)
        },
        "strengths": ["strength1", "strength2", ...],
        "areasForImprovement": ["area1", "area2", ...],
        "recommendations": [
          {
            "title": "recommendation title",
            "description": "detailed description",
            "priority": "High|Medium|Low",
            "category": "category name",
            "timeframe": "Short-term|Medium-term|Long-term"
          }
        ],
        "maturityLevel": "string description of overall maturity",
        "nextSteps": ["step1", "step2", ...]
      }
      
      Consider the organization's current state and provide realistic, implementable suggestions
      that align with modern HR practices, AI adoption, and hybrid work models.
    `;
  } catch (error) {
    console.error('Error generating analysis prompt:', error);
    throw error;
  }
}

// Lab45 analysis function
async function analyzeWithLab45(prompt) {
  try {
    console.log(' Calling Lab45 for assessment analysis...');
    console.log(' Prompt:', prompt);

    const endpoint = `https://api.lab45.ai/v1.1/skills/completion/query`;

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.LAB45_API_KEY}`
    };

    const payload = {
      messages: [
        {
          role: 'system',
          content: `You are an expert HR maturity assessment analyst with deep knowledge of:
          - Modern HR practices and digital transformation
          - AI adoption in HR functions
          - Skills-based talent management
          - Hybrid work optimization
          - Data-driven HR decision making
          
          Always provide your analysis as a valid JSON object with the exact structure requested.
          Ensure all scores are realistic and based on the assessment responses.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      skill_parameters: {
        model_name: 'gpt-4',
        emb_type: 'openai',
        max_output_tokens: 3000,
        temperature: 0.7
      },
      stream_response: false
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    console.log(response);


    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lab45 API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Lab45 API raw result:', JSON.stringify(result, null, 2));

    let content = result?.choices?.[0]?.message?.content;

    // Fallback to data.content if not found
    if (!content && result?.data?.content) {
      content = result.data.content;
    }
    console.log('Lab45 API content:', content);

    if (!content) {
      // Try direct analysis object
      if (result?.overallScore && result?.categoryScores) {
        console.log('Lab45 returned analysis object directly.');
        return result;
      }
      console.error('No content received from Lab45 API, using fallback analysis.');
      return generateFallbackAnalysis();
    }

    try {
      const analysis = JSON.parse(content);
      console.log('Lab45 analysis completed successfully');
      return analysis;
    } catch (parseError) {
      console.log('Error parsing Lab45 response:', parseError);
      console.log('Using fallback analysis due to parsing error');
      return generateFallbackAnalysis();
    }

  } catch (error) {
    console.log(' Lab45 API error:', error);
    console.log(' Using fallback analysis due to Lab45 error');
    return generateFallbackAnalysis();
  }
}

// Fallback analysis function
function generateFallbackAnalysis() {
  return {
    overallScore: 3.2,
    categoryScores: {
      "people-skills": 3.5,
      "processes": 2.8,
      "systems-technology": 3.0,
      "ai-adoption": 2.6,
      "data-readiness": 3.1,
      "hybrid-work": 3.8
    },
    strengths: [
      "Good foundation in digital literacy",
      "Beginning to adopt skills-based approaches",
      "Strong hybrid work model implementation",
      "Commitment to employee development"
    ],
    areasForImprovement: [
      "Limited AI adoption across HR functions",
      "Immature data governance practices",
      "Manual processes still prevalent in key areas",
      "Need for more integrated technology stack"
    ],
    recommendations: [
      {
        title: "Implement AI-powered skills assessment",
        description: "Deploy an AI-based skills assessment tool to identify skill gaps and create personalized development plans",
        priority: "High",
        category: "People & Skills",
        timeframe: "Medium-term"
      },
      {
        title: "Automate routine HR processes",
        description: "Identify and automate repetitive HR tasks using workflow automation and AI",
        priority: "High",
        category: "Processes",
        timeframe: "Short-term"
      },
      {
        title: "Develop data governance framework",
        description: "Create a comprehensive data governance framework to ensure data quality and accessibility",
        priority: "Medium",
        category: "Data Readiness",
        timeframe: "Medium-term"
      }
    ],
    maturityLevel: "Transitioning - Moving from traditional to modern HR practices",
    nextSteps: [
      "Conduct detailed AI readiness assessment",
      "Prioritize process automation opportunities",
      "Establish data quality standards",
      "Create change management plan for digital transformation"
    ]
  };
}

// Get all results
async function getResults() {
  try {
    const data = await fs.readFile(resultsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading results:', error);
    return [];
  }
}

// Initialize and start server
async function startServer() {
  try {
    await initializeData();
    app.listen(PORT, () => {
      console.log(` HR Maturity Assessment Server running on port ${PORT}`);
      console.log(` API endpoints available at http://localhost:${PORT}/api`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` Lab45 configured: ${!!process.env.LAB45_API_KEY}`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
}

startServer();