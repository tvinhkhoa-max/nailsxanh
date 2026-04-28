"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, CalendarDays } from 'lucide-react';
import Link from 'next/link';

// Định nghĩa dữ liệu các ảnh cho Slider
const heroSlides = [
  {
    id: 1,
    image: '/images/hero/Baymax_2.webp', // Thay bằng đường dẫn ảnh thật của bạn
    title: 'Nails<span class="text-[#5E7A5E] italic">Aesthetic</span>',
    subtitle: 'Nghệ thuật<br/>trên đôi tay',
    description: 'Trải nghiệm cá nhân hóa hoàn hảo với công nghệ AI và AR',
    buttonText: 'KHÁM PHÁ AI QUIZ',
    buttonLink: '/ai-quiz'
  },
  {
    id: 2,
    image: '/images/hero/sac_thai_thien_nhien.webp', // Ảnh thứ 2
    title: 'Sơn<span class="text-[#5E7A5E] italic">Xanh</span>',
    subtitle: 'Sắc thái<br/>của thiên nhiên',
    description: 'Bộ sưu tập độc bản lấy cảm hứng từ sự tươi mát của khu rừng ôn đới.',
    buttonText: 'XEM BỘ SƯU TẬP',
    buttonLink: '/collections'
  },
  {
    id: 3,
    image: '/images/hero/studio_ca_nhan_hoa.webp', // Ảnh thứ 3
    title: 'Studio<span class="text-[#5E7A5E] italic">Cá Nhân</span>',
    subtitle: 'Nơi vẻ đẹp<br/>lên tiếng',
    description: 'Thiết kế nail theo phong cách riêng của bạn, tôn vinh cá tính độc đáo.',
    buttonText: 'ĐẶT LỊCH NGAY',
    buttonLink: '/bookings'
  },
];

export default function HeroSlide() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // 5000ms = 5 giây
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentData = heroSlides[currentSlide];

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#F9FBF9] mt-20 md:mt-0 pt-24 md:pt-0">
      
      {/* Background Decor - Mảng màu xanh sage mờ phía sau */}
      <motion.div 
        key={currentSlide + '-bg'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5 }}
        className="absolute top-[-10%] left-[-5%] w-[45%] h-[65%] rounded-full bg-[#E8F1E8] blur-[120px] z-0" 
      />
      <motion.div 
        key={currentSlide + '-bg2'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[55%] rounded-full bg-[#F0F5F0] blur-[100px] z-0" 
      />

      <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-2 items-center gap-12 md:gap-20 z-10 relative">
        
        {/* Cột Trái: Text Nội dung - Chuyển động Fade & Y */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide + '-text'}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }} // Chuyển động mượt kiểu Ease-Out
            className="flex flex-col gap-8 md:gap-10"
          >
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#2D3A2D] leading-[1.1]"
                  dangerouslySetInnerHTML={{ __html: currentData.title }} />
              <p className="mt-2 text-xl md:text-2xl font-serif italic font-light text-[#5E7A5E] leading-tight"
                 dangerouslySetInnerHTML={{ __html: currentData.subtitle }} />
            </div>
            
            <p className="text-base md:text-lg text-gray-600 font-light max-w-lg leading-relaxed">
              {currentData.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 mt-2">
              <Link href={currentData.buttonLink} className="flex items-center justify-center gap-3 bg-[#2D3A2D] text-white px-8 py-4 rounded-full text-sm font-semibold tracking-widest hover:bg-[#5E7A5E] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-green-900/10">
                <CalendarDays size={18}/> {currentData.buttonText}
              </Link>
              <Link href={currentData.buttonLink} className="flex items-center justify-center gap-3 border border-[#5E7A5E] text-[#5E7A5E] px-8 py-4 rounded-full text-sm hover:bg-white transition-all">
                <Sparkles size={18}/> TƯ VẤN NHANH
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Cột Phải: Slider Ảnh - Chuyển động Fade & Scale */}
        <div className="relative h-[450px] md:h-[600px] w-full group">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide + '-img'}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: "circOut" }}
              className="absolute inset-0 bg-cover bg-center rounded-[32px] md:rounded-[40px] shadow-2xl border-[8px] md:border-[12px] border-white cursor-pointer overflow-hidden"
              style={{ backgroundImage: `url(${currentData.image})` }}
            />
          </AnimatePresence>

          {/* Các nút điều hướng ẩn hiện khi hover vào vùng ảnh */}
          <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm text-[#2D3A2D] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/90">
            <ChevronLeft size={24} />
          </button>
          <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/50 backdrop-blur-sm text-[#2D3A2D] p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white/90">
            <ChevronRight size={24} />
          </button>

          {/* Các dấu chấm chỉ số slide */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
            {heroSlides.map((slide, index) => (
              <button 
                key={slide.id}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-[#5E7A5E]' : 'w-2.5 bg-white'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}