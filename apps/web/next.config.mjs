/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/f/disabled',
        destination: '/endpoint?type=disabled'
      },
      {
        source: '/f/thanks-you',
        destination: '/endpoint?type=thanks-you'
      },
      {
        source: '/f/not-found',
        destination: '/endpoint?type=not-found'
      },
      {
        source: '/f/bad-request',
        destination: '/endpoint?type=bad-request'
      }
    ];
  }
};

export default nextConfig;
