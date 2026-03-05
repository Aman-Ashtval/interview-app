"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      value={{ light: "light", dark: "dark" }}
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="prepify-theme"
    >
      {children}
    </NextThemesProvider>
  );
}