import type React from "react"
import { Inter, Playfair_Display } from "next/font/google"
import { AppProvider } from "@/contexts/app-context"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationToast } from "@/components/notification-toast"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <head>
        <title>KrishiChakra - Revolutionizing Indian Agriculture</title>
        <meta name="description" content="AI-powered crop rotation guidance for modern Indian farmers" />
      </head>
      <body className="font-sans bg-background text-foreground">
        <AppProvider>
          <AuthProvider>
            {children}
            <NotificationToast />
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
