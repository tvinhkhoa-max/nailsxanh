// components/collections/CollectionGrid.tsx
"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

import { Sparkles, MessageCircle, Loader2, ChevronRight } from 'lucide-react';
import { getFullStaticImageUrl } from '@/src/lib/utils'

interface CollectionProps {
  id: string
  cate: string
  name: string
  tag: string
  img: string
}

interface CollectionGridProps {
  collections: CollectionProps[],
  onLoadMore: any,
  hasMore: any, 
  isLoadingMore: any
}

export default function CollectionGrid({ collections, onLoadMore, hasMore, isLoadingMore }: CollectionGridProps) {
  // const initialCollections = collections;
  // const [activeTab, setActiveTab] = useState('all');
  
  // // Quản lý dữ liệu hiển thị và trạng thái tải thêm
  // const [displayItems, setDisplayItems] = useState(initialCollections.slice(0, 8)); // Load 8 cái đầu tiên
  // const [isLoading, setIsLoading] = useState(false);
  
  // // Ref để theo dõi điểm cuối danh sách
  // const loadMoreRef = useRef(null);

  // // Ref này để đánh dấu điểm cuối của danh sách
  // const observerTarget = useRef(null);

  // Logic load thêm dữ liệu
  // const loadMoreItems = () => {
  //   if (isLoading || !hasMore) return;
    
  //   setIsLoading(true);

  //   // Giả lập delay mạng 1s
  //   setTimeout(() => {
  //     const currentLength = displayItems.length;
  //     const nextItems = initialCollections.slice(currentLength, currentLength + 4); // Mỗi lần load thêm 4
      
  //     setDisplayItems(prev => [...prev, ...nextItems]);

  //     if (currentLength + 4 >= initialCollections.length) setHasMore(false);
  //     setIsLoading(false);
  //   }, 800);
  // };

  // Intersection Observer: Theo dõi khi khách cuộn đến cuối
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       if (entries[0].isIntersecting && hasMore && !isLoading) {
  //         loadMoreItems();
  //       }
  //     },
  //     { threshold: 1.0 }
  //   );

  //   if (observerTarget.current) {
  //     observer.observe(observerTarget.current);
  //   }

  //   // if (loadMoreRef.current) {
  //   //   observer.observe(loadMoreRef.current);
  //   // }

  //   // return () => observer.disconnect();
  //   return () => {
  //     if (observerTarget.current) observer.unobserve(observerTarget.current);
  //   };

  // }, [hasMore, displayItems, isLoading]);

  // Lọc dữ liệu theo Tab (vẫn giữ logic filter của bạn)
  // const filteredData = activeTab === 'all' 
  //   ? displayItems 
  //   : displayItems.filter(item => item.cate === activeTab);
  const observerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '200px' } 
    );

    if (observerRef.current) observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoadingMore]);

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
                  
                  <button className="w-full max-w-[160px] bg-black/30 backdrop-blur-md text-white py-3 rounded-xl text-[10px] font-black border border-white/20 flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors">
                    <MessageCircle size={14} /> TƯ VẤN AI
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
                    <button className="text-gray-300 group-hover:text-[#5E7A5E] transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ĐIỂM CHỐT ĐỂ LOAD THÊM (LOADER) */}
      <div ref={observerRef} className="py-20 flex justify-center items-center">
        {isLoadingMore ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-[#5E7A5E]" size={32} />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đang lấy thêm cảm hứng...</p>
          </div>
        ) : hasMore ? (
          <div className="h-10" /> // Khoảng trống để observer bắt được
        ) : (
          <p className="text-gray-300 font-serif italic">Bạn đã xem hết bộ sưu tập hiện có</p>
        )}
      </div>
    </section>
  );
}