// src/components/ui/FloatingContact.tsx
"use client"
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import Image from 'next/image';

const channels = [
  { name: 'Zalo', color: '#0068FF', icon: '/icons/zalo.png', link: 'https://zalo.me/0388128312' },
  { name: 'Messenger', color: '#0084FF', icon: '/icons/messenger.png', link: 'https://m.me/nails.xanh' },
  { name: 'WhatsApp', color: '#25D366', icon: '/icons/whatsapp.png', link: 'https://wa.me/84985955309' },
];

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 z-[110] flex flex-col items-end gap-4">
      
      {/* Danh sách các nút chat phụ */}
      <AnimatePresence>
        {isOpen && (
          <div className="flex flex-col gap-3 mb-2">
            {channels.map((channel, index) => (
              <motion.a
                key={channel.name}
                href={channel.link}
                target="_blank"
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 group hover:bg-[#5E7A5E] transition-all"
              >
                <span className="text-xs font-semibold text-gray-600 group-hover:text-white uppercase tracking-wider">
                  {channel.name}
                </span>
                <div className="w-8 h-8 relative">
                   {/* Dùng thẻ img nếu bạn chưa có file trong /public */}
                   <div className={`w-full h-full rounded-full bg-[${channel.color}] flex items-center justify-center text-white text-[10px]`}>
                      {channel.name[0]}
                   </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Nút Toggle chính */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-red-400 rotate-90' : 'bg-[#5E7A5E]'
        } text-white`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        
        {/* Hiệu ứng sóng lan tỏa khi đóng */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-[#5E7A5E] animate-ping opacity-25"></span>
        )}
      </motion.button>
    </div>
  );
}