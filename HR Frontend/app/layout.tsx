import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HR Maturity App',
  description: 'A simple HR Maturity App',
  generator: 'v0.dev',
  // icons: { 
  //   icon: '/favicon.ico',
  //   shortcut: '/favicon.ico',
  //   apple: '/apple-touch-icon.png',
  // },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
