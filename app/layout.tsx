import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["cyrillic"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Panda VPN | Premium VPN Keys",
  description: "Secure VPN access with Panda VPN. Get instant access to premium VPN keys.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={montserrat.className}>
        <main className="min-h-screen bg-background text-foreground">{children}</main>
      </body>
    </html>
  )
}
