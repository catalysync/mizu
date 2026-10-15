import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  transpilePackages: ['@mizunagara/react', '@mizunagara/css', '@mizunagara/tokens'],
};

export default withMDX(nextConfig);
