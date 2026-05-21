// src/app/news/[id]/page.tsx
"use client"

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, Clock, Share2, MessageCircle } from 'lucide-react'; // Facebook,
import Link from 'next/link';
import parse from 'html-react-parser';
import { getFullStaticImageUrl } from '@/src/lib/utils';
import { useParams } from 'next/navigation'

export default function NewsDetail() {
  // const searchParams = useSearchParams();
  const params = useParams()
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any>(null);

  const id = params.id as string;

  const fetchData = async (Id: string) => {
    setLoading(true);
    try {
      if (Id) {
        // const newsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/news/detail?id=${Id}`);
        const newsRes = await fetch(`/api/news/detail?id=${Id}`);
        const newsData = await newsRes.json();
        setNews(newsData?.data || null);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(id);
    // Cuộn lên đầu khi sang trang mới
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [params.id]);

  return (
    <>
    {
      news && (
        <div className="bg-[#F9FBF9] min-h-screen pb-20">
          {/* 1. Progress Bar (Thanh tiến trình đọc) */}
          <motion.div 
            className="fixed top-0 left-0 right-0 h-1 bg-[#5E7A5E] z-[100] origin-left"
            style={{ scaleX: 0 }} // Bạn có thể tích hợp useScroll của framer-motion ở đây
          />

          {/* 2. Hero Header */}
          <header className="pt-32 pb-16 px-6">
            <div className="max-w-3xl mx-auto">
              <Link href="/news" className="flex items-center gap-2 text-[#5E7A5E] text-xs font-black mb-10 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> TRỞ LẠI TẠP CHÍ
              </Link>
              
              <div className="flex items-center gap-3 mb-6">
                {/* <span className="bg-[#E8F1E8] text-[#5E7A5E] px-4 py-1 rounded-full text-[10px] font-bold uppercase">Xu hướng 2026</span> */}
                {/* <span className="text-gray-400 text-[10px] flex items-center gap-1"><Clock size={12}/> 5 phút đọc</span> */}
              </div>

              <h1 className="text-4xl md:text-6xl font-serif text-[#2D3A2D] leading-[1.1] mb-8">
                {news?.title}
              </h1>

              <div className="flex items-center justify-between py-8 border-y border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#E8F1E8] overflow-hidden">
                    <img src="/assets/images/avatar_admin.png" alt="Author" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2D3A2D]">Nguồn: { news?.source || 'NailsXanh Editor'}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{news?.createAt} {/* 26 Tháng 04, 2026 */}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-gray-400">
                  <Share2 size={18} className="hover:text-[#5E7A5E] cursor-pointer" />
                  {/* <Facebook size={18} className="hover:text-[#5E7A5E] cursor-pointer" /> */}
                </div>
              </div>
            </div>
          </header>

          {/* 3. Nội dung bài viết */}
          <article className="px-6">
            <div className="max-w-3xl mx-auto">
              {/* Ảnh bìa bài viết */}
              <div className="aspect-[16/9] rounded-[48px] overflow-hidden mb-16 shadow-2xl">
                <img src={getFullStaticImageUrl(news?.img)} className="w-full h-full object-cover" alt="Main cover" />
              </div>

              {/* Nội dung text chuyên sâu */}
              <div className="prose prose-lg max-w-none prose-serif text-gray-700 leading-relaxed">
                <p className="text-xl text-[#2D3A2D] font-medium mb-8 leading-relaxed italic border-l-4 border-[#5E7A5E] pl-6">
                  {news?.subtitle}
                </p>
                {parse(news?.desc)}
              </div>

              {/* Tag Cloud */}
              <div className="mt-16 pt-8 border-t border-gray-100 flex gap-2">
                {['#Minimalist', '#SốngXanh', '#Trend2026'].map(tag => (
                  <span key={tag} className="text-xs text-gray-400 hover:text-[#5E7A5E] cursor-pointer">{tag}</span>
                ))}
              </div>
            </div>
          </article>

          {/* 4. Bài viết liên quan (CTA) */}
          <section className="mt-20 bg-[#E8F1E8]/50 py-20">
            <div className="max-w-3xl mx-auto px-6 text-center">
                <h3 className="text-2xl font-serif text-[#2D3A2D] mb-8">Bạn muốn thử phong cách này?</h3>
                <button className="bg-[#5E7A5E] text-white px-10 py-5 rounded-full font-black text-xs tracking-widest hover:bg-[#2D3A2D] transition-all">
                    ĐẶT LỊCH TRẢI NGHIỆM NGAY
                </button>
            </div>
          </section>
        </div>
     )}
    </>
  );
}