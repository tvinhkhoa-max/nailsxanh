import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface FilterBarProps {
  categories: any[];
  active: string;
}

// const categories = ['All', 'Minimalist', 'Luxury', 'Floral', 'Pastel', 'Seasonal'];

export default function FilterBar({ categories, active }: FilterBarProps) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
      <button
        onClick={() => router.push('/collections')}
        className={`text-xs tracking-[0.2em] uppercase font-semibold transition-all ${
          active === 'All' ? 'text-[#5E7A5E] border-b-2 border-[#5E7A5E]' : 'text-gray-400'
        }`}
      >
        Tất cả
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => router.push(`/collections?category=${cat.tag}`)}
          className={`relative px-4 py-2 text-sm uppercase tracking-widest transition-all ${
            active === cat.tag ? 'text-[#2D3A2D] font-bold' : 'text-gray-400 hover:text-[#5E7A5E]'
          }`}
        >
          {cat.name}
          {active === cat && (
            <motion.div 
              layoutId="underline" 
              className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5E7A5E]" 
            />
          )}
        </button>
      ))}
    </div>
  );
}