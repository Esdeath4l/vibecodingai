
# 🤖 Vibe Coding Chatbot – Agentic AI Developer Assistant

A real-time, interactive AI chatbot designed to help developers with coding queries, explanations, and debugging — powered by **SambaNova AI**, built using **Next.js**, **Tailwind CSS**, and **Lucide Icons**.

🔗 [Live Demo](https://v0-vibe-coding-chatbot-ritikas-projects-fcfe67ad.vercel.app)

---

## ✨ Features

- ⚡ Fast and responsive AI chat powered by SambaNova
- 💬 Clean, intuitive UI with markdown and code formatting
- 🧠 Context-aware interactions using message history
- 🎨 Elegant design using Tailwind CSS + Lucide Icons
- 🚀 Deployed on Vercel for optimal performance

---

## 📁 Project Structure

```

vibecodingai/
│
├── app/                    # App routes and pages
│   └── api/                # POST endpoint for handling chat messages
│
├── components/             # Chat UI components (ChatBox, Bubble, etc.)
├── lib/                    # Helper utilities
├── public/                 # Static assets
├── styles/                 # Tailwind config
├── .env.local              # API key configuration
├── next.config.js
├── tailwind.config.js
└── README.md

````

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Esdeath4l/vibecodingai.git
cd vibecodingai
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Environment Variables

Create a `.env.local` file and add your SambaNova or OpenAI API key:

```env
SAMBANOVA_API_KEY=your_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the chatbot live.

---

## 🧠 Technologies Used

* **Next.js** – App Router-based React framework
* **Tailwind CSS** – Utility-first styling
* **Lucide Icons** – Clean and modern icons
* **@ai-sdk/openai** – LLM interaction wrapper
* **SambaNova API** – High-performance LLM backend
* **Vercel** – Deployment and hosting

---

## 🏆 Hackathon Submission

This project is submitted for the **Agentic Chatbot Hackathon by Assessli**.

### 🧩 Problem Statement Addressed

> Build a real-time agentic chatbot with orchestration (LangGraph or Agno), STT, VAD, TTS modules, LLM APIs, scalable architecture, and multi-user support.

---

## 🧱 System Architecture (Planned)

```
User Input (Text/Voice)
     ↓
VAD + STT (Planned)
     ↓
Agent Orchestration (LangGraph / Agno)
     ↓
LLM API (SambaNova / OpenAI)
     ↓
TTS (Optional)
     ↓
Frontend UI (Next.js)
```

* Multi-user: planned via session context
* Memory/state: scoped per user interaction
* Voice support: STT/VAD module in development

---

## 💡 Future Enhancements

* LangGraph-based workflow orchestration
* STT using Whisper or faster real-time options
* TTS using Google/Suno/SpeechT5
* Persistent memory with Redis integration
* Mobile-responsive UI and dark mode toggle

---

## 👥 Team

**Ritika S.** – Full Stack Developer
**Rekha** – UI/UX & Component Design

GitHub: [@Esdeath4l](https://github.com/Esdeath4l)

---

## 📽️ Demo Video

*Will be added before prototype submission deadline (July 7, 2025).*

---

## 📝 License

This project is open source under the **MIT License**.

---

## 💖 Support

If you like the project:

🌟 Star this repo
🐛 Open an issue
📣 Share it with others
