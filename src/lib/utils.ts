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
  const pageId = "101571052030734";
  const pageUsername = "nails.xanh";
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    const messengerAppUrl = `fb-messenger://user-thread/${pageId}`;
    const messengerWebUrl = `https://m.me/${pageUsername}`;
    
    // 1. Cố gắng mở App
    window.location.href = messengerAppUrl;

    // 2. Thiết lập một Timer để chuyển sang Web nếu không mở được App
    const fallbackTimer = setTimeout(() => {
      window.location.href = messengerWebUrl;
    }, 3000); // Tăng lên 1.5s để đủ thời gian cho App khởi động

    // 3. Lắng nghe nếu trình duyệt bị đẩy xuống chạy ngầm (App đã mở thành công)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Nếu trình duyệt đã ẩn đi, nghĩa là App đã mở -> Hủy lệnh chuyển web
        clearTimeout(fallbackTimer);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  } else {
    window.open(`https://www.facebook.com/${pageUsername}`, '_blank');
  }
};