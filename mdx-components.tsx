import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { openapi } from "@/lib/source";
import { APIPage } from "fumadocs-openapi/ui";
import { Mermaid } from "./components/Mermaid";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage: (props) => <APIPage {...openapi.getAPIPageProps(props)} />,
    ...components,
    code: ({ className, children, ...props }) => {
      if (className === "mermaid") {
        return <Mermaid chart={String(children)} />;
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };
}
