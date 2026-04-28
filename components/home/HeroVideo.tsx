"use client"

// src/components/home/Hero.tsx
import { motion } from 'framer-motion';

const HeroVideo = () => {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Video hoặc Ảnh chất lượng cực cao */}
      <video 
        autoPlay muted loop 
        className="absolute w-full h-full object-cover z-0 opacity-80"
      >
        <source src="/videos/nail-art-process.mp4" type="video/mp4" />
      </video>

      <div className="relative z-10 text-center px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-8xl mb-6"
        >
          Nâng Tầm <span className="italic">Nghệ Thuật</span> Đôi Tay
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-8"
        >
          Trải nghiệm cá nhân hóa hoàn hảo với công nghệ AI và AR.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-10 py-4 border border-[hsl(var(--text-charcoal))] hover:bg-[hsl(var(--primary-sage))] hover:text-white transition-all"
        >
          KHÁM PHÁ BỘ SƯU TẬP
        </motion.button>
      </div>
    </section>
  );
};

export default HeroVideo;