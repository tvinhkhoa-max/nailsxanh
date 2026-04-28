"use client"
// components/news/NewsSection.tsx
import NewsCard from '@/components/news/NewsCard';

const blogPosts = [
  { id: 1, title: "Cách giữ màu móng lâu phai", date: "24/04/2026", thumb: "/news-1.jpg", desc: "Bí quyết từ các chuyên gia tại NailsXanh giúp bộ móng của bạn luôn bền đẹp..." },
  { id: 2, title: "Top 5 màu nail cho da ngăm", date: "22/04/2026", thumb: "/news-2.jpg", desc: "Không còn tự ti, hãy cùng khám phá những gam màu tôn da nhất mùa hè này..." },
];

export default function NewsPage() {
  return (
    <section className="bg-[#F9FBF9] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <span className="text-[#5E7A5E] font-medium tracking-widest uppercase text-xs">Cảm hứng & Chia sẻ</span>
          <h2 className="text-4xl md:text-5xl font-serif mt-4 text-[#2D3A2D]">Tạp chí <span className="italic">NailsXanh</span></h2>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post) => (
            <NewsCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}