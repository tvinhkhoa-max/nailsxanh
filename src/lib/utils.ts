export const getFullStaticImageUrl = (path: string | null) => {
  if (!path) return '/placeholder-nail.png'; // Ảnh mặc định nếu data trống

  // Nếu path đã là link tuyệt đối (http...) thì trả về luôn
  if (path.startsWith('http')) return path;

  const baseUrl = (process.env?.NEXT_PUBLIC_ENV != 'development' ? process.env.NEXT_PUBLIC_STATIC_SUPABASE_URL : process.env.NEXT_PUBLIC_STATIC_LOCAL_URL);

  // Đảm bảo không bị dư dấu / giữa baseUrl và path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};

export const getFullCDNUrl = (path: string | null) => {
  if (!path) return ;

  // Nếu path đã là link tuyệt đối (http...) thì trả về luôn
  if (path.startsWith('http')) return path;

  const baseUrl = (process.env?.NEXT_PUBLIC_ENV != 'development' ? process.env.NEXT_PUBLIC_CDN_URL : process.env.NEXT_PUBLIC_CDN_LOCAL_URL);

  // Đảm bảo không bị dư dấu / giữa baseUrl và path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${cleanPath}`;
};

export const handleContactFanpage = () => {
  const pageId = "101571052030734"; // Thay bằng ID Fanpage của bạn
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