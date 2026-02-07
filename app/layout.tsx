import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Influencer Hub - Creator & Brand Collaboration Platform',
  description: 'Connect with brands, manage campaigns, and grow your influencer business. The all-in-one platform for creators.',
  generator: 'v0.app',
  keywords: ['influencer', 'creator', 'campaigns', 'collaboration', 'brands'],
  openGraph: {
    title: 'Influencer Hub - Creator & Brand Collaboration Platform',
    description: 'Connect with brands and manage your creator business',
    url: 'https://influencerhub.io',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#6D28D9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
