"use client"
import NewsCard from '@/components/news/NewsCard';
import { getFullStaticImageUrl } from '@/src/lib/utils';

interface Props {
  featuredPosts: any[];
  regularPosts: any[];
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  postsPerPage: number;
}

export default function NewsSection({ 
  featuredPosts, 
  regularPosts, 
  total, 
  currentPage, 
  onPageChange,
  loading,
  postsPerPage 
}: Props) {
  const totalPages = Math.ceil(total / postsPerPage);

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="text-center mb-16">
          <span className="text-[#5E7A5E] font-medium tracking-widest uppercase text-xs">NailsXanh Magazine</span>
          <h1 className="text-4xl md:text-5xl font-serif mt-4 text-[#2D3A2D]">Cảm hứng & <span className="italic text-[#5E7A5E]">Xu hướng</span></h1>
        </header>

        {/* 3 BÀI NỔI BẬT - Chỉ hiện ở trang 1 */}
        {currentPage === 1 && featuredPosts.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {featuredPosts.map((post) => (
              <NewsCard key={post.id} post={post} layout="grid" />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-2xl font-serif text-[#2D3A2D]">Bài viết mới nhất</h3>
          <div className="h-[1px] flex-1 bg-gray-200"></div>
        </div>

        {/* DANH SÁCH TIN DẠNG ROW */}
        <div className="max-w-5xl mx-auto flex flex-col gap-8 min-h-[600px]">
          {loading ? (
            <div className="flex justify-center py-20 italic text-gray-400">Đang tải bản tin...</div>
          ) : (
            regularPosts.map((post) => (
              <NewsCard key={post.id} post={post} layout="row" />
            ))
          )}
        </div>

        {/* PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`w-10 h-10 rounded-full transition-all ${
                  currentPage === i + 1 
                  ? 'bg-[#5E7A5E] text-white shadow-md' 
                  : 'bg-white text-gray-400 hover:border-[#5E7A5E] border border-transparent'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}