import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { BookingProvider } from '@/src/context/BookingContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <BookingProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        {/* - pt-24: Đẩy nội dung xuống để không bị Header (fixed) đè lên. 
          - flex-grow: Đẩy Footer xuống cuối trang nếu nội dung ngắn.
        */}
        <main className="flex-grow pt-20">
          {children}
        </main>
          
        <Footer />
      </div>
    </BookingProvider>
  );
}