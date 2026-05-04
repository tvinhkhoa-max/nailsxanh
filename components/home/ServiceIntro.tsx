// components/home/ServiceIntro.tsx
const services = [
  { title: 'Thiết kế độc bản', desc: 'Mỗi bộ móng là một tác phẩm riêng biệt.' },
  { title: 'Organic Care', desc: 'Sử dụng sơn và dưỡng chất thuần chay.' },
  { title: 'Công nghệ AI', desc: 'Gợi ý mẫu móng theo trang phục & sự kiện.' }
];

export default function ServiceIntro() {
  return (
    <section className="py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-16">
        {services.map((s, i) => (
          <div key={i} className="text-center px-4">
            <div className="text-[#5E7A5E] mb-6 text-2xl font-serif">0{i+1}</div>
            <h4 className="text-lg font-serif mb-3 italic">{s.title}</h4>
            <p className="text-gray-500 text-sm leading-relaxed font-light">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}