/**
 * Farmer-Friendly AI Service
 * Simplifies technical agricultural text to farmer-friendly language
 * Uses DeepSeek-V3 for high-quality rewriting
 */

const OPENROUTER_API_KEY = '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'
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

// Best models from your test results
const PRIMARY_MODEL = 'deepseek/deepseek-chat' // DeepSeek-V3
const FALLBACK_MODEL = 'meta-llama/llama-3.3-70b-instruct' // Llama 3.3 70B

interface SimplificationRequest {
  originalText: string
  context: 'benefits' | 'risks' | 'recommendations' | 'general'
  farmerProfile?: {
    education?: string
    language?: 'en' | 'hi'
    region?: string
  }
}

interface SimplificationResponse {
  simplifiedText: string
  success: boolean
  model: string
}

/**
 * Simplify technical agricultural text to farmer-friendly language
 */
export async function simplifyForFarmers(
  request: SimplificationRequest
): Promise<SimplificationResponse> {
  const systemPrompt = getSystemPrompt(request.context)
  const userPrompt = getUserPrompt(request)

  try {
    // Try primary model first
    const response = await callOpenRouter(systemPrompt, userPrompt, PRIMARY_MODEL)
    return {
      simplifiedText: response,
      success: true,
      model: PRIMARY_MODEL
    }
  } catch (error) {
    console.error('Primary model failed, trying fallback:', error)
    
    try {
      // Fallback to Llama
      const response = await callOpenRouter(systemPrompt, userPrompt, FALLBACK_MODEL)
      return {
        simplifiedText: response,
        success: true,
        model: FALLBACK_MODEL
      }
    } catch (fallbackError) {
      console.error('Fallback model also failed:', fallbackError)
      // Return original text if all fails
      return {
        simplifiedText: request.originalText,
        success: false,
        model: 'none'
      }
    }
  }
}

/**
 * Batch simplify multiple texts (benefits + risks together)
 */
export async function batchSimplify(requests: {
  benefits: string
  risks: string
  recommendations?: string[]
}): Promise<{
  benefits: string
  risks: string
  recommendations: string[]
}> {
  const [benefitsResult, risksResult] = await Promise.all([
    simplifyForFarmers({
      originalText: requests.benefits,
      context: 'benefits'
    }),
    simplifyForFarmers({
      originalText: requests.risks,
      context: 'risks'
    })
  ])

  // Simplify recommendations if provided
  let simplifiedRecs = requests.recommendations || []
  if (requests.recommendations && requests.recommendations.length > 0) {
    const recsResult = await simplifyForFarmers({
      originalText: requests.recommendations.join('\n'),
      context: 'recommendations'
    })
    simplifiedRecs = recsResult.simplifiedText.split('\n').filter(r => r.trim())
  }

  return {
    benefits: benefitsResult.simplifiedText,
    risks: risksResult.simplifiedText,
    recommendations: simplifiedRecs
  }
}

/**
 * Get system prompt based on context
 */
function getSystemPrompt(context: string): string {
  const basePrompt = `You are an agricultural expert who communicates with farmers in simple, clear language. Your job is to take technical agricultural text and rewrite it in a way that:

1. Is easy for farmers to understand (8th-grade reading level)
2. Uses simple, everyday words instead of technical jargon
3. Sounds natural and conversational, NOT like AI-generated text
4. Focuses on practical, actionable information
5. Uses local Indian farming context and terminology
6. Avoids phrases like "AI-driven", "optimize", "enhance", etc.
7. Speaks directly to the farmer (use "you" and "your farm")
8. Removes any markers like "**" or formatting that looks AI-generated

CRITICAL: Your output should sound like it was written by an experienced farmer giving advice to another farmer, NOT like a research paper or AI bot.`

  const contextSpecific = {
    benefits: `\n\nContext: You're explaining the BENEFITS of a crop rotation plan. Focus on:
- What the farmer will gain (more money, better soil, less work)
- Use numbers and specific examples when possible
- Make it sound exciting and achievable
- Remove technical terms like "nitrogen fixation" - say "soil gets richer naturally"`,
    
    risks: `\n\nContext: You're explaining RISKS and CHALLENGES. Focus on:
- What could go wrong and how likely it is
- Simple ways to prevent or handle each risk
- Don't scare the farmer - be honest but reassuring
- Use "might happen" instead of "statistical probability"`,
    
    recommendations: `\n\nContext: You're giving PRACTICAL ADVICE. Focus on:
- Step-by-step actions the farmer can take
- Why each action matters in simple terms
- Make it sound doable, not overwhelming
- Use "try this" instead of "implement" or "adopt"`,
    
    general: ''
  }

  return basePrompt + (contextSpecific[context as keyof typeof contextSpecific] || contextSpecific.general)
}

/**
 * Get user prompt with the text to simplify
 */
function getUserPrompt(request: SimplificationRequest): string {
  return `Rewrite this text in simple, farmer-friendly language:

${request.originalText}

Remember:
- Make it sound human and natural
- Remove all AI-style formatting (**, ##, etc.)
- Use simple words
- Be conversational and direct
- Focus on what matters to the farmer

Simplified version:`
}

/**
 * Call OpenRouter API
 */
async function callOpenRouter(
  systemPrompt: string,
  userPrompt: string,
  model: string
): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://krishichakra.app', // Optional
      'X-Title': 'KrishiChakra' // Optional
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from model')
  }

  return data.choices[0].message.content.trim()
}

/**
 * Remove AI-style formatting from text
 */
export function cleanAIFormatting(text: string): string {
  return text
    .replace(/\*\*/g, '') // Remove bold markers
    .replace(/##\s*/g, '') // Remove headers
    .replace(/\*/g, '') // Remove bullet asterisks
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
    .replace(/`([^`]+)`/g, '$1') // Remove code markers
    .trim()
}
