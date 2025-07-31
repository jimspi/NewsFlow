// pages/api/analyze-story.js
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pitch, headline } = req.body;

  if (!pitch || !headline) {
    return res.status(400).json({ error: 'Pitch and headline are required' });
  }

  try {
    const prompt = `
You are an AI editorial assistant for a newsroom. Analyze this story pitch and provide insights.

HEADLINE: ${headline}
PITCH: ${pitch}

Please analyze and respond with ONLY a valid JSON object (no markdown, no explanation) containing:

{
  "newsValue": number (1-10 scale based on public interest, impact, and newsworthiness),
  "publicInterest": array of 2-3 strings describing why the public should care,
  "suggestions": array of 2-3 specific editorial suggestions for developing the story,
  "recommendations": array of 2-3 recommendations for handling/timing the story,
  "urgencyScore": number (1-10 based on time sensitivity),
  "estimatedTimeline": string (like "2-3 weeks" based on story complexity),
  "competitorRisk": string ("LOW", "MEDIUM", or "HIGH"),
  "legalRisk": string ("LOW", "MEDIUM", or "HIGH"),
  "resourcesNeeded": array of 2-3 resources/expertise needed
}

Consider:
- Keywords indicating high news value: corruption, investigation, scandal, violation, fraud, safety
- Public impact: government accountability, taxpayer funds, public safety, healthcare, education
- Legal considerations: defamation risk, source protection, HIPAA compliance
- Competitive timing: breaking news, exclusive stories, developing situations
- Resource requirements: legal review, data analysis, investigative time

Return only the JSON object.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert editorial AI assistant. Respond only with valid JSON, no additional text or formatting."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content.trim();
    
    // Parse the JSON response
    let analysis;
    try {
      analysis = JSON.parse(response);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate required fields
    const requiredFields = ['newsValue', 'publicInterest', 'suggestions', 'recommendations', 'urgencyScore'];
    for (const field of requiredFields) {
      if (!(field in analysis)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    res.status(200).json(analysis);

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Return fallback analysis if OpenAI fails
    const fallbackAnalysis = generateFallbackAnalysis(pitch, headline);
    res.status(200).json(fallbackAnalysis);
  }
}

function generateFallbackAnalysis(pitch, headline) {
  const combinedText = `${headline} ${pitch}`.toLowerCase();
  
  // Basic keyword analysis for fallback
  let newsValue = 5.0;
  const highValueKeywords = ['corruption', 'investigation', 'scandal', 'violation', 'fraud', 'safety'];
  const highValueMatches = highValueKeywords.filter(keyword => combinedText.includes(keyword)).length;
  
  if (highValueMatches > 0) {
    newsValue = Math.min(7.5 + (highValueMatches * 0.5), 10);
  }

  const publicInterest = [];
  if (combinedText.includes('government') || combinedText.includes('official')) {
    publicInterest.push('Government transparency and accountability');
  }
  if (combinedText.includes('tax') || combinedText.includes('budget')) {
    publicInterest.push('Taxpayer funds and financial responsibility');
  }
  if (combinedText.includes('safety') || combinedText.includes('health')) {
    publicInterest.push('Public safety and community welfare');
  }
  
  if (publicInterest.length === 0) {
    publicInterest.push('Local community impact and civic awareness');
  }

  return {
    newsValue: Math.round(newsValue * 10) / 10,
    publicInterest: publicInterest.slice(0, 3),
    suggestions: [
      'Develop additional sources to strengthen the story',
      'Gather supporting documentation',
      'Consider legal review and fact-checking requirements'
    ],
    recommendations: [
      'Standard editorial review process',
      'Monitor for related developments',
      'Prepare for potential stakeholder responses'
    ],
    urgencyScore: newsValue > 7 ? 7 : 5,
    estimatedTimeline: newsValue > 8 ? '3-4 weeks' : '2-3 weeks',
    competitorRisk: 'MEDIUM',
    legalRisk: combinedText.includes('corruption') || combinedText.includes('fraud') ? 'HIGH' : 'LOW',
    resourcesNeeded: ['Editorial review', 'Legal consultation', 'Research support']
  };
}
