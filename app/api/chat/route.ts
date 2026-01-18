import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { sambanova } from "@ai-sdk/sambanova"
import { Redis } from "@upstash/redis" // Import Upstash Redis client

// Initialize Upstash Redis client
const kvUrl = process.env.UPSTASH_REDIS_REST_URL!
const kvToken = process.env.UPSTASH_REDIS_REST_TOKEN!

// Log the Upstash KV URL and a masked version of the token to verify environment variables are loaded
console.log("Upstash Redis URL:", kvUrl ? "Loaded" : "NOT LOADED")
console.log("Upstash Redis Token:", kvToken ? "Loaded (masked)" : "NOT LOADED")

const redis = new Redis({
  url: kvUrl,
  token: kvToken,
})

export async function POST(req: NextRequest) {
  try {
    // Log incoming request body
    const requestBody = await req.json()
    console.log("Incoming request body:", requestBody)

    const { userId, newMessageContent } = requestBody

    if (!newMessageContent) {
      console.error("Error: Message content is required.")
      return NextResponse.json({ error: "Message content is required" }, { status: 400 })
    }
    // For now, use a placeholder userId if not provided.
    // In a real app, this would come from authenticated session.
    const currentUserId = userId || "00000000-0000-0000-0000-000000000001" // Placeholder user ID
    console.log("Current User ID:", currentUserId)

    const conversationKey = `chat:user:${currentUserId}`

    // 1. Fetch previous messages for context from Upstash KV
    console.log(`Attempting to fetch history for key: ${conversationKey}`)
    const existingHistory = await redis.get<Array<{ role: string; content: string }>>(conversationKey)
    console.log("Existing history from Upstash KV:", existingHistory)

    // Combine previous messages with the new user message for the AI context
    // If no existing history, start with an empty array
    const messagesForAI: Array<{ role: string; content: string }> = [
      {
        role: "system",
        content: `You are Jarvis, a highly advanced, real-time AI assistant specializing in coding and development. Your primary goal is to provide dynamic, insightful, and actionable coding support with a sophisticated, helpful, and slightly formal "vibe."

Your core capabilities and personality:
- **Agentic Reasoning:** You can break down complex problems, plan multi-step solutions, and simulate tool usage.
- **Memory Integration:** You maintain context from the conversation (short-term memory) and can simulate retrieving information from a knowledge base (long-term memory).
- **Tool Awareness:** You understand that you *can* use tools (like search, code execution, or external APIs) even if you don't execute them directly in this environment. Mention when a tool *would* be useful.
- **Real-time Focus:** You are designed for quick, concise, and relevant responses, simulating a real-time interaction.
- **Sophisticated & Helpful:** Maintain a polite, intelligent, and efficient tone.
- **Code-Centric:** Always prioritize providing clean, modern, and practical code examples.
- **Clarity & Precision:** Explain concepts clearly and accurately.

When a user asks a question:
1. **Understand Intent:** Determine if it's a simple query, requires problem-solving, or implies tool use.
2. **Plan (Simulated):** Briefly outline how you would approach the problem, mentioning any "tools" you'd consider using (e.g., "I would consult a search protocol for that," or "This would necessitate a code execution module").
3.  **Retrieve (Simulated):** If relevant, mention how you would access "memory" or "knowledge."
4.  **Generate Response:** Provide a concise, helpful, and precise answer, including code examples where appropriate.

Example of tool awareness:
"That is an excellent query. If I had a live search protocol, I would swiftly ascertain the latest syntax for that. For now, based on my current data..."

Example of memory awareness:
"Building upon our previous discussion regarding React, here is how you could extend that component..."

Maintain a helpful, accurate, and sophisticated persona.`,
      },
      ...(existingHistory || []), // Add previous messages from Upstash KV
      { role: "user", content: newMessageContent }, // Add the new user message
    ]
    console.log("Messages for AI:", messagesForAI)

    const sambanovaKey = process.env.SAMBANOVA_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    console.log("Sambanova API Key status:", sambanovaKey ? "Loaded (masked)" : "NOT LOADED")
    console.log("OpenAI API Key status:", openaiKey ? "Loaded (masked)" : "NOT LOADED")

    let result

    if (sambanovaKey) {
      // Use Sambanova API with proper AI SDK 5 format
      console.log("Using Sambanova AI model.")
      result = await generateText({
        model: sambanova("Meta-Llama-3.1-8B-Instruct"),
        messages: messagesForAI as any, // Cast to any to match AI SDK's Message type
        maxTokens: 1000,
        temperature: 0.7,
      })
    } else if (openaiKey) {
      // Use OpenAI API
      const openai = createOpenAI({
        apiKey: openaiKey,
      })
      console.log("Using OpenAI AI model.")
      result = await generateText({
        model: openai("gpt-4o-mini"),
        messages: messagesForAI as any, // Cast to any to match AI SDK's Message type
        maxTokens: 1000,
        temperature: 0.7,
      })
    } else {
      console.error("Error: No AI API key configured.")
      return NextResponse.json({ error: "No AI API key configured" }, { status: 500 })
    }
    console.log("AI response generated.")

    // 2. Save user message and AI response to Upstash KV
    const updatedHistory = [
      ...(existingHistory || []),
      { role: "user", content: newMessageContent },
      { role: "assistant", content: result.text },
    ]
    console.log("Saving updated history to Upstash KV:", updatedHistory)
    await redis.set(conversationKey, updatedHistory)
    console.log("History saved to Upstash KV.")

    return NextResponse.json({
      content: result.text,
      // No conversationId to return with Upstash KV, as userId is the key
    })
  } catch (error) {
    console.error("Chat API error:", error)

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({ error: "Invalid AI API key. Please check your configuration." }, { status: 401 })
      }
      if (error.message.includes("quota") || error.message.includes("limit")) {
        return NextResponse.json({ error: "AI API quota exceeded. Please check your usage limits." }, { status: 429 })
      }
      // Add specific error handling for Upstash KV if needed
      if (error.message.includes("Upstash") || error.message.includes("Redis")) {
        return NextResponse.json(
          { error: `Upstash KV error: ${error.message}. Check KV_REST_API_URL and KV_REST_API_TOKEN.` },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
  }
}
