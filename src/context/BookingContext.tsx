// src/context/BookingContext.tsx
"use client"

import { createContext, useContext, useState } from 'react';
import BookingModal from '@/components/booking/BookingModal';

interface BookingContextType {
  isOpen: boolean
  selectedServiceId: string | null
  setSelectedServiceId: (id: string | null) => void
  openBooking: (serviceId?: string | null) => void // Thêm dấu ? để serviceId là tùy chọn
  closeBooking: () => void
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  // const openBooking = () => setIsOpen(true);

  const openBooking = (serviceId: string | null = null) => {
    setSelectedServiceId(serviceId); // Nếu nhấn từ trang service, ID sẽ được truyền vào
    setIsOpen(true);
  };

  const closeBooking = () => {
    setIsOpen(false)
    setSelectedServiceId(null) // Reset lại khi đóng modal nếu muốn
  }

  return (
    <BookingContext.Provider 
      value={{
        isOpen,
        selectedServiceId, 
        setSelectedServiceId,
        openBooking,
        closeBooking
      }}
    >
      {children}
      <BookingModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </BookingContext.Provider>
  );
};

// export const useBooking = () => useContext(BookingContext);
export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}