import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: '.build',
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333', // Port của AdonisJS
        pathname: '/**', // Cho phép tất cả các đường dẫn ảnh
      },
      // Nếu sau này bạn deploy lên server thật, hãy thêm domain đó vào đây
    ],
  },
  experimental: {
    serverActions: {
      // Đôi khi Next.js chỉ nhận domain, không nhận protocol
      allowedOrigins: ['localhost:3000', 'localhost:3333', '127.0.0.1:3000', '127.0.0.1:3333']
    }
  }
};

export default nextConfig;
