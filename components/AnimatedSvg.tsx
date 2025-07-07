"use client";

import { memo, useEffect, useState } from "react";

/**
 * Animated SVG component that preserves SVG animations and interactions
 * Used for displaying animated diagrams with preserved functionality
 */
const AnimatedSvg = memo(
  ({
    children,
    src,
    alt = "Animated SVG",
    ...props
  }: React.SVGProps<SVGSVGElement> & {
    children?: React.ReactNode;
    src?: string;
    alt?: string;
  }) => {
    const [svgContent, setSvgContent] = useState<string>("");

    useEffect(() => {
      if (src) {
        fetch(src)
          .then((response) => response.text())
          .then((content) => {
            // Extract the SVG content (everything inside <svg> tags)
            const svgMatch = content.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
            if (svgMatch) {
              const svgElement = svgMatch[0];
              // Extract viewBox and other attributes
              const viewBoxMatch = svgElement.match(/viewBox="([^"]*)"/);

              // Set the extracted content
              setSvgContent(svgMatch[1]); // Inner content only

              // Set viewBox if not already provided
              if (viewBoxMatch && !props.viewBox) {
                props.viewBox = viewBoxMatch[1];
              }
            }
          })
          .catch((error) => {
            console.error("Failed to load SVG:", error);
          });
      }
    }, [src, props]);

    if (src && !svgContent) {
      return (
        <div className="not-prose overflow-x-auto">
          <div className="animate-pulse bg-gray-200 rounded h-64 flex items-center justify-center">
            Loading diagram...
          </div>
        </div>
      );
    }

    return (
      <div className="not-prose overflow-x-auto">
        <svg {...props} role="img" aria-label={alt}>
          {src ? (
            <g dangerouslySetInnerHTML={{ __html: svgContent }} />
          ) : (
            children
          )}
        </svg>
      </div>
    );
  }
);

AnimatedSvg.displayName = "AnimatedSvg";

export default AnimatedSvg;
