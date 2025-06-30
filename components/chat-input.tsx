"use client"

import type React from "react"

import type { FormEvent } from "react"
import { Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end space-x-3">
      <div className="flex-1">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me anything about coding... ✨"
          className="min-h-[60px] max-h-32 resize-none bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={!input.trim() || isLoading}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 h-[60px] px-6"
      >
        {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </form>
  )
}
