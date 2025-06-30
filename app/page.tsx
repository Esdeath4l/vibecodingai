"use client"

import type React from "react"
import type SpeechRecognition from "speech-recognition" // Import SpeechRecognition
import { useState, useRef, useEffect } from "react"
import { Send, Code, Sparkles, Moon, Sun, Bot, User, AlertCircle, Mic } from "lucide-react" // Added Mic and Volume2 icons
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Declare Web Speech API interfaces globally for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance
  }
}

export default function VibeCodingChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hey there! 👋 I'm your Vibe Coding Assistant. I'm currently running in demo mode with simulated responses. To get real AI responses, add your Sambanova API key as an environment variable! Ask me anything about programming! ✨",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [provider, setProvider] = useState("None")
  const [isRecording, setIsRecording] = useState(false) // State for recording
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Web Speech API refs
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null)

  // Check if API key is available
  useEffect(() => {
    fetch("/api/check-key")
      .then((res) => res.json())
      .then((data) => {
        setHasApiKey(data.hasKey)
        setProvider(data.provider)
        if (data.hasKey) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === "welcome"
                ? {
                    ...msg,
                    content: `Hey there! 👋 I'm your Vibe Coding Assistant powered by ${data.provider} AI. Ready to code with some style? Ask me anything about programming! ✨`,
                  }
                : msg,
            ),
          )
        }
      })
      .catch(() => {
        setHasApiKey(false)
        setProvider("None")
      })

    // Initialize Web Speech API
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      recognitionRef.current.continuous = false // Listen for a single utterance
      recognitionRef.current.interimResults = true // Get results as they come in
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("")
        setInput(transcript) // Update input field with live transcript
      }

      recognitionRef.current.onend = () => {
        setIsRecording(false)
        if (input.trim()) {
          // If there's transcribed text, submit it
          handleSubmit(new Event("submit") as React.FormEvent)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        setIsRecording(false)
        alert(`Speech recognition error: ${event.error}. Please try again or check microphone permissions.`)
      }
    } else {
      console.warn("Web Speech API not supported in this browser.")
    }

    if ("speechSynthesis" in window) {
      speechSynthesisRef.current = window.speechSynthesis
    } else {
      console.warn("Web Speech Synthesis API not supported in this browser.")
    }
  }, [input]) // Re-run effect if input changes to ensure onend has latest input

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const highlightCode = (code: string) => {
    const keywords = [
      "function",
      "const",
      "let",
      "var",
      "if",
      "else",
      "for",
      "while",
      "return",
      "class",
      "import",
      "export",
      "async",
      "await",
      "try",
      "catch",
      "interface",
      "type",
      "enum",
      "public",
      "private",
      "protected",
      "static",
      "extends",
      "implements",
    ]
    const strings = /(".*?"|'.*?'|`.*?`)/g
    const comments = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm
    const numbers = /\b\d+\.?\d*\b/g

    let highlighted = code

    // Highlight strings
    highlighted = highlighted.replace(strings, '<span class="text-emerald-400">$1</span>')

    // Highlight comments
    highlighted = highlighted.replace(comments, '<span class="text-gray-400 italic">$1</span>')

    // Highlight numbers
    highlighted = highlighted.replace(numbers, '<span class="text-cyan-400">$&</span>')

    // Highlight keywords
    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g")
      highlighted = highlighted.replace(regex, `<span class="text-purple-400 font-semibold">${keyword}</span>`)
    })

    return highlighted
  }

  const simulateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("react") || lowerMessage.includes("component")) {
      return `Here's a cool React component example:

\`\`\`jsx
function VibeButton({ children, onClick, variant = "primary" }) {
  const baseClasses = "px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-purple-500/25",
    secondary: "bg-gray-800 text-white border border-gray-600 hover:bg-gray-700",
    outline: "border-2 border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white"
  }
  
  return (
    <button 
      onClick={onClick}
      className={\`\${baseClasses} \${variants[variant]}\`}
    >
      {children}
    </button>
  )
}

// Usage
<VibeButton variant="primary" onClick={() => console.log('Clicked!')}>
  Click me! ✨
</VibeButton>
\`\`\`

This creates a button with that aesthetic gradient vibe and multiple variants! Perfect for modern UIs! 🎨`
    }

    if (lowerMessage.includes("javascript") || lowerMessage.includes("js")) {
      return `Here's some smooth JavaScript with modern ES6+ features:

\`\`\`javascript
// Create dynamic vibe effects
class VibeEffects {
  constructor() {
    this.colors = ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5', '#ffbe0b']
    this.particles = []
  }
  
  createParticle(x, y) {
    return {
      x, y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      life: 1.0,
      decay: 0.02
    }
  }
  
  animate() {
    this.particles = this.particles
      .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - p.decay }))
      .filter(p => p.life > 0)
    
    requestAnimationFrame(() => this.animate())
  }
  
  explode(x, y) {
    for (let i = 0; i < 20; i++) {
      this.particles.push(this.createParticle(x, y))
    }
  }
}

// Usage
const effects = new VibeEffects()
effects.animate()

// Add click effects
document.addEventListener('click', (e) => {
  effects.explode(e.clientX, e.clientY)
})
\`\`\`

This creates interactive particle effects with modern JavaScript! Click anywhere to see the magic! ✨`
    }

    if (lowerMessage.includes("css") || lowerMessage.includes("style")) {
      return `Here's some aesthetic CSS with modern techniques:

\`\`\`css
/* Cyberpunk Vibe Card */
.vibe-card {
  background: linear-gradient(135deg, 
    rgba(147, 51, 234, 0.1) 0%, 
    rgba(79, 70, 229, 0.1) 50%, 
    rgba(236, 72, 153, 0.1) 100%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.vibe-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255, 255, 255, 0.1), 
    transparent);
  transition: left 0.5s;
}

.vibe-card:hover::before {
  left: 100%;
}

/* Glowing text effect */
.glow-text {
  color: #fff;
  text-shadow: 
    0 0 5px #ff006e,
    0 0 10px #ff006e,
    0 0 15px #ff006e,
    0 0 20px #ff006e;
  animation: pulse-glow 2s ease-in-out infinite alternate;
}

@keyframes pulse-glow {
  from { text-shadow: 0 0 5px #ff006e, 0 0 10px #ff006e; }
  to { text-shadow: 0 0 10px #ff006e, 0 0 30px #ff006e; }
}
\`\`\`

Perfect for creating that futuristic, cyberpunk aesthetic! These effects will make your UI stand out! 🌈✨`
    }

    if (lowerMessage.includes("python")) {
      return `Here's some stylish Python code:

\`\`\`python
import random
import time
from typing import List, Dict

class VibeCodeGenerator:
    def __init__(self):
        self.color_palettes = {
            'cyberpunk': ['#ff006e', '#8338ec', '#3a86ff', '#06ffa5'],
            'sunset': ['#ff9500', '#ff5722', '#e91e63', '#9c27b0'],
            'ocean': ['#00bcd4', '#2196f3', '#3f51b5', '#673ab7'],
            'forest': ['#4caf50', '#8bc34a', '#cddc39', '#ffeb3b']
        }
    
    def generate_palette(self, theme: str = 'cyberpunk') -> List[str]:
        """Generate a random color palette with vibe"""
        base_colors = self.color_palettes.get(theme, self.color_palettes['cyberpunk'])
        return random.sample(base_colors, k=min(3, len(base_colors)))
    
    def create_gradient_css(self, colors: List[str], direction: str = '45deg') -> str:
        """Create CSS gradient from colors"""
        gradient = f"linear-gradient({direction}, {', '.join(colors)})"
        return f"background: {gradient};"
    
    def animate_text(self, text: str, delay: float = 0.1) -> None:
        """Animate text output with style"""
        for char in text:
            print(char, end='', flush=True)
            time.sleep(delay)
        print()  // New line at the end

# Usage example
generator = VibeCodeGenerator()

# Generate a cyberpunk palette
colors = generator.generate_palette('cyberpunk')
print(f"🎨 Generated palette: {colors}")

# Create CSS gradient
css = generator.create_gradient_css(colors)
print(f"✨ CSS: {css}")

# Animate some text
generator.animate_text("🚀 Python can be aesthetic too!")
\`\`\`

Python with style! This creates dynamic color palettes and animated effects! 🐍✨`
    }

    // Default responses
    const responses = [
      "That's a great question! Let me help you code with some style ✨\n\nCould you be more specific about what you'd like to know? I can help with:\n• React components and hooks\n• JavaScript/TypeScript patterns\n• CSS styling and animations\n• Python scripting\n• Code optimization\n• Debugging tips\n\nWhat interests you most? 🚀",
      "Interesting! I love helping with coding challenges! 🔮\n\nTo give you the best answer, could you tell me:\n• What programming language you're using\n• What specific problem you're trying to solve\n• Any code you're currently working with\n\nI'm here to make your code both functional AND beautiful! ✨",
      "Love the energy! Let's create something amazing together 💫\n\nI can help you with:\n• Writing clean, modern code\n• Explaining complex concepts\n• Debugging and optimization\n• Best practices and patterns\n• Making your code more aesthetic\n\nWhat would you like to explore? 🎨",
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      if (hasApiKey) {
        // Use real AI API (simplified non-streaming)
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
          }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || "API request failed")
        }

        const data = await response.json()
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.content || "Sorry, I couldn't generate a response.",
          role: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        speak(botMessage.content) // Speak the AI's response
      } else {
        // Use simulated response
        setTimeout(
          () => {
            const response = simulateResponse(currentInput)
            const botMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: response,
              role: "assistant",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, botMessage])
            speak(botMessage.content) // Speak the simulated response
          },
          1000 + Math.random() * 1000,
        )
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : "Unknown error"}. Running in demo mode. 🤖`,
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      speak(errorMessage.content) // Speak the error message
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  // Enhanced text formatting function
  const formatText = (text: string) => {
    // Handle bold text (**text** or __text__)
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    formatted = formatted.replace(/__(.*?)__/g, '<strong class="font-bold">$1</strong>')

    // Handle italic text (*text* or _text_)
    formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    formatted = formatted.replace(/_(.*?)_/g, '<em class="italic">$1</em>')

    // Handle inline code (`code`)
    formatted = formatted.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-700 text-pink-300 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
    )

    return formatted
  }

  const renderMessage = (content: string) => {
    if (content.includes("```")) {
      const parts = content.split("```")
      return (
        <div>
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              // This is code
              const lines = part.split("\n")
              const language = lines[0]?.trim() || "code"
              const code = lines.slice(1).join("\n")

              return (
                <div key={index} className="my-4">
                  <div className="bg-gray-800 rounded-t-lg px-4 py-2 text-sm text-gray-300 flex items-center gap-2 border-b border-gray-700">
                    <Code size={16} />
                    <span className="capitalize font-medium">{language}</span>
                  </div>
                  <pre className="bg-gray-900 rounded-b-lg p-4 overflow-x-auto border border-gray-700 border-t-0">
                    <code
                      className="text-sm font-mono text-gray-100 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
                    />
                  </pre>
                </div>
              )
            } else {
              // Regular text with formatting
              return (
                <div
                  key={index}
                  className="whitespace-pre-wrap leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatText(part) }}
                />
              )
            }
          })}
        </div>
      )
    }

    return (
      <div className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(content) }} />
    )
  }

  // --- Web Speech API Functions ---
  const startSpeechRecognition = () => {
    if (recognitionRef.current && !isRecording) {
      setInput("") // Clear input before starting
      recognitionRef.current.start()
      setIsRecording(true)
      console.log("Speech recognition started...")
    } else if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop() // Stop if already recording
      setIsRecording(false)
      console.log("Speech recognition stopped.")
    } else {
      alert("Speech Recognition API not supported or initialized.")
    }
  }

  const speak = (text: string) => {
    if (speechSynthesisRef.current && text) {
      // Stop any ongoing speech
      if (speechSynthesisRef.current.speaking) {
        speechSynthesisRef.current.cancel()
      }
      const utterance = new SpeechSynthesisUtterance(text)
      // Optional: Set voice, pitch, rate
      // utterance.voice = speechSynthesisRef.current.getVoices().find(voice => voice.lang === 'en-US' && voice.name === 'Google US English');
      // utterance.pitch = 1;
      // utterance.rate = 1;
      speechSynthesisRef.current.speak(utterance)
    } else {
      console.warn("Speech Synthesis API not supported or text is empty.")
    }
  }
  // --- End Web Speech API Functions ---

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
      }`}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen max-w-4xl mx-auto">
        {/* Header */}
        <header
          className={`p-6 border-b backdrop-blur-sm ${
            isDark ? "border-gray-700 bg-black/20" : "border-gray-200 bg-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>Vibe Coding ChatGPT</h1>
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                  {hasApiKey ? `Powered by ${provider} AI • ` : "Demo Mode • "}Code with style ✨
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className={`${isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          </div>

          {/* API Key Status */}
          {!hasApiKey && (
            <Alert className="mt-4 border-amber-500/20 bg-amber-500/10">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-200">
                <strong>Demo Mode:</strong> Add your Sambanova API key as <code>SAMBANOVA_API_KEY</code> environment
                variable for real AI responses!
              </AlertDescription>
            </Alert>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              } animate-in slide-in-from-bottom-2 duration-300`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                    : "bg-gradient-to-r from-purple-500 to-pink-500"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message */}
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    : isDark
                      ? "bg-gray-800/80 text-gray-100 border border-gray-700"
                      : "bg-white/80 text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg`}
              >
                {renderMessage(message.content)}
                <div
                  className={`text-xs mt-2 opacity-60 ${
                    message.role === "user" ? "text-white" : isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  isDark
                    ? "bg-gray-800/80 text-gray-100 border border-gray-700"
                    : "bg-white/80 text-gray-900 border border-gray-200"
                } backdrop-blur-sm shadow-lg`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span className="text-sm opacity-60">
                    {hasApiKey ? `${provider} AI is thinking...` : "Generating response..."}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div
          className={`p-6 border-t backdrop-blur-sm ${
            isDark ? "border-gray-700 bg-black/20" : "border-gray-200 bg-white/20"
          }`}
        >
          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isRecording
                  ? "Listening..."
                  : hasApiKey
                    ? `Ask ${provider} AI anything about coding... ✨`
                    : "Ask me anything about coding... ✨"
              }
              className={`flex-1 ${
                isDark
                  ? "bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white/50 border-gray-300 text-gray-900 placeholder-gray-500"
              } backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              disabled={isLoading || isRecording} // Disable input while recording
            />
            {/* Microphone Button */}
            <Button
              type="button" // Important: type="button" to prevent form submission
              onClick={startSpeechRecognition}
              disabled={isLoading}
              className={`bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105 ${
                isRecording ? "animate-pulse-fast ring-4 ring-blue-500/50" : ""
              }`}
            >
              <Mic size={18} className={isRecording ? "text-red-400" : ""} />
            </Button>
            <Button
              type="submit"
              disabled={!input.trim() || isLoading || isRecording} // Disable submit while recording
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105"
            >
              {isLoading ? <Sparkles size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </form>
          <p className={`text-xs mt-2 text-center ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            {hasApiKey ? `Powered by ${provider} AI • ` : "Demo Mode • "}Press Enter to send
          </p>
        </div>
      </div>
    </div>
  )
}
