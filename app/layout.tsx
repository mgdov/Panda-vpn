import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap&subset=cyrillic" rel="stylesheet" />
      </head>
      <body className="font-montserrat">
        <main className="min-h-screen bg-background text-foreground">{children}</main>
      </body>
    </html>
  )
}
