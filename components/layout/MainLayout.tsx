import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Providers from '@/app/providers';
import FloatingContact from '@/components/ui/FloatingContact';

interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <Providers>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        {/* - pt-24: Đẩy nội dung xuống để không bị Header (fixed) đè lên. 
          - flex-grow: Đẩy Footer xuống cuối trang nếu nội dung ngắn.
        */}
        <main className="flex-grow pt-20">
          {children}
          <FloatingContact />
        </main>
          
        <Footer />
      </div>
    </Providers>
  );
}