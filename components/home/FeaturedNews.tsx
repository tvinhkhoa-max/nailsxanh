// components/home/FeaturedNews.tsx
import Link from 'next/link' // Import thư viện này ở đầu file
import { getFullStaticImageUrl } from '@/src/lib/utils'

// const news = [
//   { id: 1, date: '20.04.2026', title: 'Xu hướng móng thạch (Jelly Nails) đang thống trị hè này', category: 'Trend' },
//   { id: 2, date: '15.04.2026', title: 'Cách chăm sóc móng sau khi làm để bền màu trên 4 tuần', category: 'Tips' },
// ];

interface NewsItem {
  id: number;
  title: string;
  cate: string;
  createAt: string;
  img?: string;
}

interface Props {
  news: NewsItem[],
}

export default function FeaturedNews({ news }: Props) {

  return (
    <section className="py-20 bg-[#F9FBF9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif text-charcoal">Tạp chí NailsXanh</h2>
            <p className="text-[#5E7A5E] text-sm mt-2">Cập nhật xu hướng & cảm hứng mới nhất</p>
          </div>
          <Link href={'/news'} className="text-sm underline tracking-widest uppercase">Xem tất cả</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {news.map(item => (
            <div key={item.id} className="group cursor-pointer">
              <Link href={`/news/${item.id}`}>
              <div className="overflow-hidden rounded-2xl mb-6 aspect-video bg-gray-200 flex items-center justify-center">
                {/* Thay bằng img thật */}
                { item?.img ? (
                  <img 
                    src={getFullStaticImageUrl(item.img)}
                    className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                <div className="w-full h-full bg-[#E8EEE8] flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                  <span className="text-gray-400 italic">NailsXanh Magazine</span>
                </div>
                )}
              </div>
              </Link>
              <span className="text-[#5E7A5E] text-xs font-medium uppercase tracking-widest">{item.cate} — {item.createAt}</span>
              <Link href={`/news/${item.id}`}>
                <h3 className="text-xl font-serif mt-3 group-hover:text-[#5E7A5E] transition-colors leading-snug">{item.title}</h3>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}