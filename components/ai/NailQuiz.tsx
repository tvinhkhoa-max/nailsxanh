// src/components/ai/NailQuiz.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';

export const NailQuiz = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Chào bạn, mình là AI tư vấn style. Hôm nay bạn muốn trông như thế nào?' }
  ]);

  return (
    <div className="glass-panel max-w-md mx-auto rounded-3xl p-6 min-h-[500px] flex flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`p-4 rounded-2xl max-w-[80%] ${
                msg.role === 'ai' ? 'bg-[hsl(var(--accent-mint))]' : 'bg-white'
              }`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Input area */}
      <div className="mt-4 relative">
        <input 
          type="text" 
          placeholder="Nhập yêu cầu của bạn..."
          className="w-full bg-white/50 border-none rounded-full py-3 px-6 focus:ring-2 focus:ring-[hsl(var(--primary-sage))]"
        />
        <button className="absolute right-2 top-1.5 bg-[hsl(var(--primary-sage))] text-white p-1.5 rounded-full">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};