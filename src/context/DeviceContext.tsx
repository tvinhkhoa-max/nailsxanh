"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DeviceContextType {
  isMobile: boolean;
  isDesktop: boolean;
}

const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  isDesktop: true,
});

export const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Định nghĩa mốc mobile (768px)
    const mql = window.matchMedia('(max-width: 768px)');
    
    // Khởi tạo giá trị ban đầu
    setIsMobile(mql.matches);

    // Lắng nghe thay đổi kích thước màn hình
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <DeviceContext.Provider value={{ isMobile, isDesktop: !isMobile }}>
      {children}
    </DeviceContext.Provider>
  );
};

// Hook để sử dụng nhanh
export const useDevice = () => useContext(DeviceContext);