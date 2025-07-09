"use client";

import { Copy, Check } from "lucide-react";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { useCopyButton } from "fumadocs-ui/utils/use-copy-button";

interface DocsActionsProps {
  /** The slug of the current page */
  slug?: string[];
  /** Raw markdown content to copy */
  markdownContent?: string;
}

/**
 * Checks if a page is an API documentation page based on various patterns
 */
const isApiDocumentationPage = (slug?: string[]): boolean => {
  if (!slug) return false;

  // Known API documentation directory structures
  // These paths correspond to (api) route groups in the content structure
  const apiPathPatterns = [
    // Product-Opener API paths
    ["Product-Opener", "v2"],
    ["Product-Opener", "v3"],
    ["Product-Opener", "images"],
    ["Product-Opener", "knowledge-panels"],
    ["Product-Opener", "taxonomy"],
    ["Product-Opener", "products"],

    // Open-prices API paths
    ["Open-prices", "api"],
    ["Open-prices", "auth"],
    ["Open-prices", "challenges"],
    ["Open-prices", "locations"],
    ["Open-prices", "price-tags"],
    ["Open-prices", "prices"],
    ["Open-prices", "products"],
    ["Open-prices", "proofs"],
    ["Open-prices", "receipt-items"],
    ["Open-prices", "stats"],
    ["Open-prices", "status"],
    ["Open-prices", "users"],

    // Robotoff API paths
    ["Robotoff", "ann-search"],
    ["Robotoff", "annotation-management"],
    ["Robotoff", "batch-job"],
    ["Robotoff", "dataset"],
    ["Robotoff", "image-management"],
    ["Robotoff", "image-predictions"],
    ["Robotoff", "image-processing"],
    ["Robotoff", "insight-management"],
    ["Robotoff", "logo-management"],
    ["Robotoff", "predict"],
    ["Robotoff", "prediction-management"],
    ["Robotoff", "question-management"],
    ["Robotoff", "system"],
    ["Robotoff", "user-management"],
  ];

  // Check if the slug matches any known API path pattern
  const matchesApiPath = apiPathPatterns.some((pattern) => {
    if (slug.length < pattern.length) return false;
    return pattern.every((segment, index) => slug[index] === segment);
  });

  // Also check for common API filename patterns, but exclude documentation about APIs
  const lastSegment = slug[slug.length - 1];
  const hasApiFilename = lastSegment
    ? // HTTP method prefixes
      /^(get|post|patch|delete|put)-/.test(lastSegment) ||
      // HTTP method suffixes
      /_(get|post|patch|delete|put)$/.test(lastSegment) ||
      // API-specific naming patterns (but not documentation about APIs)
      /^(predict|extract|generate|create|update|delete|retrieve|list|destroy|partial_update|stats)/.test(
        lastSegment
      ) ||
      // Authentication patterns
      /_auth_|authentication/.test(lastSegment) ||
      // Knowledge panel patterns
      /knowledge_panel/.test(lastSegment) ||
      // Common API endpoint patterns
      /_(create|update|delete|retrieve|list|destroy|partial_update|stats)$/.test(
        lastSegment
      )
    : false;

  // Exclude documentation pages that are ABOUT APIs but are not API endpoints themselves
  const isDocumentationAboutApi = slug.some(
    (segment) =>
      segment === "api-docs" ||
      segment === "tutorials" ||
      segment === "getting-started" ||
      segment === "reference" ||
      segment === "advanced-features" ||
      segment === "data-access" ||
      segment === "meta-documentation"
  );

  // If it's documentation about APIs, it should show the copy/edit buttons
  if (isDocumentationAboutApi) {
    return false;
  }

  return matchesApiPath || hasApiFilename;
};

/**
 * Action buttons for documentation pages that provide copy markdown and GitHub edit functionality.
 * These buttons are automatically hidden on API documentation pages.
 *
 * Environment Variables:
 * - NEXT_PUBLIC_GITHUB_OWNER: GitHub repository owner/organization (default: 'openfoodfacts')
 * - NEXT_PUBLIC_GITHUB_REPO: GitHub repository name (default: 'dev-api-docs')
 * - NEXT_PUBLIC_GITHUB_BRANCH: GitHub branch name (default: 'main')
 * - NEXT_PUBLIC_CONTENT_PATH: Path to content directory (default: 'content/docs')
 */

export function DocsActions({ slug, markdownContent }: DocsActionsProps) {
  // Move hooks to the top to avoid conditional hook calls
  const [checked, onCopy] = useCopyButton(() => {
    if (!markdownContent) return;
    return navigator.clipboard.writeText(markdownContent);
  });

  if (isApiDocumentationPage(slug)) {
    return null;
  }

  const path = slug ? slug.join("/") : "index";

  // Get GitHub repository info from environment variables
  const githubOwner = process.env.NEXT_PUBLIC_GITHUB_OWNER || "jagjeevanak";
  const githubRepo =
    process.env.NEXT_PUBLIC_GITHUB_REPO || "openfoodfacts-documentation";
  const githubBranch = process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main";
  const contentPath = process.env.NEXT_PUBLIC_CONTENT_PATH || "content/docs";

  const githubUrl = `https://github.com/${githubOwner}/${githubRepo}/blob/${githubBranch}/${contentPath}/${path}.mdx`;
  const hasMarkdownContent =
    markdownContent && markdownContent.trim().length > 0;

  return (
    <div className="flex gap-1.5 mb-6 not-prose">
      <button
        onClick={onCopy}
        disabled={!hasMarkdownContent}
        className={buttonVariants({
          color: "secondary",
          size: "sm",
          className:
            "gap-1.5 [&_svg]:size-3.5 disabled:opacity-50 disabled:cursor-not-allowed",
        })}
        title={
          hasMarkdownContent
            ? "Copy Markdown"
            : "Markdown content not available"
        }
      >
        {checked ? <Check /> : <Copy />}
        {checked ? "Copied!" : "Copy Markdown"}
      </button>

      <a
        href={githubUrl}
        target="_blank"
        rel="noreferrer noopener"
        className={buttonVariants({
          color: "secondary",
          size: "sm",
          className: "gap-1.5 [&_svg]:size-3.5",
        })}
        title="Open in GitHub"
      >
        <svg
          fill="currentColor"
          role="img"
          viewBox="0 0 24 24"
          className="size-3.5"
        >
          <title>GitHub</title>
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        Open in GitHub
      </a>
    </div>
  );
}
