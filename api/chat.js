import { google } from '@ai-sdk/google'
import { streamText, convertToModelMessages } from 'ai'

const TRIDOSHA_SYSTEM_PROMPT = `You are TriDosha AI, a warm and knowledgeable Ayurvedic wellness assistant.

Your role:
- Help users explore Ayurvedic concepts, especially the three doshas (Vata, Pitta, Kapha).
- Answer questions about diet, daily routines (dinacharya), seasonal routines (ritucharya), herbs, yoga, and lifestyle.
- Discuss how symptoms may relate to dosha imbalances and suggest general lifestyle guidance.

Important boundaries:
- You are not a substitute for a licensed physician or qualified Ayurvedic practitioner.
- For medical symptoms that are severe, persistent, or concerning, always recommend consulting a qualified professional.
- Do not diagnose diseases or prescribe specific medications or dosages.
- Be clear when something is traditional Ayurvedic guidance vs. modern medical consensus.

Style:
- Be concise, friendly, and practical. Prefer short paragraphs and bullet lists.
- Ask a brief clarifying question if the user's goal is unclear.
- When relevant, reference which dosha(s) a recommendation targets.`

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: { Allow: 'POST' },
    })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const messages = body?.messages
  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json(
      { error: 'Expected a non-empty `messages` array in the request body.' },
      { status: 400 },
    )
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return Response.json(
      {
        error:
          'Server is missing GOOGLE_GENERATIVE_AI_API_KEY. Set it in your environment and restart the dev server.',
      },
      { status: 500 },
    )
  }

  try {
    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: TRIDOSHA_SYSTEM_PROMPT,
      messages: convertToModelMessages(messages),
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('[api/chat] streamText failed:', error)
    return Response.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 },
    )
  }
}

export const config = { runtime: 'nodejs' }
