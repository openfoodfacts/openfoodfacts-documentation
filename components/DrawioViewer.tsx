'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image'

interface DrawioViewerProps {
  src: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function DrawioViewer({ 
  src, 
  alt = "Draw.io diagram", 
  width = "100%", 
  height = "600px",
  className = ""
}: DrawioViewerProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [contentType, setContentType] = useState<'svg' | 'png' | 'fallback'>('fallback');
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const createFallbackContent = (src: string, theme: string | undefined, height: string | number) => {
    return `
      <div style="
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: center; 
        height: ${typeof height === 'number' ? height + 'px' : height}; 
        border: 2px dashed #ccc; 
        border-radius: 8px; 
        background: ${theme === 'dark' ? '#1a1a1a' : '#f9f9f9'};
        color: ${theme === 'dark' ? '#fff' : '#333'};
        padding: 20px;
        text-align: center;
      ">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" style="margin-bottom: 16px; opacity: 0.5;">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
        <h3 style="margin: 0 0 8px 0; font-size: 18px;">Draw.io Diagram</h3>
        <p style="margin: 0 0 16px 0; opacity: 0.7;">Interactive diagram viewer</p>
        <a 
          href="${src}" 
          download 
          style="
            background: #0066cc; 
            color: white; 
            padding: 8px 16px; 
            border-radius: 4px; 
            text-decoration: none; 
            font-size: 14px;
          "
        >
          Download Diagram
        </a>
        <p style="margin: 16px 0 0 0; font-size: 12px; opacity: 0.5;">
          Open with <a href="https://app.diagrams.net/" target="_blank" style="color: #0066cc;">diagrams.net</a>
        </p>
      </div>
    `;
  };

  useEffect(() => {
    async function loadDrawioFile() {
      try {
        setIsLoading(true);
        setError('');

        // First, try to load the .drawio.svg file if it exists
        const svgSrc = src.replace('.drawio', '.drawio.svg');
        try {
          const svgResponse = await fetch(svgSrc);
          if (svgResponse.ok) {
            let svgText = await svgResponse.text();
            
            // Apply theme-aware styling to SVG
            if (resolvedTheme === 'dark') {
              // Invert colors for dark theme
              svgText = svgText.replace(
                '<svg',
                '<svg style="filter: invert(1) hue-rotate(180deg);"'
              );
            }
            
            setContent(svgText);
            setContentType('svg');
            setIsLoading(false);
            return;
          }
        } catch {
          // SVG doesn't exist, try PNG
        }

        // Try to load a PNG version
        const pngSrc = src.replace('.drawio', '.png');
        try {
          const pngResponse = await fetch(pngSrc);
          if (pngResponse.ok) {
            setContent(pngSrc);
            setContentType('png');
            setIsLoading(false);
            return;
          }
        } catch {
          // PNG doesn't exist, show fallback
        }

        // Show fallback with download link
        setContent(createFallbackContent(src, resolvedTheme, height));
        setContentType('fallback');
        setIsLoading(false);

      } catch (err) {
        console.error('Error loading Draw.io diagram:', err);
        setError(err instanceof Error ? err.message : 'Failed to load diagram');
        setIsLoading(false);
      }
    }

    loadDrawioFile();
  }, [src, resolvedTheme, height]);

  if (isLoading) {
    return (
      <div 
        className={`flex items-center justify-center bg-muted rounded-lg ${className}`}
        style={{ height: typeof height === 'number' ? height + 'px' : height }}
      >
        <div className="text-muted-foreground">Loading diagram...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-destructive/10 border border-destructive/20 rounded-lg p-4 ${className}`}
        style={{ height: typeof height === 'number' ? height + 'px' : height }}
      >
        <div className="text-destructive font-medium">Failed to load diagram</div>
        <div className="text-sm text-muted-foreground mt-1">{error}</div>
        <a 
          href={src} 
          download 
          className="mt-3 text-sm text-primary hover:underline"
        >
          Download source file
        </a>
      </div>
    );
  }

  // Render based on content type
  if (contentType === 'svg' || contentType === 'fallback') {
    return (
      <div 
        ref={containerRef}
        className={`drawio-viewer rounded-lg overflow-hidden ${className}`}
        style={{ width, height }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  if (contentType === 'png') {
    return (
      <div className={`drawio-viewer rounded-lg overflow-hidden ${className}`} style={{ width, height }}>
        <Image 
          src={content} 
          alt={alt}
          className="w-full h-full object-contain"
          style={{ 
            background: resolvedTheme === 'dark' ? '#1a1a1a' : '#fff',
            filter: resolvedTheme === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none'
          }}
        />
      </div>
    );
  }

  return null;
}
