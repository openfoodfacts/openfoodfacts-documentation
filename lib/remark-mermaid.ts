import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Code, Parent } from "mdast";

/**
 * Remark plugin to convert mermaid code blocks to <Mermaid> components.
 *
 * This plugin automatically transforms markdown code blocks with the 'mermaid' language
 * into <Mermaid chart="..." /> JSX components, allowing seamless integration of Mermaid
 * diagrams in MDX files without manual component usage.
 */
export const remarkMermaid: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "code", (node: Code, index, parent) => {
      if (node.lang === "mermaid") {
        // Create MDX JSX element for <Mermaid chart="..." />
        const mermaidElement = {
          type: "mdxJsxFlowElement" as const,
          name: "Mermaid",
          attributes: [
            {
              type: "mdxJsxAttribute" as const,
              name: "chart",
              value: node.value,
            },
          ],
          children: [],
        };

        // Replace the code block with the Mermaid component
        if (parent && typeof index === "number") {
          (parent as Parent).children[index] =
            mermaidElement as unknown as Code;
        }
      }
    });
  };
};
