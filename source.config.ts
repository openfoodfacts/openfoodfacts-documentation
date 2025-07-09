import {
  defineDocs,
  defineConfig,
  frontmatterSchema,
} from "fumadocs-mdx/config";
import { z } from "zod";
import { remarkMermaid } from "./lib/remark-mermaid";

export const docs = defineDocs({
  dir: "content/docs",
});

// Reports collection with additional fields for blog-style rendering
export const reports = defineDocs({
  dir: "content/docs/Infra/reports",
  docs: {
    schema: frontmatterSchema.extend({
      author: z.string().optional(),
      mail: z.string().optional(),
      date: z.string().optional(),
    }),
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
    remarkPlugins: [remarkMermaid],
    rehypePlugins: [],
    rehypeCodeOptions: {
      themes: {
        light: "github-light",
        dark: "vesper",
      },
    },
  },
});
