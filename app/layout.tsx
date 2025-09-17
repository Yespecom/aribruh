import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Suspense } from "react"
import { CartProvider } from "@/contexts/cart-context"

export const metadata: Metadata = {
  title: "Restaurant Ordering App",
  description: "Order food from our restaurant menu",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <CartProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </CartProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
