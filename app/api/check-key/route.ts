export async function GET() {
  const apiKey = process.env.SAMBANOVA_API_KEY || process.env.OPENAI_API_KEY
  const hasKey = !!apiKey
  const provider = process.env.SAMBANOVA_API_KEY ? "Sambanova" : process.env.OPENAI_API_KEY ? "OpenAI" : "None"

  return Response.json({
    hasKey,
    provider,
    keyPreview: apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : null,
  })
}
