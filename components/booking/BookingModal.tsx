// components/booking/BookingModal.tsx
"use client"
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, ChevronDown, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { sendBooking } from '@/app/actions/sendBooking';
import { useBooking } from '@/src/context/BookingContext';

export default function BookingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const { selectedServiceId, setSelectedServiceId } = useBooking();

  // Hook useQuery sẽ quản lý việc gọi API và Caching
  const { data: services, isLoading, isError } = useQuery({
    queryKey: ['nail-services'], // Khóa định danh duy nhất cho cache
    queryFn: async () => {
      const serviceRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`)
      const serviceData = await serviceRes.json();
      return serviceData?.data || []
    },
    staleTime: 1000 * 60 * 0.5, // Cache 10 phút
    enabled: isOpen, // CHỈ gọi API khi Modal được mở (Rất quan trọng!)
  })
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('loading');

    const formData = JSON.stringify({
      name: (e.target as any).name.value,
      phone: (e.target as any).phone.value,
      date: (e.target as any).date.value,
      time: (e.target as any).time.value,
      service: (e.target as any).service.value
    });

    const result = await sendBooking(formData);

    if (result.success) {
      setStatus('success');
      setTimeout(() => {
        onClose(); // Đóng modal sau khi thành công
        setStatus('idle');
      }, 2000);
    } else {
      alert("Có lỗi xảy ra, vui lòng thử lại!");
      setStatus('idle');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2D3A2D]/70 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal Content */}
          <motion.div 
            // Hiệu ứng: PC thì scale/fade, Mobile thì trượt từ dưới (y: 100%) lên
            initial={{ y: "100%", opacity: 1 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ y: "100%", opacity: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto md:w-[500px] bg-white rounded-t-[40px] md:rounded-[48px] shadow-2xl z-[101] overflow-hidden"
          >
            {/* Thanh gạt nhỏ trên đầu dành cho Mobile để khách biết có thể vuốt xuống */}
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 md:hidden" />

            <div className="p-8 md:p-12">
              <button onClick={onClose} className="absolute top-6 right-8 text-gray-400 hover:text-black hidden md:block">
                  <X size={24} />
              </button>

              <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-serif text-[#2D3A2D] mb-2">Đặt lịch <span className="italic">Dịch vụ</span></h2>
                  <p className="text-gray-400 text-xs md:text-sm">Chúng tôi sẽ xác nhận lại sau 5 phút</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                  {/* Input Họ Tên */}
                  <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-gray-400 ml-2">Họ và tên</label>
                      <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E7A5E]" size={18} />
                          <input type="text" placeholder="Nguyễn Văn A" name="name" className="w-full pl-12 pr-6 py-4 bg-[#F9FBF9] rounded-2xl outline-none text-sm border border-transparent focus:border-[#5E7A5E] transition-all" />
                      </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-2">Điện thoại liên hệ</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E7A5E]" size={18} />
                      <input type="text" placeholder="Điện thoại" name="phone" className="w-full pl-12 pr-6 py-4 bg-[#F9FBF9] rounded-2xl outline-none text-sm border border-transparent focus:border-[#5E7A5E] transition-all" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-400 ml-2">Gói dịch vụ</label>
                    <div className="relative">
                      <select
                        value={selectedServiceId || ''}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-full pl-12 pr-10 py-4 bg-[#F9FBF9] rounded-2xl text-sm outline-none border border-transparent focus:border-[#5E7A5E] appearance-none cursor-pointer"
                      >
                        {services?.map((item: any) => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                  </div>

                  {/* Ngày & Giờ (Chia 2 cột) */}
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400 ml-2">Ngày hẹn</label>
                          <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E7A5E]" size={18} />
                              <input type="date" name="date" className="w-full pl-12 pr-4 py-4 bg-[#F9FBF9] rounded-2xl text-sm outline-none border border-transparent focus:border-[#5E7A5E]" />
                          </div>
                      </div>
                      <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-gray-400 ml-2">Giờ hẹn</label>
                          <div className="relative">
                              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E7A5E]" size={18} />
                              <select name="time" className="w-full pl-12 pr-10 py-4 bg-[#F9FBF9] rounded-2xl text-sm outline-none border border-transparent focus:border-[#5E7A5E] appearance-none cursor-pointer">
                                  <option>09:00 AM</option>
                                  <option>10:30 AM</option>
                                  <option>02:00 PM</option>
                                  <option>04:30 PM</option>
                                  <option>06:00 PM</option>
                                  <option>07:30 PM</option>
                              </select>
                              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                          </div>
                      </div>
                  </div>

                  {/* <button className="w-full py-5 bg-[#5E7A5E] text-white rounded-[24px] font-black text-xs tracking-[0.2em] hover:bg-[#2D3A2D] transition-all shadow-lg active:scale-95 mt-4">
                      XÁC NHẬN ĐẶT LỊCH
                  </button> */}
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full py-5 bg-[#5E7A5E] text-white rounded-[24px] font-black text-xs tracking-[0.2em] relative overflow-hidden"
                  >
                    {status === 'loading' ? 'ĐANG GỬI...' : status === 'success' ? 'ĐẶT LỊCH THÀNH CÔNG!' : 'XÁC NHẬN ĐẶT LỊCH'}
                    
                    {status === 'success' && (
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute inset-0 bg-green-600 flex items-center justify-center"
                      >
                        🎉 CẢM ƠN BẠN!
                      </motion.div>
                    )}
                  </button>
                  
                  {/* Nút đóng cho Mobile */}
                  <button 
                      type="button"
                      onClick={onClose}
                      className="w-full py-3 text-gray-400 text-[10px] font-bold uppercase tracking-widest md:hidden"
                  >
                      Để sau
                  </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}