"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Xử lý thay đổi nền khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Mẫu Nail', href: '/collection' },
    { name: 'Dịch vụ', href: '/services' },
    { name: 'NailQuiz AI', href: '/quiz' },
    { name: 'Đánh giá', href: '/reviews' },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      isScrolled ? 'bg-white/70 backdrop-blur-lg py-3 shadow-sm' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Logo - Font Serif sang trọng */}
        <Link href="/" className="group flex flex-col">
          <span className="text-2xl md:text-3xl font-serif font-bold tracking-tighter text-[#2D3A2D]">
            NAILS<span className="text-[#5E7A5E] italic">XANH</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#5E7A5E] font-medium leading-none opacity-80">
            Aesthetic Studio
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-10">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="relative text-[13px] font-medium uppercase tracking-[0.15em] text-[#2D3A2D] hover:text-[#5E7A5E] transition-colors group"
            >
              {item.name}
              {/* Thanh gạch dưới khi hover */}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#5E7A5E] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CTA Button (Desktop) */}
        <div className="hidden md:block">
          <button className="flex items-center gap-2 bg-[#2D3A2D] text-white px-7 py-3 rounded-full text-xs font-semibold tracking-widest hover:bg-[#5E7A5E] transition-all transform hover:scale-105 active:scale-95 shadow-md">
            ĐẶT LỊCH NGAY <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="md:hidden p-2 text-[#2D3A2D]"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 top-[70px] bg-white z-[99] flex flex-col p-10 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-3xl font-serif text-[#2D3A2D] flex items-center justify-between group"
                  >
                    {item.name}
                    <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-[#5E7A5E]" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pb-10">
              <button className="w-full bg-[#5E7A5E] text-white py-5 rounded-2xl text-lg font-semibold flex items-center justify-center gap-3">
                ĐẶT LỊCH HẸN NGAY <ArrowRight />
              </button>
              <p className="text-center mt-6 text-gray-400 text-sm">Open: 09:00 AM - 09:00 PM</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;