'use client'

import { ThemeProvider } from "@/components/providers";
import { ReactNode } from "react";

export function ThemeWrepper({children}: {children: ReactNode}) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    )
}