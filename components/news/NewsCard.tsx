"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';
import parse from 'html-react-parser';
import { getFullStaticImageUrl } from '@/src/lib/utils';

interface NewsCardProps {
  post: any;
  layout?: 'grid' | 'row';
}

export default function NewsCard({ post, layout = 'grid' }: NewsCardProps) {
  const isRow = layout === 'row';

  return (
    <motion.article
      whileHover={{ y: isRow ? 0 : -5, x: isRow ? 5 : 0 }}
      className={`bg-white rounded-3xl overflow-hidden transition-all border border-gray-100 
        ${isRow ? 'flex flex-col md:flex-row gap-6 p-4 items-center' : 'shadow-sm hover:shadow-md'}`}
    >
      {/* Thumbnail */}
      <div className={`${isRow ? 'w-full md:w-1/3 aspect-video' : 'aspect-[16/10]'} bg-gray-200 shrink-0 overflow-hidden rounded-2xl`}>
        <img 
          src={getFullStaticImageUrl(post.img)} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          // onError={(e) => {
          //   e.currentTarget.src = '/gray.png'
          // }}
          />
      </div>

      {/* Content */}
      <div className={`${isRow ? 'flex-1 py-2' : 'p-8'}`}>
        <p className="text-[#5E7A5E] text-[10px] font-bold uppercase mb-2">{post.date}</p>
        <Link href={`/news/${post.id}`}>
          <h3 className={`${isRow ? 'text-lg' : 'text-xl'} font-serif text-[#2D3A2D] mb-3 hover:text-[#5E7A5E] cursor-pointer leading-snug`}>
            {post.title}
          </h3>
        </Link>
        <div className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {parse(post.desc)}
        </div>
        <Link href={`/news/${post.id}`} className="text-[#2D3A2D] text-xs font-black border-b-2 border-[#5E7A5E] pb-1 hover:text-[#5E7A5E] transition-colors">
          ĐỌC CHI TIẾT
        </Link>
      </div>
    </motion.article>
  );
}