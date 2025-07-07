import { source, reportsSource } from '@/lib/source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { DocsActions } from '@/components/DocsActions';
import { ReportBlogRenderer } from '@/components/ReportBlogRenderer';
import { readFile } from 'fs/promises';
import { join } from 'path';

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  
  // Check if this is a report page (under Infra/reports)
  const isReportPage = params.slug && 
    params.slug.length >= 3 && 
    params.slug[0] === 'Infra' && 
    params.slug[1] === 'reports';

  if (isReportPage && params.slug) {
    // Use reports source for blog-style rendering
    const reportSlug = params.slug.slice(2); // Remove 'Infra/reports' prefix
    const reportPage = reportsSource.getPage(reportSlug);
    
    if (!reportPage) notFound();

    let markdownContent = '';
    // Try to read the report markdown file
    const reportPath = params.slug.join('/');
    const possiblePaths = [
      join(process.cwd(), 'content/docs', `${reportPath}.mdx`),
      join(process.cwd(), 'content/docs', reportPath, 'index.mdx'),
    ];

    for (const filePath of possiblePaths) {
      try {
        markdownContent = await readFile(filePath, 'utf-8');
        break;
      } catch {
        // Continue to next path
      }
    }

    return <ReportBlogRenderer page={reportPage as any} markdownContent={markdownContent} />;
  }

  // Regular docs page handling
  const page = source.getPage(params.slug);
  if (!page) notFound();
  
  const MDX = page.data.body;

  let markdownContent = '';
  
  // Skip reading content for API documentation pages (auto-generated files)
  const isApiPage = params.slug?.some(segment => 
    segment === 'api' || 
    segment.includes('api') || 
    segment.includes('(api)') ||
    segment.startsWith('get-') ||
    segment.startsWith('post-') ||
    segment.startsWith('patch-') ||
    segment.startsWith('delete-') ||
    segment.startsWith('put-')
  ) || 
  // Also check if the full path would be in an (api) directory
  (params.slug && params.slug.join('/').includes('(api)'));

  if (!isApiPage) {
    const slugPath = params.slug?.join('/') || 'index';
    
    const generatePaths = (basePath: string) => {
      const paths = [
        // Direct file path
        join(process.cwd(), 'content/docs', `${basePath}.mdx`),
        // Folder with index.mdx  
        join(process.cwd(), 'content/docs', basePath, 'index.mdx'),
      ];
      
      // Handle fumadocs (docs) folder convention
      if (params.slug && params.slug.length > 0) {
        // Try injecting (docs) after the first segment
        if (params.slug.length >= 1) {
          const pathWithDocs = [params.slug[0], '(docs)', ...params.slug.slice(1)].join('/');
          paths.push(
            join(process.cwd(), 'content/docs', `${pathWithDocs}.mdx`),
            join(process.cwd(), 'content/docs', pathWithDocs, 'index.mdx')
          );
        }
        
        // Try injecting (docs) after the second segment
        if (params.slug.length >= 2) {
          const pathWithDocs = [params.slug[0], params.slug[1], '(docs)', ...params.slug.slice(2)].join('/');
          paths.push(
            join(process.cwd(), 'content/docs', `${pathWithDocs}.mdx`),
            join(process.cwd(), 'content/docs', pathWithDocs, 'index.mdx')
          );
        }
      }
      
      return paths;
    };
    
    const possiblePaths = generatePaths(slugPath);
    
    // Add root index for homepage
    if (!params.slug || params.slug.length === 0) {
      possiblePaths.push(join(process.cwd(), 'content/docs', 'index.mdx'));
    }

    for (const filePath of possiblePaths) {
      try {
        markdownContent = await readFile(filePath, 'utf-8');
        break; // Exit loop on success
      } catch {
        // Continue to next path
      }
    }
  }

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsActions slug={params.slug} markdownContent={markdownContent} />
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  // Combine regular docs params with reports params
  const docsParams = source.generateParams();
  const reportsParams = reportsSource.generateParams().map(param => ({
    slug: ['Infra', 'reports', ...param.slug]
  }));
  
  return [...docsParams, ...reportsParams];
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
