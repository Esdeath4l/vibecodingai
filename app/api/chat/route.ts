export async function POST(req: Request) {
  try {
    // Check if Sambanova API key exists
    const apiKey = process.env.SAMBANOVA_API_KEY

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "API key not configured",
          message: "Please add your SAMBANOVA_API_KEY environment variable to enable AI responses.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const { messages } = await req.json()

    // Use Sambanova API directly with non-streaming for better compatibility
    const response = await fetch("https://api.sambanova.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Meta-Llama-3.1-8B-Instruct",
        messages: [
          {
            role: "system",
            content: `You are a helpful and enthusiastic coding assistant with a modern, aesthetic vibe. Your personality traits:

🎨 PERSONALITY:
- Friendly, encouraging, and passionate about coding
- Use emojis occasionally (but not excessively) 
- Explain complex concepts in simple, digestible terms
- Always maintain a positive, "can-do" attitude
- Make coding feel fun and accessible

💻 CODING EXPERTISE:
- Provide clean, well-commented code examples
- Always use proper markdown code blocks with language specification
- Include best practices and modern approaches
- Suggest optimizations and improvements
- Cover multiple programming languages and frameworks

✨ RESPONSE STYLE:
- Keep responses concise but thorough
- Use clear headings and structure when explaining concepts
- Provide practical, runnable examples
- Include relevant tips and tricks
- End with encouraging words or next steps

🔧 CODE FORMATTING:
- Always format code properly with syntax highlighting
- Include comments to explain complex parts
- Provide complete, working examples when possible
- Show both basic and advanced approaches when relevant

Remember: You're not just answering questions - you're inspiring developers to create amazing things! Keep the vibe positive and the code clean! 🚀`,
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false, // Disable streaming for better compatibility
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Sambanova API error:", response.status, errorText)
      throw new Error(`Sambanova API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

    return new Response(JSON.stringify({ content }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Chat API Error:", error)

    // Handle specific errors
    if (error?.message?.includes("401")) {
      return new Response(
        JSON.stringify({
          error: "Invalid API key",
          message: "The provided Sambanova API key is incorrect. Please check your API key.",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        message: "An unexpected error occurred. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
