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