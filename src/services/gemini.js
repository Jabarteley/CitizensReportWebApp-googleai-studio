import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

/**
 * Analyzes a crisis report using Google Gemini AI
 * @param {Object} report - The report data to analyze
 * @returns {Promise<Object>} AI analysis result
 */
export async function analyzeReport(report) {
  const prompt = `
You are an AI assistant for a Citizen Crisis Reporting System. 
Analyze the following crisis report and provide structured analysis.

Report Details:
- Type: ${report.type}
- Description: ${report.description}
- Location: ${report.location?.address || 'Not provided'}
- Urgency Level (user-reported): ${report.urgency}

Provide your analysis in the following JSON format ONLY (no extra text):

{
  "isSpam": boolean,
  "spamConfidence": number (0-1),
  "severityScore": number (0-1),
  "correctedCategory": "violence|accident|fire|kidnapping|medical|other",
  "summary": "A concise 1-2 sentence summary for emergency responders",
  "recommendedAction": "Suggested immediate response action",
  "keyEntities": ["list", "of", "key", "entities", "mentioned"],
  "sentiment": "urgent|concerning|informative"
}

Analysis Guidelines:
1. isSpam: true if the report is clearly fake, joking, or irrelevant
2. severityScore: 0-1 based on potential danger to life/property
3. correctedCategory: Your best guess of the actual crisis type
4. summary: Brief, actionable summary for responders
5. recommendedAction: Specific action (e.g., "Dispatch police", "Send ambulance")
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.warn('Gemini AI unavailable:', error.message);
    return {
      isSpam: false,
      spamConfidence: 0,
      severityScore: 0.5,
      correctedCategory: report.type || 'other',
      summary: report.description,
      recommendedAction: 'Review manually',
      keyEntities: [],
      sentiment: 'informative',
    };
  }
}

/**
 * Generates a brief summary of a report for public display
 * @param {string} text - The report text
 * @returns {Promise<string>} Summary
 */
export async function summarizeReport(text) {
  const prompt = `Summarize this crisis report in one sentence for public viewing: "${text}"`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error summarizing report:', error);
    return text;
  }
}

/**
 * Detects if uploaded image contains crisis-related content
 * @param {string} base64Image - Base64 encoded image
 * @param {string} reportType - Type of crisis reported
 * @returns {Promise<Object>} Image analysis result
 */
export async function analyzeImage(base64Image, reportType) {
  const prompt = `Analyze this image in the context of a ${reportType} report. 
  Is there evidence of crisis, danger, or emergency situation? 
  Respond in JSON format:
  {
    "crisisVisible": boolean,
    "confidence": number (0-1),
    "description": "Brief description of what's visible",
    "matchesReportType": boolean
  }`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: 'image/jpeg'
        }
      }
    ]);
    const response = await result.response;
    let text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }
    
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      crisisVisible: false,
      confidence: 0,
      description: 'Image analysis failed',
      matchesReportType: false
    };
  }
}

export default model;
