"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react'; // Dùng thư viện icon lucide-react

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Xử lý đổi màu Header khi cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Bộ sưu tập', href: '/collections' },
    // { name: 'Nail Quiz AI', href: '/ai-quiz' },
    { name: 'Tin tức', href: '/news' },
    { name: 'Dịch vụ', href: '/services' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-md py-1 shadow-sm' : 'bg-transparent py-2'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center -mt-4">
          <div className="relative h-[80px] w-[180px] md:h-[80px] md:w-[180px]">
              <img
                src="/assets/images/logo_nailsxanh.png"
                alt="Logo Nails Xanh"
                className="
                  max-w-[60%] h-auto
                  absolute inset-0
                  object-contain object-left
                  transition-transform duration-1000
                  hover:rotate-[360deg]"
                style={{
                  maxWidth: '60%',
                  height: 'auto'
                }}
              />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-sm uppercase tracking-widest text-[#2D3A2D] hover:text-[#5E7A5E] transition-colors"
            >
              {link.name}
            </Link>
          ))}
          {/* <button className="bg-[#2D3A2D] text-white px-5 py-2 rounded-full text-sm hover:bg-[#5E7A5E] transition-all">
            ĐẶT LỊCH
          </button> */}
        </nav>

        {/* Mobile Toggle & Icons */}
        <div className="flex md:hidden items-center gap-4">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#2D3A2D]">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-t border-gray-100 py-8 px-6 flex flex-col gap-6 shadow-xl md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-xl font-serif text-[#2D3A2D] border-b border-gray-50 pb-2"
              >
                {link.name}
              </Link>
            ))}
            {/* <button className="bg-[#5E7A5E] text-white py-4 rounded-xl text-lg font-medium">
              ĐẶT LỊCH NGAY
            </button> */}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;