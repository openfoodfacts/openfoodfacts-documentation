"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeAwareLogoProps {
  width: number;
  height: number;
  className?: string;
}

// Function to get the correct asset path for GitHub Pages
const getAssetPath = (path: string) => {
  // Check if we're in a GitHub Pages environment (production build)
  const isGitHubPages =
    typeof window !== "undefined" &&
    window.location.hostname === "openfoodfacts.github.io";

  if (isGitHubPages) {
    return `/documentation${path}`;
  }
  return path;
};

export default function ThemeAwareLogo({
  width,
  height,
  className = "",
}: ThemeAwareLogoProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render logo when component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width, height }} />;
  }

  // Use the appropriate logo based on the current theme - both SVG now
  const logoSrc =
    resolvedTheme === "dark"
      ? getAssetPath("/images/open_food_facts_logo_dark.svg")
      : getAssetPath("/images/Open_Food_Facts_logo.svg");

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <Image
        src={logoSrc}
        alt="Open Food Facts Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
        style={{
          maxHeight: "100%",
          objectPosition: "center center",
        }}
      />
    </div>
  );
}
