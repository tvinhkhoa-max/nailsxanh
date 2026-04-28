// src/context/BookingContext.tsx
"use client"
import { createContext, useContext, useState } from 'react';
import BookingModal from '@/components/booking/BookingModal';

const BookingContext = createContext({ openBooking: () => {} });

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openBooking = () => setIsOpen(true);

  return (
    <BookingContext.Provider value={{ openBooking }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);