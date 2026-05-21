"use client"

import { useEffect, useState } from 'react';
import NewsSection from '@/components/news/NewsSection';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [hotNews, setHotNews] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10; // Mỗi trang 10 tin như bạn muốn

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      // 1. Lấy 3 tin HOT trước nếu là trang 1
      let currentHot = hotNews;
      if (page === 1 && hotNews.length === 0) {
        // const hotRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/news/search?hot=true&limit=3`);
        const hotRes = await fetch(`/api/news?hot=true&limit=3`);
        const hotData = await hotRes.json();
        currentHot = hotData?.data || [];
        setHotNews(currentHot);
      }

      // 2. Lấy danh sách tin thường (loại trừ ID của tin hot)
      const excludeIds = currentHot.map((item: any) => item.id).join('|');
      // const newsPath = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/news/search?exclude=${excludeIds}&page=${page}&limit=${limit}`;
      const newsPath = `/api/news?exclude=${excludeIds}&page=${page}&limit=${limit}`;
      
      const res = await fetch(newsPath);
      const resultNews = await res.json();

      setNews(resultNews?.data || []);
      setTotal(resultNews?.total || 0);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
    // Cuộn lên đầu khi sang trang mới
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  return (
    <main className="min-h-screen bg-[#F9FBF9]">
      <NewsSection 
        featuredPosts={hotNews} 
        regularPosts={news}
        total={total}
        currentPage={currentPage}
        onPageChange={(page: number) => setCurrentPage(page)}
        loading={loading}
        postsPerPage={limit}
      />
    </main>
  );
}