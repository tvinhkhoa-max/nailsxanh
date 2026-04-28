// components/ar/ARContainer.tsx
"use client"
import { motion, AnimatePresence } from 'framer-motion';

export default function ARContainer({ children, isLoadingAR }: any) {
  return (
    <div className="">
      {/* 1. Màn hình chờ nghệ thuật */}
      <AnimatePresence>
        {isLoadingAR && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] bg-[#F9FBF9] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 1, 0.3] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[#5E7A5E] font-serif text-2xl italic"
            >
              NailsXanh
            </motion.div>
            <div className="mt-8 w-48 h-[1px] bg-gray-100 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-[#5E7A5E]"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <p className="mt-4 text-[10px] tracking-[0.3em] text-gray-400 uppercase">Đang khởi tạo gương thần AI...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Nội dung trang AR */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: isLoadingAR ? 0 : 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}