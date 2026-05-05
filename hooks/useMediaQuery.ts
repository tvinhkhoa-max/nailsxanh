import { useState, useEffect } from 'react';

/**
 * Hook dùng để kiểm tra Media Query (Mobile/PC)
 * @param query Chuỗi query chuẩn CSS (Ví dụ: '(max-width: 768px)')
 * @returns boolean - true nếu khớp với query, false nếu không.
 */
export function useMediaQuery(query: string): boolean {
  // Khởi tạo là false để khớp với phía Server khi chưa Hydration xong
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Cập nhật giá trị ngay lần đầu khi component mount trên client
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Hàm lắng nghe sự thay đổi kích thước màn hình
    const listener = () => setMatches(media.matches);
    
    // Hỗ trợ cả trình duyệt cũ và mới
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [matches, query]);

  return matches;
}