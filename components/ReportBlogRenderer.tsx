/**
 * Blog-style renderer for infrastructure reports
 * Based on the zero-docs blog implementation
 */
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { getMDXComponents } from '@/mdx-components';

interface ReportPageData {
  title: string;
  description?: string;
  author?: string;
  mail?: string;
  date?: string;
  body: React.ComponentType<{ components?: any }>;
  toc: any[];
}

interface ReportBlogRendererProps {
  page: {
    data: ReportPageData;
  };
  markdownContent: string;
}

export function ReportBlogRenderer({ page, markdownContent }: ReportBlogRendererProps) {
  const { body: Mdx, toc } = page.data;
  
  return (
    <>
      <div
        className="container rounded-xl mt-12 py-12 md:px-8"
        style={{
          backgroundColor: 'black',
          backgroundImage: [
            'linear-gradient(140deg, hsla(274,94%,54%,0.3), transparent 50%)',
            'linear-gradient(to left top, hsla(260,90%,50%,0.8), transparent 50%)',
            'radial-gradient(circle at 100% 100%, hsla(240,100%,82%,1), hsla(240,40%,40%,1) 17%, hsla(240,40%,40%,0.5) 20%, transparent)',
          ].join(', '),
          backgroundBlendMode: 'difference, difference, normal',
        }}
      >
        <h1 className="mb-2 text-3xl font-bold text-white">
          {page.data.title}
        </h1>
        <p className="mb-4 text-white/80">{page.data.description}</p>
      </div>
      <article className="container flex flex-col px-0 py-8 lg:flex-row lg:px-4">
        <div className="prose min-w-0 flex-1 p-4">
          <InlineTOC items={toc} />
          <Mdx components={getMDXComponents()} />
        </div>
        <div className="flex flex-col gap-4 border-l p-4 text-sm lg:w-[250px]">
          <div>
            <p className="mb-1 text-fd-muted-foreground">Written by</p>
            <p className="font-medium">{page.data.author || 'Unknown Author'}</p>
          </div>
          <div>
            <p className="mb-1 text-sm text-fd-muted-foreground">Date</p>
            <p className="font-medium">
              {page.data.date ? new Date(page.data.date).toDateString() : 'Date not specified'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm text-fd-muted-foreground">Contact</p>
            <p className="font-medium text-xs break-all">{page.data.mail || ''}</p>
          </div>
        </div>
      </article>
    </>
  );
}
