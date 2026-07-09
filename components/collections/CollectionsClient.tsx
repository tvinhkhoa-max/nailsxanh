"use client"

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import CollectionGrid from '@/components/collections/CollectionGrid';
import FilterBar from '@/components/collections/FilterBar';
// import FloatingContact from '@/components/ui/FloatingContact';
import AIQuizSection from '@/components/home/AIQuizSection';

export default function CollectionsClient({ searchParams }: { searchParams: any }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;
  const activeCategory = searchParams?.category || searchParams?.q || 'All';
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. Lấy Categories - Chỉ chạy 1 lần duy nhất
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // const res = await fetch(`${baseUrl}/api/v1/nails/cates`);
        // setCategories(catsData?.data || catsData);
        const res = await fetch('/api/categories') as any;
        const catsData = await res.json();
        setCategories(catsData?.data || catsData);
      } catch (error) {
        console.error("Error Categories:", error);
      }
    };
    fetchCategories();
  }, [baseUrl]);

  /**
   * 2. Hàm Fetch dữ liệu Core
   * Tách biệt logic gọi API để dùng cho cả 2 trường hợp
   */
  const getCollectionsData = async (cat: string, targetPage: number) => {
    const colPath = cat !== 'All' 
      // ? `${baseUrl}/api/v1/nails/collections/search?category=${cat}&page=${targetPage}&limit=${limit}`
      // : `${baseUrl}/api/v1/nails/collections?page=${targetPage}&limit=${limit}`;
      ? `/api/collections?category=${cat}&page=${targetPage}&limit=${limit}`
      : `/api/collections?page=${targetPage}&limit=${limit}`;
    
    const res = await fetch(colPath) as any;
    const result = await res.json();
    return result?.data || result;
  };

  // 3. Khi activeCategory thay đổi -> RESET toàn bộ
  useEffect(() => {
    const initLoad = async () => {
      setLoading(true);
      setHasMore(true);
      setPage(1); // Reset page về 1
      
      try {
        const data = await getCollectionsData(activeCategory, 1); console.log(data);
        setCollections(data || []);
        
        // Nếu trang đầu tiên trả về ít hơn 12 mẫu thì không còn trang sau
        if (!data || data.length < 12) setHasMore(false);
      } catch (error) {
        console.error("Error Initial Load:", error);
      } finally {
        setLoading(false);
      }
    };

    initLoad();
  }, [activeCategory, baseUrl]); 

  // 4. Hàm Load More - Chỉ NỐI mảng, không RESET
  const handleLoadMore = useCallback(async () => {
    // Chặn nếu đang load hoặc đã hết dữ liệu
    if (loadingMore || !hasMore || loading) return;
    
    setLoadingMore(true);
    const nextPage = page + 1;
    
    try {
      const newData = await getCollectionsData(activeCategory, nextPage);

      if (newData && newData.length > 0) {
        setCollections((prev) => {
          // Lọc bỏ trùng lặp ID (phòng trường hợp DB/API trả về trùng)
          const combined = [...prev, ...newData];
          return combined.filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
          );
        });
        setPage(nextPage);
        
        if (newData.length < 12) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error load more:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [activeCategory, page, hasMore, loadingMore, loading, baseUrl]);

  return (
    <>
      <div className="bg-[#F9FBF9] min-h-screen pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <header className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#5E7A5E] font-medium tracking-[0.3em] uppercase text-xs">
              Curated Series
            </motion.span>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-6xl font-serif mt-4 text-[#2D3A2D]">
              Bộ Sưu Tập <span className="italic">Nghệ Thuật</span>
            </motion.h1>
            <div className="w-20 h-[1px] bg-[#5E7A5E] mx-auto mt-8 opacity-30" />
          </header>

          <FilterBar categories={categories} active={activeCategory} />

          {loading ? (
            <div className="flex justify-center items-center h-64 text-[#5E7A5E] italic">
              Đang tìm những mẫu móng đẹp nhất...
            </div>
          ) : (
            <CollectionGrid
              collections={collections}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoadingMore={loadingMore}
            />
          )}
        </div>
      </div>
      {/* <FloatingContact /> */}
      <AIQuizSection />
    </>
  );
}