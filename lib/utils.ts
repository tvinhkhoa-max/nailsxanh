import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const handleContactFanpage = () => {
  const pageId = "399429115584397"; // Thay bằng ID Fanpage của bạn
  const pageUsername = "nails.xanh"; // Thay bằng username (ví dụ: NailsXanh)

  // Kiểm tra nếu là thiết bị di động (iOS/Android)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    // Mở trực tiếp ứng dụng Messenger bằng Deep Link
    // Cấu trúc: fb-messenger://user-thread/{page_id}
    window.location.href = `fb-messenger://user-thread/${pageId}`;
    
    // Fallback: Nếu không có app Messenger, sau 500ms chuyển hướng đến link web
    setTimeout(() => {
      window.location.href = `https://m.me/${pageUsername}`;
    }, 500);
  } else {
    // Trên PC: Mở trang Facebook Fanpage
    window.open(`https://www.facebook.com/${pageUsername}`, '_blank');
  }
};