import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  transpilePackages: ['@aspect/react', '@aspect/css', '@aspect/tokens'],
};

export default withMDX(nextConfig);
