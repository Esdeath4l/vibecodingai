"use client"

import { useState, useEffect } from "react"
import { User, Bot, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CodeBlock } from "./code-block"

interface MessageBubbleProps {
  message: string
  isUser: boolean
}

export function MessageBubble({ message, isUser }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [displayedMessage, setDisplayedMessage] = useState("")
  const [isTyping, setIsTyping] = useState(!isUser)

  useEffect(() => {
    if (isUser) {
      setDisplayedMessage(message)
      return
    }

    // Typing animation for assistant messages
    let index = 0
    setDisplayedMessage("")
    setIsTyping(true)

    const timer = setInterval(() => {
      if (index < message.length) {
        setDisplayedMessage(message.slice(0, index + 1))
        index++
      } else {
        setIsTyping(false)
        clearInterval(timer)
      }
    }, 20)

    return () => clearInterval(timer)
  }, [message, isUser])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasCodeBlock = message.includes("```")

  return (
    <div className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gradient-to-r from-cyan-500 to-blue-500"
        }`}
      >
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      {/* Message */}
      <div className={`flex-1 max-w-[80%] ${isUser ? "text-right" : ""}`}>
        <div
          className={`relative group rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white ml-auto"
              : "bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/10 text-slate-100"
          }`}
        >
          {hasCodeBlock ? (
            <CodeBlock content={displayedMessage} />
          ) : (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {displayedMessage}
              {isTyping && <span className="animate-pulse">|</span>}
            </p>
          )}

          {/* Copy button */}
          {!isUser && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
