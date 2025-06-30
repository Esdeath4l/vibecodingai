
# Vibe Coding Chatbot 🤖💻

A real-time, interactive AI chatbot designed for helping developers with coding queries, debugging, and explanations — powered by **SambaNova AI** and built using **Next.js**, **Tailwind CSS**, and **Lucide Icons**.

🔗 [Live Demo](https://v0-vibe-coding-chatbot-ritikas-projects-fcfe67ad.vercel.app)

## ✨ Features

- ⚡ Fast and responsive AI responses powered by **SambaNova API**
- 💬 Clean chat interface with markdown rendering and code formatting
- 🎨 Elegant UI with **Tailwind CSS** and **Lucide Icons**
- 🧠 Message-based interaction system using OpenAI SDK or custom LLM support
- 🚀 Deployed on **Vercel** for fast performance and scalability

## 📁 Project Structure

```

vibecodingai/
│
├── app/                    # App routes and pages
│   └── api/                # API routes (POST handler for AI chat)
│
├── components/             # Reusable UI components (ChatBox, MessageBubble, etc.)
├── lib/                    # Utility and helper functions
├── public/                 # Static files and assets
├── styles/                # Tailwind CSS configurations
├── .env.local              # API keys and secrets (not committed)
├── next.config.js
├── tailwind.config.js
└── README.md

````

## ⚙️ Getting Started

### 1. Clone the Repo

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

Create a `.env.local` file in the root and add your SambaNova or OpenAI API key:

```
SAMBANOVA_API_KEY=your_sambanova_api_key_here
```

### 4. Run the App

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the chatbot in action.

## 🧠 Technologies Used

* **Next.js** — React Framework for Server-Side Rendering
* **Tailwind CSS** — Utility-first styling
* **Lucide Icons** — Beautiful open-source icons
* **@ai-sdk/openai** — AI message handling layer
* **SambaNova API** — Custom LLM backend

## 📦 Deployment

This app is deployed with [Vercel](https://vercel.com). To deploy your own version:

1. Push your code to GitHub
2. Import into Vercel
3. Add environment variables
4. Deploy 🚀

## 🙋‍♀️ Author

**Ritika S. (Esdeath4l)**
🔗 [GitHub](https://github.com/Esdeath4l) | 💼 [LinkedIn](https://www.linkedin.com/in/ritika-s-450ab1252/)

---

## 💖 Show Your Support

If you like this project:

🌟 Give it a star
📣 Share it with your friends
🐛 Open an issue or submit a PR

---

## 📃 License

This project is licensed under the MIT License.
