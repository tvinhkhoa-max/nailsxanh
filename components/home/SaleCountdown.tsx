"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SaleCountdown() {
  // Logic đếm ngược đơn giản (ví dụ kết thúc sau 5 giờ)
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 45, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="w-full bg-gradient-to-r from-red-600 via-pink-600 to-amber-500 py-3 px-4 text-white shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tiêu đề ưu đãi */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <Flame className="w-6 h-6 text-amber-300 animate-pulse" />
          <div>
            <span className="font-bold tracking-wide uppercase bg-black/30 px-2 py-0.5 rounded text-xs mr-2">
              Flash Sale
            </span>
            <span className="font-medium text-sm md:text-base">
              Ưu đãi: Giảm <span className="font-extrabold text-amber-200">20%</span> khi đặt lịch hôm nay!
            </span>
          </div>
        </div>

        {/* Bộ đếm ngược & CTA */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <span className="text-white/80 text-xs hidden sm:inline">KẾT THÚC SAU:</span>
            <span className="bg-black/40 px-2 py-1 rounded font-mono text-amber-300">{formatNumber(timeLeft.hours)}</span>:
            <span className="bg-black/40 px-2 py-1 rounded font-mono text-amber-300">{formatNumber(timeLeft.minutes)}</span>:
            <span className="bg-black/40 px-2 py-1 rounded font-mono text-amber-300">{formatNumber(timeLeft.seconds)}</span>
          </div>

          <Link href="/try-on" passHref>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-pink-600 hover:bg-pink-50 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm flex items-center gap-1 transition-all"
            >
              Thử móng ngay <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}