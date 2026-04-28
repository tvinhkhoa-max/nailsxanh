// components/booking/BookingTrigger.tsx
"use client"
import { useState } from 'react';
import BookingModal from '@/components/booking/BookingModal';

export default function BookingButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[90] bg-[#5E7A5E] text-white px-8 py-4 rounded-full font-black text-xs tracking-widest shadow-2xl hover:bg-[#2D3A2D] transition-all active:scale-95 flex items-center gap-3"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        ĐẶT LỊCH NGAY
      </button>

      <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}