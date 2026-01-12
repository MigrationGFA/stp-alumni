import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com', // Replace with your specific CDN hostname
        port: '',
        pathname: '/**', // Allows all paths under this domain
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Replace with your specific CDN hostname
        port: '',
        pathname: '/**', // Allows all paths under this domain
      },
    ],
  },
};

export default withNextIntl(nextConfig);