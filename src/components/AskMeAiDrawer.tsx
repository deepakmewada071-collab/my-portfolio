import React, { useState, useRef, useEffect } from 'react';
import { trackEvent } from '../utils/analytics';
import { Sparkles, X, Send, Bot, User, RefreshCw, CheckCircle2 } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  provider?: string;
}

interface AskMeAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AskMeAiDrawer: React.FC<AskMeAiDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Deepak's AI portfolio assistant powered by Gemini. 👋 Ask me anything about his projects, coding skills in C/C++/Python, LeetCode profile, college at BIST Bhopal, or how to get in touch!",
      provider: 'gemini-3.8-flash',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetQuestions = [
    'What projects has Deepak built?',
    'What are his technical skills?',
    'What is his LeetCode & GitHub ID?',
    'Tell me about his education & college',
    'How can I contact or hire Deepak?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const generateOfflineFallback = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('project') || q.includes('built') || q.includes('work')) {
      return "Deepak has engineered several standout projects:\n\n1. **Interactive Number Guessing Game (Algorithmic Logic)**: Responsive game featuring binary search O(log N) advisor, dynamic hot/cold proximity hints, local high score tracking, and Web Audio API synthesizer.\n2. **Social Commerce Platform for Local Sellers**: Built to connect neighborhood shopkeepers directly with customers with zero commission fees.\n3. **BGI Hackathon 2026 (Vision 2047)**: 24-hour national hackathon finalist prototype for smart digital campus infrastructure.\n4. **Modern Portfolio with Telemetry**: React & Tailwind application with visitor engagement analytics and printable ATS PDF resume.";
    }

    if (q.includes('skill') || q.includes('stack') || q.includes('technolog') || q.includes('language')) {
      return "Deepak's primary technical skillset encompasses:\n\n• **Programming Languages**: C (Certified, Pointers & Memory), C++ (Certified, OOP & STL), Python (AIML)\n• **Web Technologies**: HTML5 (68%), CSS3 (64%), Tailwind CSS (62%)\n• **Backend & APIs**: Node.js (82%), Express.js (80%), RESTful APIs (88%)\n• **Core CS**: Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Problem Solving\n• **Developer Tools**: VS Code (95%), Git & GitHub (88%), Vercel / Cloud Deployment (85%)";
    }

    if (q.includes('leetcode') || q.includes('dsa') || q.includes('github') || q.includes('coding')) {
      return `Deepak actively solves algorithmic challenges:\n\n• **LeetCode**: [@deepak5457](https://leetcode.com/u/deepak5457/) — Focusing on arrays, binary search optimization, recursion, and pointer logic.\n• **GitHub**: [@deepakmewada071-collab](https://github.com/deepakmewada071-collab) — Repositories for hackathon prototypes, C++ algorithms, and web applications.\n• **LinkedIn**: [deepak-mewada-795a2932b](https://www.linkedin.com/in/deepak-mewada-795a2932b)`;
    }

    if (q.includes('college') || q.includes('education') || q.includes('school') || q.includes('degree')) {
      return "Deepak's academic credentials:\n\n• **Degree**: B.Tech in Computer Science Engineering (AIML)\n• **College**: Bansal Institute of Science and Technology (BIST), Bhopal\n• **Status**: Currently in 5th Semester\n• **Class XII Board (2024)**: 76% (Physics, Chemistry, Math)\n• **Class X Board (2022)**: 73%";
    }

    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
      return `You can contact Deepak directly:\n\n• **Email**: ${PERSONAL_INFO.email}\n• **Phone**: ${PERSONAL_INFO.phone}\n• **Location**: ${PERSONAL_INFO.location}\n• **LeetCode**: @${PERSONAL_INFO.leetcodeId}\n• **GitHub**: @${PERSONAL_INFO.githubId}\n\nHe is currently open for software engineering and AIML internships!`;
    }

    return `Deepak Mewada is a 5th semester B.Tech CSE (AIML) student at Bansal Institute of Science & Technology, Bhopal. He specializes in C, C++, Python, and web technologies, has won a finalist award at BGI Hackathon 2026, and actively solves algorithmic problems on LeetCode (@deepak5457). Reach him at ${PERSONAL_INFO.email}.`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    trackEvent('page_view', 'ask_ai_question');
    const userMsg: Message = { role: 'user', content: text };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: currentMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply, provider: data.provider || 'gemini-3.8-flash' },
        ]);
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (err) {
      console.warn('Using intelligent fallback for AI assistant:', err);
      const fallbackReply = generateOfflineFallback(text);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fallbackReply, provider: 'domain-engine' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared! How else can I assist you with Deepak's portfolio or technical background?",
        provider: 'gemini-3.8-flash',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full sm:max-w-md h-full sm:h-[680px] bg-[#0c0c0c] border-l sm:border border-white/10 sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ask-ai-title"
      >
        {/* Header matching Akash with live indicator */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-[#111111] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 text-[#ff2a2a]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 id="ask-ai-title" className="text-base font-bold text-white font-display flex items-center gap-2">
                <span>Ask Deepak AI</span>
                <span className="w-2 h-2 rounded-full bg-[#00d294] animate-pulse" />
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                <span className="text-emerald-400 font-medium">Gemini 3.8 Flash Online</span>
                <span className="text-zinc-600">·</span>
                <span>Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleResetChat}
              className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
              title="Reset Chat"
              aria-label="Reset Chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
              aria-label="Close Ask AI drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset quick questions strip */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/5 overflow-x-auto flex items-center gap-2 no-scrollbar">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="text-[11px] font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-[#ff2a2a]/20 border border-white/10 hover:border-[#ff2a2a]/40 px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat message history */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 flex items-center justify-center text-[#ff2a2a] shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="max-w-[85%] space-y-1">
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-[#ff2a2a] text-white font-medium rounded-tr-none shadow-lg shadow-red-900/30'
                      : 'bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none font-normal'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 px-2 text-[10px] text-zinc-500 font-mono">
                    <CheckCircle2 className="w-3 h-3 text-[#00d294]" />
                    <span>{msg.provider === 'domain-engine' ? 'Deepak Knowledge Engine' : 'Gemini 3.8 Flash'}</span>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-[#ff2a2a]/10 border border-[#ff2a2a]/30 flex items-center justify-center text-[#ff2a2a] shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a2a] animate-bounce [animation-delay:300ms]" />
                <span className="text-[11px] font-mono text-zinc-400 ml-2">Gemini is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="p-4 border-t border-white/10 bg-[#111111]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything about Deepak, coding, LeetCode, projects..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#ff2a2a] transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="p-2.5 bg-[#ff2a2a] hover:bg-[#e40014] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors cursor-pointer shadow-md shadow-red-900/30"
              aria-label="Send question"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
