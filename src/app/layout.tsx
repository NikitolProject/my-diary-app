import "@/styles/globals.css"
import { Metadata } from "next"

import { fontMono, fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import { Menu } from "@/components/menu"
import { StyleSwitcher } from "@/components/style-switcher"
import { ThemeProvider } from "@/components/theme-provider"

interface ExamplesLayoutProps {
  children: React.ReactNode
}

export default function MyApp({ children }: ExamplesLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-clip bg-black">
      <head />
      <body className="overflow-clip bg-transparent font-sans antialiased scrollbar-none">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="h-screen overflow-clip">
            <Menu />
            <div
              className={cn(
                "h-screen overflow-auto border-t bg-background pb-8",
                // "scrollbar-none"
                "scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md"
              )}
            >
              {children}
            </div>
          </div>
        </ThemeProvider>
        <StyleSwitcher />
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  icons: {
    shortcut: ["#"],
  },
}
