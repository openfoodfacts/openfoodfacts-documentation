import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { openapi } from "@/lib/source";
import { APIPage } from "fumadocs-openapi/ui";
import { Mermaid } from "./components/Mermaid";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    APIPage: (props) => <APIPage {...openapi.getAPIPageProps(props)} />,
    Mermaid,
    Accordion,
    Accordions,
    ...components,
  };
}
