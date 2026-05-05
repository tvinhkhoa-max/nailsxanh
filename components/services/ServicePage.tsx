// components/services/ServicePage.tsx

import parse from 'html-react-parser';
import { useBooking } from '@/src/context/BookingContext'; // Import hook

// const serviceCategories: any[] = [
  // {
  //   title: "Nghệ thuật Nail",
  //   items: [
  //     { name: "Sơn Gel Hàn Quốc", price: "150k", time: "45p", desc: "Bền màu trên 4 tuần với hơn 500 màu trend." },
  //     { name: "Đắp móng úp cao cấp", price: "350k", time: "90p", desc: "Tạo form móng tự nhiên, không gây hại móng thật." },
  //     { name: "Vẽ Art thủ công", price: "Từ 50k", time: "20p", desc: "Họa tiết thiết kế riêng bởi các nghệ nhân." },
  //   ]
  // },
  // {
  //   title: "Dưỡng & Spa",
  //   items: [
  //     { name: "Ngâm thảo dược & Chà gót", price: "200k", time: "60p", desc: "Tẩy tế bào chết bằng muối hồng Himalaya." },
  //     { name: "Combo Relax Xanh", price: "450k", time: "120p", desc: "Gồm làm móng, massage tinh dầu và đắp mặt nạ." },
  //   ]
  // }
// ];

const serviceCategories: any[] = [
  { id: 'combo', title: "TRẢI NGHIỆM CHÍNH", items: [] },
  { id: 'nail_art', title: "NGHỆ THUẬT NAIL", items: []},
  { id: 'health_spa', title: "CHĂM SÓC & SPA", items: [] },
];

interface Props {
  services: any[]
}

export default function ServicesSection({ services }: Props) {
  const { openBooking } = useBooking();

  // 1. Kiểm tra nếu services chưa có dữ liệu (undefined hoặc null)
  if (!services || !Array.isArray(services)) {
    return <div className="p-10 text-center">Đang chuẩn bị dữ liệu dịch vụ...</div>;
  }

  serviceCategories.map((cat: any) => {
    cat.items = services.filter(item => item.type == cat.id)
  })

  return (
    <div className="bg-[#F9FBF9] min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-20 text-center">
          <h1 className="text-5xl font-serif text-[#2D3A2D] mb-6">Dịch vụ <span className="italic">Nổi bật</span></h1>
          <p className="text-gray-500 max-w-xl mx-auto">Mỗi quy trình tại NailsXanh đều đi kèm với sự chăm sóc tận tâm và các sản phẩm thuần chay an toàn cho sức khỏe.</p>
        </div>

        {serviceCategories.map((cat, idx) => (
          <div key={idx} className="mb-16">
            <h2 className="text-2xl font-serif text-[#5E7A5E] border-b border-[#E8F1E8] pb-4 mb-8 uppercase tracking-widest text-sm font-bold">
              {cat.title}
            </h2>
            <div className="grid gap-6">
              {cat.items.map((item: any, i: number) => (
                <div key={i} className="group flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white rounded-[32px] border border-transparent hover:border-[#5E7A5E]/20 hover:shadow-xl transition-all">
                  <div className="max-w-md">
                    <h3 className="text-xl font-bold text-[#2D3A2D] mb-2">{item.name}</h3>
                    <div className="text-sm text-gray-500">{item.desc && parse(item.desc)}</div>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-serif text-[#5E7A5E] font-bold">{item.price}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{item.time}</p>
                    </div>
                    <button className="bg-[#5E7A5E] text-white px-6 py-3 rounded-full text-xs font-bold hover:bg-[#2D3A2D] transition-colors"
                      onClick={() => openBooking(item.id)} >
                      CHỌN
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}