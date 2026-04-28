import CollectionsClient from '@/components/collections/CollectionsClient';
import FloatingContact from '@/components/ui/FloatingContact';
import AIQuizSection from '@/components/home/AIQuizSection';

// Props mặc định của một Page trong Next.js
interface PageProps {
  searchParams: { [key: string]: string | null }
}

export default async function CollectionsPage({ searchParams }: PageProps) {

  const sParams = await searchParams;

  return<CollectionsClient searchParams={sParams} />;
}