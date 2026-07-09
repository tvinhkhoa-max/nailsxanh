import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/cdn/:path*',
  //       destination: 'https://nailsxanh-app.onrender.com/cdn/:path*', 
  //     },
  //   ]
  // },
  /* config options here */
  // distDir: '.build',
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      // {
      //   protocol: 'http',
      //   hostname: '0.0.0.0',
      //   port: '3333', // Port của AdonisJS
      //   pathname: '/**', // Cho phép tất cả các đường dẫn ảnh
      // },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '3333', // Port của AdonisJS
      //   pathname: '/**', // Cho phép tất cả các đường dẫn ảnh
      // },
      {
        protocol: 'https',
        hostname: 'grqrkhinsmodinpufglv.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Nếu sau này bạn deploy lên server thật, hãy thêm domain đó vào đây
    ],
  },
  experimental: {
    serverActions: {
      // Đôi khi Next.js chỉ nhận domain, không nhận protocol
      allowedOrigins: [
        'localhost:3000',
        'localhost:3333',
        '127.0.0.1:3000',
        '127.0.0.1:3333',
        '172.25.251.227:3000',
        'nailsxanh.ddns.net',
        'http://nailsxanh.ddns.net',
        'https://nailsxanh.ddns.net',
      ],
    }
  },
  allowedDevOrigins: [
    'nailsxanh.ddns.net',
    'http://nailsxanh.ddns.net',
    'https://nailsxanh.ddns.net',
  ],
  turbopack: {},
};

export default nextConfig;
