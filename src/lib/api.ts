// src/lib/api.ts

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error('Đã xảy ra lỗi khi tải dữ liệu.');
    throw error;
  }

  return res.json();
};