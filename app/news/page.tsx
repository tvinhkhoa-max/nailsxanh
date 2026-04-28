import BlogSection from '@/components/news/BlogSection';
import NewsSection from '@/components/news/NewsSection';

// Props mặc định của một Page trong Next.js
interface PageProps {
  searchParams: { [key: string]: string | null }
}


export default async function NewsPage({ searchParams }: PageProps) {

  const sParams = await searchParams; //  searchParams={sParams} 


  return (
    <>
    <NewsSection />

    <BlogSection/>
    </>
  );

}