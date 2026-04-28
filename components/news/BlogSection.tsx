// components/news/BlogSection.tsx
export default function BlogSection() {
  return (
    <section className="py-20 bg-[#F9FBF9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#5E7A5E] font-bold text-[10px] uppercase tracking-[0.3em]">Cảm hứng</span>
            <h2 className="text-4xl font-serif text-[#2D3A2D] mt-2 italic">Beauty Journal</h2>
          </div>
          <button className="text-sm border-b-2 border-[#5E7A5E] pb-1 font-bold text-[#2D3A2D]">XEM TẤT CẢ</button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <article key={item} className="group cursor-pointer">
              <div className="relative aspect-[4/5] rounded-[40px] overflow-hidden mb-6">
                <img 
                  src={`/blog-${item}.jpg`} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt="Blog" 
                />
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-bold text-[#5E7A5E]">
                  TRENDS 2026
                </div>
              </div>
              <h3 className="text-2xl font-serif text-[#2D3A2D] leading-tight mb-4 group-hover:text-[#5E7A5E] transition-colors">
                Nghệ thuật tối giản: Khi đôi bàn tay lên tiếng
              </h3>
              <p className="text-gray-400 text-xs uppercase tracking-widest">24 Tháng 04, 2026 — Bởi Admin</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}