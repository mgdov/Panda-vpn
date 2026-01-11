import type { Metadata } from "next"
import "./globals.css"
import { Montserrat } from "next/font/google"
import Script from "next/script"
import { Toaster } from "sonner"

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Panda VPN | Premium VPN Keys",
  description: "Secure VPN access with Panda VPN. Get instant access to premium VPN keys.",
  generator: 'v0.app',
  icons: {
    icon: '/panda-icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={montserrat.className}>
      <body className="font-montserrat">
        <Script src="https://code.jivo.ru/widget/phQRClDMlg" strategy="afterInteractive" />
        <Toaster position="top-center" richColors />
        <main className="min-h-screen bg-background text-foreground">{children}</main>
      </body>
    </html>
  )
}
