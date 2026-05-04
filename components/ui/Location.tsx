// src/components/home/Location.tsx
"use client"
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Location() {
  return (
    <section className="py-24 bg-white px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Thông tin liên hệ */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <span className="text-[#5E7A5E] font-medium tracking-[0.2em] uppercase text-xs">Ghé thăm chúng tôi</span>
              <h2 className="text-4xl md:text-5xl font-serif mt-4 text-[#2D3A2D]">Không gian thư giãn <br/> giữa lòng phố thị</h2>
            </div>

            <div className="space-y-6">
              {[
                { icon: <MapPin size={20}/>, title: 'Địa chỉ', content: '562/23/15 Lê Quang Định . Phường Hạnh Thông, TP. Hồ Chí Minh, Việt Nam' },
                { icon: <Phone size={20}/>, title: 'Hotline', content: '0985.955.309' },
                { icon: <Clock size={20}/>, title: 'Giờ mở cửa', content: 'Thứ 2 - Chủ Nhật | 09:00 AM - 08:00 PM' },
              ].map((item, index) => (
                <div key={index} className="flex gap-5 items-start">
                  <div className="mt-1 text-[#5E7A5E]">{item.icon}</div>
                  <div>
                    <h4 className="font-semibold text-sm text-[#2D3A2D] uppercase tracking-wider">{item.title}</h4>
                    <p className="text-gray-500 font-light mt-1">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bản đồ - Sử dụng Iframe Google Maps */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="h-[450px] rounded-[32px] overflow-hidden shadow-2xl border-[10px] border-[#F0F5F0]"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3918.918!2d106.686871!3d10.816924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDQ5JzAwLjkiTiAxMDbCsDQxJzIyLjAiRQ!5e0!3m2!1svi!2s!4v1714900000000!5m2!1svi!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}