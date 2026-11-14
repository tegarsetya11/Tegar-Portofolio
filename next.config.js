/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'three-mesh-bvh': false,
    };
    return config;
  },
};

module.exports = nextConfig;
