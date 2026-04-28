import ServicesSection from '@/components/services/ServicePage';


// Props mặc định của một Page trong Next.js
interface PageProps {
  searchParams: { [key: string]: string | null }
}


export default async function ServicesPage({ searchParams }: PageProps) {

  const sParams = await searchParams; //  searchParams={sParams} 

  return <ServicesSection/>;
}