"use client"

import { useEffect, useState, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import ServicesSection from '@/components/services/ServicePage';
import { useBooking } from '@/src/context/BookingContext';

// Props mặc định của một Page trong Next.js
interface PageProps {
  // searchParams: { [key: string]: string | null }
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default function ServicesPage({ searchParams }: PageProps) {
  // 1. Giải nén searchParams (Next.js 15+ yêu cầu giải nén Promise)
  const params = use(searchParams);
  const [loading, setLoading] = useState(true);
  const { services } = useBooking();

  // const fetchData = async () => {
    // const { data: services, isLoading } = useQuery({
    //   queryKey: ['nail-services'], // Cùng key với BookingModal để dùng chung cache
    //   queryFn: async () => {
    //     const servicePath = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/services`;
    //     const res = await fetch(servicePath);
    //     const resultService = await res.json();
    //     return resultService?.data || [];
    //   },
    //   staleTime: 1000 * 60 * 10, // Giữ dữ liệu sạch trong 10 phút
    // });
  //   setServices(services);
  // }

  useEffect(() => {
    // fetchData();
    // Cuộn lên đầu khi sang trang mới
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <ServicesSection services={services}/>
    </>
  );
}