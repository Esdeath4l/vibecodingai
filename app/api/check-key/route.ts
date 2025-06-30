import { NextResponse } from "next/server"

export async function GET() {
  try {
    const sambanovaKey = process.env.SAMBANOVA_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (sambanovaKey) {
      return NextResponse.json({
        hasKey: true,
        provider: "Sambanova",
      })
    } else if (openaiKey) {
      return NextResponse.json({
        hasKey: true,
        provider: "OpenAI",
      })
    } else {
      return NextResponse.json({
        hasKey: false,
        provider: "None",
      })
    }
  } catch (error) {
    console.error("Error checking API key:", error)
    return NextResponse.json({
      hasKey: false,
      provider: "None",
    })
  }
}
