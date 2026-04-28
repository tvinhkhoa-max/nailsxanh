// src/components/ar/PCView.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCw, Save, Sparkles } from 'lucide-react';
import { getFullStaticImageUrl } from '@/src/lib/utils'
import { useBooking } from '@/src/context/BookingContext'; // Import hook

interface PCViewProps {
  // Thay vì dùng videoRef để hiển thị, ta dùng canvasRef để show kết quả đã vẽ
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  fingerNails: any, 
  activeFinger: any, 
  setActiveFinger: any, 
  onNailSelect: any,
  modelSample: any[];
  selectedColId: string;
  setSelectedColId: (id: string) => void;
  onCapture: () => void;
  capturedImage: string | null;
  onSave: () => void;
  onRetake: () => void;
  visibleCollections: any[];
  // visibleNails: any[];
}

const PCView = ({
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
  onSave,

  selectedCollection,
  setSelectedCollection,
  loading
}: any) => {
  const fingerTips = [4, 8, 12, 16, 20];
  const fingerNames: { [key: number]: string } = { 4: "Cái", 8: "Trỏ", 12: "Giữa", 16: "Áp út", 20: "Út" };
  const { openBooking } = useBooking(); // Sử dụng hook

  return (
    <div className="grid md:grid-cols-2 gap-12 items-start">
      
      {/* KHUNG HIỂN THỊ (CANVAS THAY CHO VIDEO) */}
      <div className="relative aspect-[4/3] bg-black rounded-[32px] overflow-hidden shadow-2xl border-[12px] border-[#F0F5F0]">
        
        {/* Trong ARSection hoặc PCView (nơi chứa thẻ video gốc) */}
        <video 
          ref={videoRef} 
          className="hidden" 
          muted 
          playsInline 
          autoPlay 
        />
        {/* Chúng ta hiển thị Canvas - Nơi đã được ARSection vẽ cả Video và Móng */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-10" 
        />

        {/* --- NÚT CHỤP HÌNH --- */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50">
          <AnimatePresence mode="wait">
            {!capturedImage ? (
              <motion.button 
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                onClick={onCapture}
                className="w-16 h-16 bg-white/20 backdrop-blur-md border-4 border-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all shadow-xl"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Camera className="text-[#2D3A2D]" size={24} />
                </div>
              </motion.button>
            ) : (
              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                className="flex gap-4"
              >
                <button onClick={onSave} className="flex items-center gap-2 bg-[#5E7A5E] text-white px-6 py-3 rounded-full text-xs font-bold shadow-lg">
                  <Save size={16} /> LƯU ẢNH
                </button>
                <button onClick={onRetake} className="flex items-center gap-2 bg-white text-[#2D3A2D] px-6 py-3 rounded-full text-xs font-bold shadow-lg">
                  <RefreshCw size={16} /> CHỤP LẠI
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* BẢNG ĐIỀU KHIỂN (Giữ nguyên logic của bạn) */}
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
            <div className="bg-[#E8F1E8] p-2.5 rounded-full text-[#5E7A5E]"><Sparkles size={18}/></div>
            <h3 className="font-serif text-[#2D3A2D] text-xl">Tùy chỉnh bộ móng</h3>
          </div>

          {/* 1. Chọn Bộ sưu tập */}
          {/* <div className="mb-8">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 ml-1 font-bold">Bộ sưu tập</p>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {visibleCollections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedColId(col.id)}
                  className="flex-shrink-0 flex flex-col items-center gap-2"
                >
                  <div className={`w-16 h-16 rounded-full border-2 p-1 transition-all ${
                    selectedColId === col.id ? 'border-[#5E7A5E] scale-105' : 'border-transparent opacity-50'
                  }`}>
                    <img src={col.thumb} className="w-full h-full object-cover rounded-full" alt={col.name} />
                  </div>
                  <span className={`text-[10px] font-bold ${selectedColId === col.id ? 'text-[#5E7A5E]' : 'text-gray-400'}`}>
                    {col.name}
                  </span>
                </button>
              ))}
            </div>
          </div> */}

          {/* 2. Chọn Ngón tay */}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 ml-1 font-bold">Bước 1: Chọn ngón tay</p>
            <div className="flex gap-2">
              {fingerTips.map(tip => (
                <button
                  key={tip}
                  onClick={() => setActiveFinger(tip)}
                  className={`flex-1 py-3 rounded-2xl text-[10px] font-bold transition-all ${
                    activeFinger === tip ? 'bg-[#2D3A2D] text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {fingerNames[tip].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Chọn Mẫu móng */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-4 ml-1 font-bold">
            </p>
            <div className="grid grid-cols-4 gap-3">
              {modelSample.map((nail: any) => (
                <div className="isolate" key={nail.id}>
                  <button 
                    key={nail.id} 
                    onClick={() => onNailSelect(activeFinger, nail.id)}
                    className={`aspect-square rounded-2xl border-2 p-2 transition-all border-gray-50 bg-gray-50/50 hover:border-gray-200'`}
                  >
                    <img src={getFullStaticImageUrl(nail.img)} alt={nail.name} className="nail-img" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="button"
            onClick={openBooking}
            className="w-full mt-6 py-5 bg-[#5E7A5E] text-white rounded-[24px] font-black text-xs tracking-widest hover:bg-[#2D3A2D] transition-all shadow-lg"
         >
           ĐẶT LỊCH VỚI MẪU NÀY
         </button>
        </div>
      </div>
    </div>
  );
};

export default PCView;