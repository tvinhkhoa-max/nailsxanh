"use client"
import { motion } from 'framer-motion';

const items = [
  { id: 1, img: '/images/nails/elegant_white_nail.webp', title: 'Elegant White', size: 'h-[400px]' },
  { id: 2, img: '/images/nails/deep_forest_nail.webp', title: 'Deep Forest', size: 'h-[500px]' },
  { id: 3, img: '/images/nails/minimalist_line.webp', title: 'Minimalist Line', size: 'h-[350px]' },
  { id: 4, img: '/images/nails/nude_pearl.webp', title: 'Nude Pearl', size: 'h-[450px]' },
];

const CollectionMasonry = () => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      {items.map((item) => (
        <motion.div 
          key={item.id}
          whileHover={{ y: -10 }}
          className={`relative break-inside-avoid overflow-hidden rounded-2xl group cursor-pointer ${item.size}`}
        >
          <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <p className="text-white font-serif text-xl">{item.title}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CollectionMasonry;
