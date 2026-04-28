"use client"
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Box } from 'lucide-react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/src/lib/api';
import { getFullStaticImageUrl } from '@/src/lib/utils'

const nailSamples = [
  { id: 1, title: 'Morning Dew', category: 'Minimalist', img: '/images/nails/morning_dew.jpg' },
  { id: 2, title: 'Emerald Forest', category: 'Luxury', img: '/images/nails/emerald-forest.jpg.avif' },
  { id: 3, title: 'Petal Soft', category: 'Floral', img: '/images/nails/pental-soft.webp' },
  { id: 4, title: 'Midnight Muse', category: 'Luxury', img: '/images/nails/midnight-muse.webp' },
  // Thêm dữ liệu tùy ý...
];

const allCollections = [
  { id: 'nang-xuan', name: 'Nắng Xuân', category: 'Natural', thumb: '/collections/thumb-xuan.png' },
  { id: 'chieu-ha', name: 'Chiều Hạ', category: 'Natural', thumb: '/collections/thumb-ha.png' },
  { id: 'em-dem', name: 'Êm Đềm', category: 'Minimalist', thumb: '/collections/thumb-em.png' },
];

interface CollectionProps {
  id: string
  name: string
  tag: string
  img: string
}

interface CollectionGridProps {
  collections: CollectionProps[],
}

export default function CollectionGrid({ collections }: CollectionGridProps) {
  const router = useRouter();

  // const filtered = category === 'All' ? nailSamples : nailSamples.filter(s => s.category === category);
  // if (error) return <div className="text-center py-20 text-red-500">Không thể tải dữ liệu...</div>;
  // if (isLoading) return <div className="text-center py-20">Đang tìm mẫu đẹp cho bạn...</div>;
  if (collections.length === 0) {
    return <div className="text-center text-gray-400 py-20">Chưa có mẫu nào trong mục này.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      <AnimatePresence mode='popLayout'>
        {collections.map((item: any) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="group relative"
          >
            {/* Ảnh sản phẩm */}
            <div className="aspect-[3/4] overflow-hidden rounded-[24px] bg-white border border-gray-100 shadow-sm transition-all group-hover:shadow-xl">
              <img 
                src={getFullStaticImageUrl(item.img)}
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Overlay khi hover */}
              <div className="absolute inset-0 bg-[#2D3A2D]/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                <button className="bg-white text-[#2D3A2D] px-6 py-3 rounded-full flex items-center gap-2 text-xs font-bold tracking-widest hover:bg-[#E8F1E8] transition-all">
                  <Link href={`/try-on?collection=${item.tag}`}><Box size={16} /> THỬ AR (LIVE)</Link>
                </button>
                <button className="text-white border border-white/50 px-6 py-3 rounded-full text-xs font-bold tracking-widest hover:bg-white hover:text-[#2D3A2D] transition-all">
                  <Eye size={16} /> CHI TIẾT
                </button>
              </div>
            </div>

            {/* Thông tin sản phẩm */}
            <div className="mt-6 text-center">
              <h3 className="font-serif text-xl text-[#2D3A2D]">{item.title}</h3>
              <p className="text-[#5E7A5E] text-xs uppercase tracking-widest mt-1 opacity-70">
                {item.category}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}