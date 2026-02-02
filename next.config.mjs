/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 必须添加这一行，告诉 Next.js 生成静态网页
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
