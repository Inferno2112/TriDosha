import { google } from '@ai-sdk/google'
import { streamText, convertToModelMessages } from 'ai'
import { withSupermemory } from '@supermemory/tools/ai-sdk'

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

const memoryPromptTemplate = (data) => `
<tridosha_memory>
  <known_profile>
    ${data.userMemories || 'No prior profile stored yet.'}
  </known_profile>
  <relevant_past_conversation>
    ${data.generalSearchMemories || 'No specifically relevant prior turns.'}
  </relevant_past_conversation>
  Use this context only if it's relevant to the user's current question. Never invent facts that aren't supported by it.
</tridosha_memory>
`.trim()

// Supermemory container tags must match /^[a-zA-Z0-9_:-]+$/. Emails contain
// '@' and '.', so we hex-escape every disallowed byte using ':XX' (two lowercase
// hex digits). ':' is valid in the target charset but cannot appear in an email,
// so reserving it as the escape prefix keeps the encoding unambiguous and
// collision-free: distinct inputs always produce distinct tags (e.g.
// `user.name@d.com` -> `user:2ename:40d:2ecom` while `user_name@d.com` ->
// `user_name:40d:2ecom`). Naively collapsing disallowed chars to '_' would
// alias those two emails to the same bucket and leak memories across users.
function toSupermemoryContainerTag(userId) {
  const bytes = new TextEncoder().encode(userId)
  let out = ''
  for (const byte of bytes) {
    const isAlnum =
      (byte >= 0x30 && byte <= 0x39) ||
      (byte >= 0x41 && byte <= 0x5a) ||
      (byte >= 0x61 && byte <= 0x7a)
    // Allowed pass-through: alnum, '_' (0x5f), '-' (0x2d).
    // ':' is allowed by the regex but reserved here as the escape prefix.
    if (isAlnum || byte === 0x5f || byte === 0x2d) {
      out += String.fromCharCode(byte)
    } else {
      out += ':' + byte.toString(16).padStart(2, '0')
    }
  }
  return out || 'anonymous'
}

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

  const userId = typeof body?.userId === 'string' ? body.userId.trim() : ''
  if (!userId) {
    return Response.json(
      { error: 'Expected a non-empty string `userId` in the request body.' },
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

  const baseModel = google('gemini-2.5-flash')
  const model = process.env.SUPERMEMORY_API_KEY
    ? withSupermemory(baseModel, toSupermemoryContainerTag(userId), {
        apiKey: process.env.SUPERMEMORY_API_KEY,
        mode: 'full',
        addMemory: 'always',
        skipMemoryOnError: true,
        promptTemplate: memoryPromptTemplate,
      })
    : baseModel

  try {
    const result = streamText({
      model,
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
