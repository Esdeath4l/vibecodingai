"use client"

import { useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { MessageBubble } from "./message-bubble"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content:
          "Hey there! 👋 I'm your Vibe Coding ChatGPT - ready to help you with coding questions, debug issues, explain concepts, or just vibe about tech! What's on your mind?",
      },
    ],
  })

  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
      {/* Chat Messages */}
      <ScrollArea className="h-[500px] p-6" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message.content} isUser={message.role === "user"} />
          ))}
          {isLoading && <TypingIndicator />}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="border-t border-white/10 p-4">
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
