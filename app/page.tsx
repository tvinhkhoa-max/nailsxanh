import HeroSlide from '@/components/home/HeroSlide';
import AIQuizSection from '@/components/home/AIQuizSection';
// import ARFeature from '@/components/home/ARFeature';
import CollectionMasonry from '@/components/home/CollectionMasonry'
import NailQuiz from '@/components/home/NailQuiz'
import Location from '@/components/ui/Location'
import FloatingContact from '@/components/ui/FloatingContact'
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSlide />
      
      {/* Section giới thiệu bộ sưu tập */}
      <section className="py-24 px-6 md:px-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-charcoal">Bộ Sưu Tập Độc Bản</h2>
            <p className="text-gray-500 font-light tracking-widest uppercase text-sm">Nơi nghệ thuật gặp gỡ cá tính</p>
          </div>
          <CollectionMasonry />
        </div>
      </section>

      <NailQuiz />

      <Location />

      <AIQuizSection />

      <FloatingContact />
      
      {/* <ARFeature /> */}

      <Footer />
    </main>
  );
}