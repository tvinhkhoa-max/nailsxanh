// src/components/ar/MobileView.tsx
import { useRouter } from 'next/navigation';
import { getFullStaticImageUrl } from '@/src/lib/utils'
// import { Camera, RefreshCw, X, Save } from 'lucide-react';
import { X } from 'lucide-react';

// Thêm các props còn thiếu vào interface
// interface MobileViewProps {
//   videoRef: React.RefObject<HTMLVideoElement | null>;
//   canvasRef: React.RefObject<HTMLCanvasElement | null>;
//   fingerNails: any; 
//   activeFinger: number; 
//   setActiveFinger: (tip: number) => void; 
//   onNailSelect: (finger: number, id: string) => void;
//   modelSample: any[];
//   onCapture: () => void;
//   capturedImage: string | null;
//   onSave: () => void;
//   onRetake: () => void;
//   // selectedColId: string; // Thêm
//   // setSelectedColId: (id: string) => void; // Thêm
// }

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
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* KHÔNG DÙNG THẺ VIDEO ĐỂ HIỂN THỊ, CHỈ DÙNG CANVAS */}
      <video ref={videoRef} className="hidden" playsInline muted />
      
      <div className="relative flex-1 w-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />

        {/* [NEW] OVERLAY LÀM MỜ VÙNG NGOÀI - FOCUS VÙNG TRONG TỶ LỆ 1/3 MÀN HÌNH*/}
        <div className="absolute inset-0 flex justify-center items-start pt-[15vh] pointer-events-none z-10 overflow-hidden">
          
          {/* ĐÂY LÀ CHIẾC KHUNG CHỮ NHẬT */}
          <div className="relative w-[75%] max-w-[300px] aspect-[3/4] rounded-[48px]">
            
            {/* 1. HIỆU ỨNG LÀM MỜ XUNG QUANH: 
                Dùng shadow cực lớn (với độ lan tỏa 9999px) để phủ kín màn hình bên ngoài khung.
                Màu đen mờ (black/60) giúp camera bên trong khung nhìn nổi bật hơn.
            */}
            <div className="absolute inset-0 rounded-[48px] shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] z-0"></div>

            {/* 2. VIỀN SÁNG ĐỂ PHÂN TÁCH VÙNG RÕ VÀ MỜ */}
            <div className="absolute inset-0 rounded-[48px] border-2 border-white/40 z-10"></div>

            {/* 3. 4 GÓC FOCUS (GIỮ NGUYÊN NHƯ CŨ NHƯNG TĂNG ĐỘ SÁNG) */}
            <div className="absolute top-0 left-0 w-14 h-14 border-l-[5px] border-t-[5px] border-green-400 rounded-tl-[48px] -translate-x-1.5 -translate-y-1.5 z-20"></div>
            <div className="absolute top-0 right-0 w-14 h-14 border-r-[5px] border-t-[5px] border-green-400 rounded-tr-[48px] translate-x-1.5 -translate-y-1.5 z-20"></div>
            <div className="absolute bottom-0 left-0 w-14 h-14 border-l-[5px] border-b-[5px] border-green-400 rounded-bl-[48px] -translate-x-1.5 translate-y-1.5 z-20"></div>
            <div className="absolute bottom-0 right-0 w-14 h-14 border-r-[5px] border-b-[5px] border-green-400 rounded-br-[48px] translate-x-1.5 translate-y-1.5 z-20"></div>

            {/* 4. CHỮ HƯỚNG DẪN */}
            <div className="absolute inset-x-0 -bottom-12 text-center z-20">
              <span className="text-white/90 text-[11px] font-bold tracking-[0.2em] bg-green-600/80 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
                ĐẶT TAY VÀO KHUNG RÕ
              </span>
            </div>
          </div>
        </div>
        {/* ======================================================= */}
        
        {/* 2. Top Controls */}
        <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
          <button className="bg-black/20 backdrop-blur-md p-3 rounded-full text-white border border-white/10" onClick={() => router.back()}><X size={24}/></button>
          <div className="flex flex-col items-center">
            <span className="text-xs tracking-[0.2em] font-medium uppercase text-white/60">AR Studio</span>
            <span className="text-lg font-serif italic">NailsXanh</span>
          </div>
          {/* <button onClick={startCamera} className="bg-black/20 backdrop-blur-md p-3 rounded-full text-white border border-white/10"><RefreshCw size={24}/></button> */}
        </header>

        {/* Panel Điều khiển */}
        <footer className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black to-transparent z-20  items-center">
          {/* Tabs Ngón Tay */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
            {fingerTips.map(tip => (
              <button 
                key={tip} 
                onClick={() => setActiveFinger(tip)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  activeFinger === tip ? 'bg-white text-black' : 'bg-white/20 text-white'
                }`}
              >
                {fingerNames[tip].toUpperCase()}
              </button>
            ))}
          </div>

          {/* Slider Móng */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar mb-8 px-6 items-center">
            {modelSample.map((nail: any) => {
              const isSelected = fingerNails[activeFinger] === nail.id;

              return (
                <button 
                  key={nail.id} 
                  onClick={() => onNailSelect(activeFinger, nail.id)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                    isSelected 
                      ? 'border-white bg-white/40 scale-110' 
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  {/* Container trung gian để khống chế tỷ lệ ảnh */}
                  <div className="w-10 h-12 flex items-center justify-center overflow-hidden">
                    <img 
                      src={getFullStaticImageUrl(nail.img)} 
                      className="max-w-full max-h-full object-contain"
                      style={{
                        // Chống việc ảnh bị stretch hoặc biến dạng
                        width: 'auto',
                        height: 'auto',
                      }}
                      alt={nail.name} 
                    />
                  </div>

                  {/* Chấm nhỏ chỉ báo ngón tay đang chọn (Optional UX) */}
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Nút Chụp */}
          <div className="flex justify-center pb-4">
            {!capturedImage ? (
              <button onClick={onCapture} className="w-20 h-20 rounded-full border-4 border-white p-1">
                <div className="w-full h-full bg-white rounded-full shadow-lg" />
              </button>
            ) : (
              <div className="flex gap-4 w-full">
                <button onClick={onSave} className="flex-1 bg-white text-black py-4 rounded-2xl font-bold">LƯU ẢNH</button>
                <button onClick={onRetake} className="flex-1 bg-white/20 text-white py-4 rounded-2xl font-bold">CHỤP LẠI</button>
              </div>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}