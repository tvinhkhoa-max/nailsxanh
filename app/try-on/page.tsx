"use client"
import { useEffect, useRef, useState, Suspense } from "react";
import { motion } from 'framer-motion';
import { Info, ShieldCheck, Sparkles } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import ARSection from '@/components/ai/ARSection';
import ARContainer from '@/components/ai/ARContainer';
import { useBooking } from '@/src/context/BookingContext'; // Import hook

function TryOnContent() {
  const searchParams = useSearchParams();
  const { openBooking } = useBooking();
  const [selectedCollection, setSelectedCollection] = useState<string>(searchParams.get('collection') || '');
  const [fingerNails, setFingerNails] = useState<Record<number, string>>({ 4: "", 8: "", 12: "", 16: "", 20: "" });
  const [activeFinger, setActiveFinger] = useState<number>(4);
  const [modelSample, setModelSample] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {

      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        // Gọi song song
        const res = await fetch(
          `${baseUrl}/api/v1/nails/models?collection=${selectedCollection}`
        );

        const data = await res.json();

        setModelSample(data?.data || []);

      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCollection]); // Chạy lại mỗi khi category trên URL thay đổi

  return (
    <div className="relative">
      {/* 1. Phần AR Core - Thành phần chính */}
      <ARContainer isLoadingAR={false}>
        <ARSection
          videoRef={videoRef}
          canvasRef={canvasRef}
          fingerNails={fingerNails}
          setFingerNails={setFingerNails}
          activeFinger={activeFinger}
          setActiveFinger={setActiveFinger}
          modelSample={modelSample}
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
          loading={loading}
        />
      </ARContainer>

      {/* 2. Phần bổ trợ: Hướng dẫn & Cam kết (Chỉ hiển thị trên PC để không che camera) */}
      <div className="hidden md:block bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            
            {/* Bước 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#F0F5F0] flex items-center justify-center text-[#5E7A5E]">
                <Info size={24} />
              </div>
              <h3 className="font-serif text-xl text-[#2D3A2D]">Cấp quyền Camera</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Để bắt đầu trải nghiệm, hãy cho phép trình duyệt truy cập camera của bạn. Chúng tôi không lưu trữ luồng video trực tiếp.
              </p>
            </motion.div>

            {/* Bước 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#F0F5F0] flex items-center justify-center text-[#5E7A5E]">
                <Sparkles size={24} />
              </div>
              <h3 className="font-serif text-xl text-[#2D3A2D]">Chọn mẫu & Chụp</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Lướt qua bộ sưu tập bên dưới khung hình, chọn mẫu yêu thích và nhấn nút chụp để xem kết quả ướm thử.
              </p>
            </motion.div>

            {/* Bước 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#F0F5F0] flex items-center justify-center text-[#5E7A5E]">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-serif text-xl text-[#2D3A2D]">Bảo mật hình ảnh</h3>
              <p className="text-gray-500 text-sm font-light leading-relaxed">
                Hình ảnh sau khi chụp chỉ được lưu xuống thiết bị cá nhân của bạn nếu bạn chọn "Lưu ảnh". Chúng tôi hoàn toàn tôn trọng quyền riêng tư.
              </p>
            </motion.div>

          </div>
        </div>
      </div>

      {/* 3. Một Section nhỏ gợi ý đặt lịch (Call to Action) */}
      <section className="bg-[#2D3A2D] py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif text-white">Bạn ưng ý với mẫu nail vừa thử chưa ?</h2>
          <p className="text-white/70 font-light italic">
            Hãy để Nails Xanh biến bản thử ảo thành tác phẩm thật trên tay bạn.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault(); // Chặn chuyển trang
              e.stopPropagation(); // Chặn lan truyền sự kiện
              openBooking()
            }}
            className="bg-white text-[#2D3A2D] px-10 py-4 rounded-full font-bold tracking-[0.2em] text-xs hover:bg-[#5E7A5E] hover:text-white transition-all shadow-xl">
            ĐẶT LỊCH NGAY TẠI STUDIO
          </button>
        </div>
      </section>
    </div>
  );
}

export default function TryOnPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full flex items-center justify-center bg-black text-white">
        Đang khởi tạo camera...
      </div>
    }>
      <TryOnContent />
    </Suspense>
  )
}