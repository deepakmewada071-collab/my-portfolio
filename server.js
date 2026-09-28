// server.ts
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = parseInt(process.env.PORT || "3000", 10);
app.use(express.json());
var apiKey = process.env.GEMINI_API_KEY || "";
var ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
var DEEPAK_SYSTEM_INSTRUCTION = `
You are the official portfolio AI assistant for Deepak Mewada, an engineering student and developer.
Your goal is to warmly, accurately, and intelligently answer questions from recruiters, collaborators, and visitors about Deepak's skills, projects, education, coding achievements, and availability.

Deepak's Verified Profile Details:
- Name: Deepak Mewada
- Current Status: B.Tech in Computer Science Engineering with specialization in AIML (Artificial Intelligence & Machine Learning)
- Institute: Bansal Institute of Science and Technology (BIST), Bhopal, Madhya Pradesh, India
- Current Semester: 5th Semester
- Academic Scores:
  - Class XII Senior Secondary (2024): 76% in PCM (Physics, Chemistry, Mathematics)
  - Class X Secondary School (2022): 73%
- Contact Details:
  - Email: deepakmewada071@gmail.com
  - Phone: +91 8815070019
  - Location: Bhopal, India
  - Availability: Available for Software Internships, AIML roles, and Project Collaborations
- Coding & Social Profiles:
  - LeetCode: @deepak5457 (https://leetcode.com/u/deepak5457/) - Focuses on Data Structures, binary search optimization O(log N), pointer discipline, recursion, and algorithmic problem solving.
  - GitHub: @deepakmewada071-collab (https://github.com/deepakmewada071-collab)
  - LinkedIn: https://www.linkedin.com/in/deepak-mewada-795a2932b
- Technical Skillset:
  - Programming Languages: C (Certified, memory & pointer manipulation), C++ (Certified, OOP, STL templates, algorithms), Python (AIML, data preprocessing, machine learning logic).
  - Web Technologies: HTML5 (68%), CSS3 (64%), Tailwind CSS (62%).
  - Backend & Frameworks: Node.js (82%), Express.js (80%), RESTful APIs (88%).
  - AI & Data Foundations: Machine Learning (85%), NumPy & Pandas (84%), Algorithmic Heuristics & Search (90%).
  - Developer Tools: VS Code (95%), Git & GitHub (88%), Vercel & Netlify Deployment (85%).
  - Core CS Concepts: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Problem Solving.
- Featured Projects:
  1. Interactive Number Guessing Game (Algorithmic Logic): Responsive web application featuring binary search O(log N) optimal guess calculation, dynamic hot/cold proximity heuristics, local score streaks, and Web Audio API synthesized audio rewards.
  2. Social Commerce Platform for Local Sellers: Full-stack responsive web application designed to connect local neighborhood vendors directly with community buyers with zero commission fees.
  3. BGI Hackathon 2026 \u2013 Vision 2047 Challenge: 24-hour national competitive sprint prototype for smart campus digital infrastructure; selected as finalist.
  4. Modern Portfolio with Visitor Analytics & PDF Generator: React & Tailwind application with client-side dwell-time telemetry and print-optimized PDF resume generation.
  5. Responsive Landing Page Architecture: Fluid semantic HTML5 and modern CSS Grid/Flexbox layout.
- Certifications:
  - C Programming Certification (Authorized Technical Institute)
  - C++ Programming Certification (Authorized Technical Institute)
  - Python Essentials & Logic Programming (Cisco Networking Academy / Python Institute)
  - BGI Hackathon 2026 \u2013 Vision 2047 Certificate
  - Frontend Web Development Certification
  - Foundations of AI & Machine Learning
  - Cybersecurity & Networking Essentials
- Core Professional Attributes:
  - Problem Solving, Adaptability, Team Collaboration, Clear Communication, Creativity, Time Management, Self-Learning, Persistence.

Guidelines for AI Responses:
- Respond in the language used by the visitor (English, Hindi, or Hinglish).
- Be polite, professional, concise, articulate, and encouraging.
- Format responses nicely with markdown bullet points and bold highlights when listing projects or skills.
- If asked technical questions (e.g. how binary search works in O(log N), or why C/C++ memory management is important), answer accurately and explain how Deepak applies these concepts in his work.
- If someone wants to hire or contact Deepak, provide his email (deepakmewada071@gmail.com), phone (+91 8815070019), and GitHub/LeetCode links.
`;
app.post("/api/ask-ai", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }
    if (ai) {
      try {
        const contents = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.content }]
            });
          }
        }
        contents.push({
          role: "user",
          parts: [{ text: message }]
        });
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents,
          config: {
            systemInstruction: DEEPAK_SYSTEM_INSTRUCTION,
            temperature: 0.7,
            maxOutputTokens: 600
          }
        });
        const reply2 = response.text || "I'm Deepak's AI assistant. How can I help you learn more about his work?";
        return res.json({ reply: reply2, provider: "gemini-3.8-flash" });
      } catch (geminiError) {
        console.warn("Gemini API call failed, using intelligent fallback:", geminiError?.message || geminiError);
      }
    }
    const q = message.toLowerCase();
    let reply = `Deepak Mewada is a 5th semester B.Tech CSE (AIML) student at Bansal Institute of Science & Technology, Bhopal. He is skilled in C, C++, Python, and modern web development, with an active LeetCode profile (@deepak5457).`;
    if (q.includes("project") || q.includes("built") || q.includes("work")) {
      reply = `**Deepak's Notable Projects:**

1. **Interactive Number Guessing Game**: Algorithmic web application with O(log N) binary search strategy, real-time proximity hints, and high-score streaks.
2. **Social Commerce Platform for Local Sellers**: Built to empower local merchants with direct community discovery and 0% commission.
3. **BGI Hackathon 2026 (Vision 2047)**: National hackathon finalist prototype for smart digital campus infrastructure.
4. **Developer Portfolio & Telemetry**: Privacy-first dwell telemetry and instant printable ATS PDF resume.`;
    } else if (q.includes("skill") || q.includes("tech") || q.includes("language") || q.includes("stack")) {
      reply = `**Deepak's Technical Stack:**

\u2022 **Programming Languages**: C (Certified, Pointers & Memory), C++ (Certified, OOP & STL), Python (AIML)
\u2022 **Web Technologies**: HTML5 (68%), CSS3 (64%), Tailwind CSS (62%)
\u2022 **Backend**: Node.js (82%), Express.js (80%), RESTful APIs
\u2022 **AI/Data**: Machine Learning, NumPy, Pandas, Algorithmic Heuristics
\u2022 **Tools**: VS Code, Git & GitHub, Vercel/Cloud Deployment
\u2022 **Core CS**: Data Structures & Algorithms, Object-Oriented Design, Problem Solving.`;
    } else if (q.includes("leetcode") || q.includes("dsa") || q.includes("github") || q.includes("coding")) {
      reply = `**Deepak's Coding Profiles:**

\u2022 **LeetCode**: [@deepak5457](https://leetcode.com/u/deepak5457/) \u2014 Continuous problem solving in C/C++ focusing on arrays, binary search, and pointer manipulation.
\u2022 **GitHub**: [@deepakmewada071-collab](https://github.com/deepakmewada071-collab) \u2014 Repositories for hackathon prototypes, C++ algorithms, and web applications.
\u2022 **LinkedIn**: [deepak-mewada-795a2932b](https://www.linkedin.com/in/deepak-mewada-795a2932b)`;
    } else if (q.includes("college") || q.includes("education") || q.includes("degree") || q.includes("school")) {
      reply = `**Deepak's Academic Profile:**

\u2022 **Degree**: B.Tech in Computer Science Engineering (AIML)
\u2022 **College**: Bansal Institute of Science and Technology, Bhopal (Currently in 5th Semester)
\u2022 **Class XII (2024)**: 76% in PCM (Physics, Chemistry, Math)
\u2022 **Class X (2022)**: 73% (Secondary Board)`;
    } else if (q.includes("contact") || q.includes("hire") || q.includes("email") || q.includes("phone") || q.includes("reach")) {
      reply = `**Get in Touch with Deepak:**

\u2022 **Email**: deepakmewada071@gmail.com
\u2022 **Phone**: +91 8815070019
\u2022 **Location**: Bhopal, Madhya Pradesh, India
\u2022 **LeetCode**: @deepak5457
\u2022 **GitHub**: @deepakmewada071-collab

He is currently open for software engineering and AIML internships!`;
    }
    return res.json({ reply, provider: "domain-engine" });
  } catch (error) {
    console.error("Error in /api/ask-ai:", error);
    res.status(500).json({ error: "Failed to process AI query" });
  }
});
async function startServer() {
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
