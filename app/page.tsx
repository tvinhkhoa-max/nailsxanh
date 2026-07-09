"use client"

import { useEffect, useState } from 'react';
import HeroSlide from '@/components/home/HeroSlide';
import AIQuizSection from '@/components/home/AIQuizSection';
// import ARFeature from '@/components/home/ARFeature';
import CollectionMasonry from '@/components/home/CollectionMasonry';
import NailQuiz from '@/components/home/NailQuiz';
import Location from '@/components/ui/Location';
// import FloatingContact from '@/components/ui/FloatingContact';
import FeaturedNews from '@/components/home/FeaturedNews';
import ServiceIntro from '@/components/home/ServiceIntro';
// import CollectionGrid from '@/components/collections/CollectionGrid';
import MenuSection from '@/components/home/MenuSection';
import SaleCountdown from '@/components/home/SaleCountdown';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [collections, setCollections] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const handleLoadMore = (async () => {})
  const getFetchData = async (targetPage: number, limit: number) => {
    // const colPath = `${baseUrl}/api/v1/nails/collections?hot=true&page=${targetPage}&limit=${limit}`;
    // const newsPath = `${baseUrl}/api/v1/news/search?hot=true&page=1&limit=2`;
    const colPath = `/api/collections?hot=true&page=${targetPage}&limit=${limit}`;
    const newsPath = `/api/news?hot=true&page=1&limit=2`;
    try {
      const [resCol, resNews] = await Promise.all([
        fetch(colPath),
        fetch(newsPath)
      ]);
      const resultCols = await resCol.json();
      const resultNews = await resNews.json();
      // setCollections(resultCols?.data || []); setNews(resultNews?.data || []);
      return { 
        collections: resultCols?.data || [],
        news: resultNews?.data || []
      }
    } catch (error) {
      return { collections: [], news: [] };
    }
  };
  useEffect(() => {
    const initPage = async () => {
      /**
       * 1. Hàm Fetch dữ liệu Core
       * Tách biệt logic gọi API để dùng cho cả 2 trường hợp
       */
      setLoading(true);
      try {
        const data = await getFetchData(1, 12);
        setCollections(data.collections);
        setNews(data.news);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
    initPage();

  }, []);

  return (
    // <main className="min-h-screen">
    <>
      <HeroSlide />

      <SaleCountdown />

      {/* Giới thiệu tổng quan (Dịch vụ) */}
      <ServiceIntro />

      {/* Section giới thiệu bộ sưu tập */}
      <section className="py-24 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-charcoal">Bộ Sưu Tập Độc Bản</h2>
            <p className="text-gray-500 font-light tracking-widest uppercase text-sm">Nơi nghệ thuật gặp gỡ cá tính</p>
          </div>
          {/* <CollectionMasonry collections={collections} /> */}
          <CollectionMasonry
            collections={collections}
          />
        </div>
      </section>

      {/* <NailQuiz /> */}
      <MenuSection />

      {/* Tin tức nổi bật */}
      <FeaturedNews news={news} />

      <Location />

      <AIQuizSection />

      {/* <FloatingContact /> */}

      {/* <ARFeature /> */}

      <Footer />
    </>
  );
}