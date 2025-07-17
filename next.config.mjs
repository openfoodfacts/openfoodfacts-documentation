import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages configuration
  basePath: process.env.GITHUB_ACTIONS ? '/openfoodfacts-documentation' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/openfoodfacts-documentation/' : '',
};

export default withMDX(config);
