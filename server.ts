import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import fs from 'fs';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Avatar upload endpoint
app.post('/api/upload-avatar', (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Valid imageBase64 string is required' });
    }

    const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    const base64Data = matches ? matches[2] : imageBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const targetPath = path.join(publicDir, 'deepak-photo.jpg');
    fs.writeFileSync(targetPath, buffer);

    return res.json({ success: true, url: '/deepak-photo.jpg' });
  } catch (error: any) {
    console.error('Error saving uploaded avatar:', error);
    return res.status(500).json({ error: 'Failed to save avatar image' });
  }
});

// Background photo upload endpoint
app.post('/api/upload-background', (req, res) => {
  try {
    const { imageBase64 } = req.body;
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Valid imageBase64 string is required' });
    }

    const matches = imageBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
    const base64Data = matches ? matches[2] : imageBase64;
    const buffer = Buffer.from(base64Data, 'base64');

    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const targetPath = path.join(publicDir, 'deepak-bg.jpg');
    fs.writeFileSync(targetPath, buffer);

    return res.json({ success: true, url: '/deepak-bg.jpg' });
  } catch (error: any) {
    console.error('Error saving uploaded background:', error);
    return res.status(500).json({ error: 'Failed to save background image' });
  }
});

// Initialize Google GenAI with environment variable
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const DEEPAK_SYSTEM_INSTRUCTION = `
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
  3. BGI Hackathon 2026 – Vision 2047 Challenge: 24-hour national competitive sprint prototype for smart campus digital infrastructure; selected as finalist.
  4. Modern Portfolio with Visitor Analytics & PDF Generator: React & Tailwind application with client-side dwell-time telemetry and print-optimized PDF resume generation.
  5. Responsive Landing Page Architecture: Fluid semantic HTML5 and modern CSS Grid/Flexbox layout.
- Certifications:
  - C Programming Certification (Authorized Technical Institute)
  - C++ Programming Certification (Authorized Technical Institute)
  - Python Essentials & Logic Programming (Cisco Networking Academy / Python Institute)
  - BGI Hackathon 2026 – Vision 2047 Certificate
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

// AI Chat Endpoint
app.post('/api/ask-ai', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai) {
      try {
        // Build conversation contents
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.content }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        let response;
        let selectedModel = 'gemini-3.1-flash-lite';

        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents,
            config: {
              systemInstruction: DEEPAK_SYSTEM_INSTRUCTION,
              temperature: 0.7,
              maxOutputTokens: 600,
            },
          });
        } catch (liteErr) {
          selectedModel = 'gemini-3.8-flash';
          response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: DEEPAK_SYSTEM_INSTRUCTION,
              temperature: 0.7,
              maxOutputTokens: 600,
            },
          });
        }

        const reply = response.text || "I'm Deepak's AI assistant. How can I help you learn more about his work?";
        return res.json({ reply, provider: selectedModel });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, using intelligent fallback:', geminiError?.message || geminiError);
      }
    }

    // Intelligent fallback in case Gemini is temporarily unreachable
    const q = message.toLowerCase();
    let reply = `Deepak Mewada is a 5th semester B.Tech CSE (AIML) student at Bansal Institute of Science & Technology, Bhopal. He is skilled in C, C++, Python, and modern web development, with an active LeetCode profile (@deepak5457).`;

    if (q.includes('project') || q.includes('built') || q.includes('work')) {
      reply = `**Deepak's Notable Projects:**\n\n1. **Interactive Number Guessing Game**: Algorithmic web application with O(log N) binary search strategy, real-time proximity hints, and high-score streaks.\n2. **Social Commerce Platform for Local Sellers**: Built to empower local merchants with direct community discovery and 0% commission.\n3. **BGI Hackathon 2026 (Vision 2047)**: National hackathon finalist prototype for smart digital campus infrastructure.\n4. **Developer Portfolio & Telemetry**: Privacy-first dwell telemetry and instant printable ATS PDF resume.`;
    } else if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('stack')) {
      reply = `**Deepak's Technical Stack:**\n\n• **Programming Languages**: C (Certified, Pointers & Memory), C++ (Certified, OOP & STL), Python (AIML)\n• **Web Technologies**: HTML5 (68%), CSS3 (64%), Tailwind CSS (62%)\n• **Backend**: Node.js (82%), Express.js (80%), RESTful APIs\n• **AI/Data**: Machine Learning, NumPy, Pandas, Algorithmic Heuristics\n• **Tools**: VS Code, Git & GitHub, Vercel/Cloud Deployment\n• **Core CS**: Data Structures & Algorithms, Object-Oriented Design, Problem Solving.`;
    } else if (q.includes('leetcode') || q.includes('dsa') || q.includes('github') || q.includes('coding')) {
      reply = `**Deepak's Coding Profiles:**\n\n• **LeetCode**: [@deepak5457](https://leetcode.com/u/deepak5457/) — Continuous problem solving in C/C++ focusing on arrays, binary search, and pointer manipulation.\n• **GitHub**: [@deepakmewada071-collab](https://github.com/deepakmewada071-collab) — Repositories for hackathon prototypes, C++ algorithms, and web applications.\n• **LinkedIn**: [deepak-mewada-795a2932b](https://www.linkedin.com/in/deepak-mewada-795a2932b)`;
    } else if (q.includes('college') || q.includes('education') || q.includes('degree') || q.includes('school')) {
      reply = `**Deepak's Academic Profile:**\n\n• **Degree**: B.Tech in Computer Science Engineering (AIML)\n• **College**: Bansal Institute of Science and Technology, Bhopal (Currently in 5th Semester)\n• **Class XII (2024)**: 76% in PCM (Physics, Chemistry, Math)\n• **Class X (2022)**: 73% (Secondary Board)`;
    } else if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
      reply = `**Get in Touch with Deepak:**\n\n• **Email**: deepakmewada071@gmail.com\n• **Phone**: +91 8815070019\n• **Location**: Bhopal, Madhya Pradesh, India\n• **LeetCode**: @deepak5457\n• **GitHub**: @deepakmewada071-collab\n\nHe is currently open for software engineering and AIML internships!`;
    }

    return res.json({ reply, provider: 'domain-engine' });
  } catch (error: any) {
    console.error('Error in /api/ask-ai:', error);
    res.status(500).json({ error: 'Failed to process AI query' });
  }
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
