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
  // GitHub Pages serves from a subdirectory when not using a custom domain
  // Remove basePath and assetPrefix if you're using a custom domain
  ...(process.env.GITHUB_ACTIONS && {
    basePath: '/openfoodfacts-documentation',
    assetPrefix: '/openfoodfacts-documentation/',
  }),
};

export default withMDX(config);
