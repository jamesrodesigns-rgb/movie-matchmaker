/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  eslint: {
    dirs: ['src', 'components'],
  },
}

export default nextConfig