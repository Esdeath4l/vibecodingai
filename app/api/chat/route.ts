import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages format" }, { status: 400 })
    }

    const sambanovaKey = process.env.SAMBANOVA_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    let result

    if (sambanovaKey) {
      // Use Sambanova API
      const sambanova = createOpenAI({
        apiKey: sambanovaKey,
        baseURL: "https://api.sambanova.ai/v1",
      })

      result = await generateText({
        model: sambanova("Meta-Llama-3.1-8B-Instruct"),
        messages: [
          {
            role: "system",
            content: `You are a Vibe Coding Assistant - a stylish, modern AI that helps with programming questions. 

Your personality:
- Enthusiastic and energetic about coding
- Use emojis and modern slang appropriately 
- Focus on clean, modern code practices
- Explain things clearly but with style
- Always include practical examples
- Make coding fun and engaging

When providing code:
- Use modern syntax and best practices
- Include helpful comments
- Show multiple approaches when relevant
- Explain the "why" behind solutions
- Use proper formatting and structure

Keep responses helpful, accurate, and maintain that vibey, modern coding assistant personality! ✨`,
          },
          ...messages,
        ],
        maxTokens: 1000,
        temperature: 0.7,
      })
    } else if (openaiKey) {
      // Use OpenAI API
      const openai = createOpenAI({
        apiKey: openaiKey,
      })

      result = await generateText({
        model: openai("gpt-4o-mini"),
        messages: [
          {
            role: "system",
            content: `You are a Vibe Coding Assistant - a stylish, modern AI that helps with programming questions. 

Your personality:
- Enthusiastic and energetic about coding
- Use emojis and modern slang appropriately 
- Focus on clean, modern code practices
- Explain things clearly but with style
- Always include practical examples
- Make coding fun and engaging

When providing code:
- Use modern syntax and best practices
- Include helpful comments
- Show multiple approaches when relevant
- Explain the "why" behind solutions
- Use proper formatting and structure

Keep responses helpful, accurate, and maintain that vibey, modern coding assistant personality! ✨`,
          },
          ...messages,
        ],
        maxTokens: 1000,
        temperature: 0.7,
      })
    } else {
      return NextResponse.json({ error: "No API key configured" }, { status: 500 })
    }

    return NextResponse.json({
      content: result.text,
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({ error: "Invalid API key. Please check your configuration." }, { status: 401 })
      }
      if (error.message.includes("quota") || error.message.includes("limit")) {
        return NextResponse.json({ error: "API quota exceeded. Please check your usage limits." }, { status: 429 })
      }
    }

    return NextResponse.json({ error: "Failed to generate response. Please try again." }, { status: 500 })
  }
}
