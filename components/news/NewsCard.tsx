"use client"
import { motion } from 'framer-motion';

export default function NewsCard({ post }: { post: any }) {
  return (
    <motion.article
      key={post.id}
      whileHover={{ y: -10 }}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
    >
      <div className="aspect-[16/10] bg-gray-200">
        <img src={post.thumb} alt={post.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-8">
        <p className="text-[#5E7A5E] text-[10px] font-bold uppercase mb-2">{post.date}</p>
        <h3 className="text-xl font-serif text-[#2D3A2D] mb-4 hover:text-[#5E7A5E] cursor-pointer">
          {post.title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {post.desc}
        </p>
        <button className="text-[#2D3A2D] text-xs font-black border-b-2 border-[#5E7A5E] pb-1 hover:text-[#5E7A5E] transition-colors">
          ĐỌC CHI TIẾT
        </button>
      </div>
    </motion.article>
  );
}