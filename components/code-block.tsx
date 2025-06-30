"use client"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

interface CodeBlockProps {
  content: string
}

export function CodeBlock({ content }: CodeBlockProps) {
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.split("\n")
          const language = lines[0].replace("```", "").trim() || "javascript"
          const code = lines.slice(1, -1).join("\n")

          return (
            <div key={index} className="rounded-lg overflow-hidden border border-white/10">
              <div className="bg-slate-800 px-3 py-2 text-xs text-slate-300 border-b border-white/10">{language}</div>
              <SyntaxHighlighter
                language={language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  padding: "1rem",
                  background: "rgba(0, 0, 0, 0.3)",
                  fontSize: "0.875rem",
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          )
        } else {
          return (
            <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed">
              {part}
            </p>
          )
        }
      })}
    </div>
  )
}
