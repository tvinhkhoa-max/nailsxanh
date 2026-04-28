"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CollectionGrid from '@/components/collections/CollectionGrid';
import FilterBar from '@/components/collections/FilterBar';
import FloatingContact from '@/components/ui/FloatingContact';
import AIQuizSection from '@/components/home/AIQuizSection';


export default function CollectionsClient({ searchParams }: { searchParams: any }) {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy category từ URL (ví dụ: ?category=Natural)
  const activeCategory = searchParams?.category || searchParams?.q || 'All';

  // Lấy category từ URL (ví dụ: ?category=Natural)
  // const activeCategory = searchParams?.category || 'All';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // Gọi song song cả 2 API
        const [resCats, resCols] = await Promise.all([
          fetch(`${baseUrl}/api/v1/nails/cates`),
          fetch(`${baseUrl}/api/v1/nails/collections${activeCategory && activeCategory != 'All' ? '/search?category=' + activeCategory : ''}`)
        ]);

        const catsData = await resCats.json();
        const colsData = await resCols.json() || [];

        setCategories(catsData.data || catsData);
        setCollections(colsData.data || colsData);
      } catch (error) {
        console.error("Lỗi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]); // Chạy lại mỗi khi category trên URL thay đổi

  return (
    <>
    <div className="bg-[#F9FBF9] min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header của trang */}
        <header className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#5E7A5E] font-medium tracking-[0.3em] uppercase text-xs"
          >
            Curated Series
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif mt-4 text-[#2D3A2D]"
          >
            Bộ Sưu Tập <span className="italic">Nghệ Thuật</span>
          </motion.h1>
          <div className="w-20 h-[1px] bg-[#5E7A5E] mx-auto mt-8 opacity-30" />
        </header>

        {/* Thanh lọc Category */}
        <FilterBar 
          categories={categories} 
          active={activeCategory} 
        />

        {/* Grid hiển thị sản phẩm */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-[#5E7A5E] italic">
            Đang tìm những mẫu móng đẹp nhất...
          </div>
        ) : (
          <>
            <CollectionGrid collections={collections} />
          </>
        )}
      </div>
    </div>

    <FloatingContact />

    <AIQuizSection />
    </>
  );
}