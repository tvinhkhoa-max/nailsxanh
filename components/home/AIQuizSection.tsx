"use client"
import { motion } from 'framer-motion';
import { NailQuiz } from '../ai/NailQuiz';

const AIQuizSection = () => {
  return (
    <section className="py-24 bg-[#F0F5F0] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-[#5E7A5E] font-medium tracking-[0.2em] uppercase text-xs">Innovation</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 mb-6 text-charcoal leading-tight">
            Tìm kiếm mẫu móng <br /> hoàn hảo với AI
          </h2>
          <p className="text-gray-600 font-light mb-8 leading-relaxed">
            Không còn băn khoăn giữa hàng ngàn lựa chọn. Trò chuyện với AI của chúng tôi để nhận gợi ý dựa trên trang phục, sự kiện và tông da của bạn.
          </p>
          <ul className="space-y-4">
            {['Cá nhân hóa 100%', 'Gợi ý theo xu hướng', 'Tích hợp thử AR trực tiếp'].map((text) => (
              <li key={text} className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 bg-[#5E7A5E] rounded-full" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="relative z-10"
        >
          <NailQuiz />
        </motion.div>
      </div>
    </section>
  );
};

export default AIQuizSection;