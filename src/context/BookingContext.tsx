// src/context/BookingContext.tsx
"use client"

import { createContext, useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import BookingModal from '@/components/booking/BookingModal';

interface BookingContextType {
  isOpen: boolean
  selectedServiceId: string | null
  setSelectedServiceId: (id: string | null) => void
  openBooking: (serviceId?: string | null) => void // Thêm dấu ? để serviceId là tùy chọn
  closeBooking: () => void,
  services: any[],
  isLoading: boolean,
}

const BookingContext = createContext<BookingContextType | undefined>(undefined)

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const openBooking = (serviceId: string | null = null) => {
    setSelectedServiceId(serviceId); // Nếu nhấn từ trang service, ID sẽ được truyền vào
    setIsOpen(true);
  };
  const closeBooking = () => {
    setIsOpen(false)
    setSelectedServiceId(null) // Reset lại khi đóng modal nếu muốn
  }
  // Logic fetch dữ liệu nằm ở đây
  const { data: services = [], isLoading } = useQuery({
    queryKey: ['nail-services'],
    queryFn: async () => {
      // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`)
      const res = await fetch(`/api/services`)
      const json = await res.json()
      return json?.data || []
    },
    staleTime: 1000 * 60 * 60, // Cache 1 giờ vì danh sách dịch vụ ít thay đổi
    // enabled: isOpen Bỏ thuộc tính này để dữ liệu sẵn sàng ở mọi nơi
  })

  return (
    <BookingContext.Provider 
      value={{
        isOpen,
        selectedServiceId, 
        setSelectedServiceId,
        openBooking,
        closeBooking,
        services,
        isLoading
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