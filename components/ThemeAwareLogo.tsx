"use client";

import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ThemeAwareLogoProps {
    width: number;
    height: number;
    className?: string;
}

export default function ThemeAwareLogo({ width, height, className = '' }: ThemeAwareLogoProps) {
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
    const logoSrc = resolvedTheme === 'dark'
        ? '/images/open_food_facts_logo_dark.svg'
        : '/images/Open_Food_Facts_logo.svg';

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
                    maxHeight: '100%',
                    objectPosition: 'center center',
                }}
            />
        </div>
    );
}