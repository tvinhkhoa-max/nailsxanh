"use client"
import Image from 'next/image'
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { getFullStaticImageUrl } from '@/src/lib/utils'

interface Props {
  collections: any[]
}

const CollectionMasonry = ({ collections }: Props) => {
  console.log(collections)
  return (
    <section className="bg-[#F9FBF9] py-10 px-4 md:px-10">
      {/* ... (Phần Filter Chips giữ nguyên như cũ) ... */}

      {/* GALLERY WALL WITH MASONRY */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 max-w-7xl mx-auto">
        <AnimatePresence mode='popLayout'>
          {collections.map((item: any, index: number) => (
            <motion.div
              layout
              key={index}
              className="break-inside-avoid group relative"
            >
              <div className="relative bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50">
                
                {/* LAZY LOAD IMAGE: Dùng thuộc tính loading="lazy" mặc định của trình duyệt */}
                <img 
                  src={getFullStaticImageUrl(item.img)} 
                  loading="lazy" 
                  alt={item.name}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay Buttons (Chỉ hiện khi hover) */}
                <div className="absolute inset-0 bg-[#2D3A2D]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4">
                  <button className="w-full max-w-[160px] bg-white text-[#2D3A2D] py-3 rounded-xl text-[10px] font-black flex items-center justify-center gap-2 hover:bg-[#5E7A5E] hover:text-white transition-colors"
                  >
                    <Sparkles size={14} /> <Link href={`/try-on?collection=${item.tag}`}>THỬ AR NGAY</Link>
                  </button>
                </div>

                {/* Info Bar (Luôn hiển thị nhẹ nhàng ở dưới) */}
                <div className="p-5 bg-gradient-to-t from-white via-white to-transparent">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-serif text-[#2D3A2D] font-bold tracking-tight">
                        {item.name}
                      </h3>
                      {/* <p className="text-[9px] text-[#5E7A5E] font-bold uppercase mt-1 tracking-widest">
                        {item.cate || 'Exclusive'}
                      </p> */}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CollectionMasonry;