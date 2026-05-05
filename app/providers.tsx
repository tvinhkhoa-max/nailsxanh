// app/providers.tsx (hoặc layout.tsx)
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { BookingProvider } from '@/src/context/BookingContext';
import { DeviceProvider } from '@/src/context/DeviceContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // Dữ liệu sẽ được coi là "mới" trong 5 phút
        gcTime: 1000 * 60 * 10,   // Xóa khỏi bộ nhớ đệm sau 10 phút nếu không dùng
        refetchOnWindowFocus: false, // Không gọi lại API khi chuyển tab
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <DeviceProvider>
        <BookingProvider>
          {children}
        </BookingProvider>
      </DeviceProvider>
    </QueryClientProvider>
  )
}