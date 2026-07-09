// src/components/ar/MobileView.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { getFullStaticImageUrl } from '@/src/lib/utils'
import { X } from 'lucide-react';

export default function MobileView({ 
  videoRef,
  canvasRef, 
  fingerNails,
  activeFinger,
  setActiveFinger,
  onNailSelect,
  modelSample,
  onCapture,
  capturedImage,
  onRetake,
  onSave
}: any) {
  const router = useRouter();
  const fingerTips = [4, 8, 12, 16, 20];
  const fingerNames: any = { 4: "Cái", 8: "Trỏ", 12: "Giữa", 16: "Áp út", 20: "Út" };

  return (
    // SỬA: Dùng h-[100dvh] và touch-none để giao diện luôn nằm trọn trong màn hình mobile
    <div className="fixed inset-0 h-[100dvh] z-[100] flex flex-col bg-black overflow-hidden touch-none">
      <video ref={videoRef} className="hidden" playsInline muted />
      
      <div className="relative flex-1 w-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />

        {/* OVERLAY: Đẩy pt lên 10vh để khung cao hơn, tránh bị footer đè */}
        <div className="absolute inset-0 flex justify-center items-start pt-[10vh] pointer-events-none z-10">
          
          {/* KHUNG FOCUS: Thu nhỏ nhẹ w-70% để cân đối hơn trên điện thoại nhỏ */}
          <div className="relative w-[70%] max-w-[280px] aspect-[3/4] rounded-[48px]">
            
            {/* Lớp phủ làm mờ xung quanh */}
            <div className="absolute inset-0 rounded-[48px] shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-0"></div>

            {/* Viền sáng mảnh */}
            <div className="absolute inset-0 rounded-[48px] border border-white/20 z-10"></div>

            {/* 4 Góc Focus xanh (Tăng độ rực để nổi bật thay cho chữ hướng dẫn) */}
            <div className="absolute top-0 left-0 w-12 h-12 border-l-[4px] border-t-[4px] border-green-400 rounded-tl-[48px] -translate-x-1 -translate-y-1 z-20"></div>
            <div className="absolute top-0 right-0 w-12 h-12 border-r-[4px] border-t-[4px] border-green-400 rounded-tr-[48px] translate-x-1 -translate-y-1 z-20"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 border-l-[4px] border-b-[4px] border-green-400 rounded-bl-[48px] -translate-x-1 translate-y-1 z-20"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r-[4px] border-b-[4px] border-green-400 rounded-br-[48px] translate-x-1 translate-y-1 z-20"></div>

            {/* ĐÃ LOẠI BỎ DÒNG CHỮ HƯỚNG DẪN TẠI ĐÂY */}
          </div>
        </div>
        
        {/* Header điều khiển */}
        <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/80 to-transparent">
          <button 
            className="bg-black/40 backdrop-blur-xl p-3 rounded-full text-white border border-white/10 active:scale-90 transition-transform" 
            onClick={() => router.back()}
          >
            <X size={24}/>
          </button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] tracking-[0.3em] font-bold uppercase text-white/50">AR Studio</span>
            <span className="text-xl font-serif italic text-white">NailsXanh</span>
          </div>
          <div className="w-12"></div> {/* Khoảng trống để cân bằng header */}
        </header>

        {/* Footer điều khiển: Thêm bg-black/40 để tách biệt vùng chọn móng */}
        <footer className="absolute bottom-0 w-full p-6 pb-10 bg-gradient-to-t from-black via-black/60 to-transparent z-20">
          {/* Tabs Ngón Tay */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6">
            {fingerTips.map(tip => (
              <button 
                key={tip} 
                onClick={() => setActiveFinger(tip)}
                className={`px-5 py-2 rounded-full text-[10px] font-black tracking-wider whitespace-nowrap transition-all ${
                  activeFinger === tip ? 'bg-white text-black scale-105' : 'bg-white/10 text-white/60 backdrop-blur-md'
                }`}
              >
                {fingerNames[tip].toUpperCase()}
              </button>
            ))}
          </div>

          {/* Slider Móng */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 px-2 items-center">
            {modelSample.map((nail: any) => {
              const isSelected = fingerNails[activeFinger] === nail.id;
              return (
                <button 
                  key={nail.id} 
                  onClick={() => onNailSelect(activeFinger, nail.id)}
                  className={`relative w-14 h-14 flex-shrink-0 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    isSelected ? 'border-white bg-white/20 scale-110' : 'border-white/5 bg-white/5'
                  }`}
                >
                  <div className="w-8 h-10 flex items-center justify-center">
                    <img 
                      src={getFullStaticImageUrl(nail.img)} 
                      className="max-w-full max-h-full object-contain"
                      alt={nail.name} 
                    />
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Nút Chụp / Lưu */}
          <div className="flex justify-center">
            {!capturedImage ? (
              <button 
                onClick={onCapture} 
                className="w-18 h-18 rounded-full border-[3px] border-white p-1.5 active:scale-95 transition-transform"
              >
                <div className="w-full h-full bg-white rounded-full" />
              </button>
            ) : (
              <div className="flex gap-4 w-full max-w-sm">
                <button onClick={onSave} className="flex-1 bg-white text-black py-4 rounded-2xl font-black text-xs tracking-widest uppercase">LƯU ẢNH</button>
                <button onClick={onRetake} className="flex-1 bg-white/10 backdrop-blur-md text-white py-4 rounded-2xl font-black text-xs tracking-widest uppercase border border-white/10">CHỤP LẠI</button>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}