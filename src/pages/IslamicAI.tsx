import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, User, Bot, Trash2, Book, Heart, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { askIslamicAssistant } from '../lib/gemini';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function IslamicAI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { text: "Explain Surah Al-Fatihah", icon: Book },
    { text: "Daily Dua for protection", icon: Heart },
    { text: "How to perform Wudu?", icon: HelpCircle },
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ 
        role: m.role, 
        parts: [{ text: m.text }] 
      }));
      const response = await askIslamicAssistant(text, history);
      const botMessage: Message = { id: (Date.now() + 1).toString(), role: 'model', text: response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error(error);
      let errorText = "I apologize, but I'm having trouble connecting right now. Please try again later.";
      
      if (error.message?.includes('RESOURCE_EXHAUSTED') || error.status === 429) {
        errorText = "The AI service is currently at its quota limit for the free tier. To continue with higher limits, please consider adding a billing-enabled API key in the Settings > Secrets panel.";
      } else if (error.message?.includes('PERMISSION_DENIED') || error.status === 403) {
        errorText = "Access denied. Please check your API key in the Settings > Secrets panel.";
      }

      const errorMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: errorText
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-[#fcfdfa]">
      {/* Header */}
      <header className="p-5 border-b border-indigo-100 flex justify-between items-center bg-white/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
            <Sparkles className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-indigo-950">An-Nur AI</h1>
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Spiritual Assistant</p>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 text-indigo-300 hover:text-indigo-600 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-indigo-50 p-6 rounded-full border-4 border-white shadow-xl">
              <Sparkles size={48} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-indigo-950">How can I assist your journey?</h2>
              <p className="text-sm text-indigo-500 mt-2 max-w-[250px] mx-auto">
                Ask about Quran, Hadith, Duas, or general Islamic guidance.
              </p>
            </div>
            <div className="grid gap-2 w-full max-w-xs">
              {quickPrompts.map((p) => (
                <button
                  key={p.text}
                  onClick={() => handleSend(p.text)}
                  className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-indigo-50 shadow-sm text-sm text-indigo-900 font-medium hover:bg-indigo-50 transition-colors text-left"
                >
                  <p.icon size={16} className="text-indigo-500 shrink-0" />
                  {p.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-3",
              m.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-indigo-100",
              m.role === 'user' ? "bg-indigo-100 text-indigo-700" : "bg-white text-indigo-600"
            )}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
              m.role === 'user' 
                ? "bg-indigo-600 text-white rounded-tr-none" 
                : "bg-white text-indigo-950 border border-indigo-50 rounded-tl-none"
            )}>
              <div className="markdown-body prose prose-sm prose-indigo max-w-none">
                <ReactMarkdown>
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-white border border-indigo-100 flex items-center justify-center">
              <Bot size={16} className="text-indigo-600" />
            </div>
            <div className="bg-indigo-50/50 p-4 rounded-2xl flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <footer className="p-5 bg-white border-t border-indigo-50">
        <div className="relative">
          <input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
            className="w-full bg-indigo-50/30 border border-indigo-100 rounded-2xl py-4 pl-4 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white p-2.5 rounded-xl disabled:opacity-50 shadow-lg shadow-indigo-200 active:scale-95 transition-transform"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[9px] text-center text-indigo-300 mt-3 uppercase tracking-widest font-bold">
          An-Nur AI can make mistakes. Always consult a scholar for serious matters.
        </p>
      </footer>
    </div>
  );
}
