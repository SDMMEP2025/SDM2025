import type { Metadata } from 'next'
import { METADATA } from './metadata'
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google'
import { pretendard } from '@/theme/font'
import '@/styles/globals.css'
import { Layout } from '@/components/projects/Layout'

export const metadata: Metadata = {
  metadataBase: new URL(METADATA.url), 
  alternates: {
    canonical: METADATA.url,
  },
  title: {
    default: METADATA.title,
    template: METADATA.titleTemplate,
  },
  description: METADATA.description,
  keywords: METADATA.keywords,
  authors: METADATA.authors,
  creator: METADATA.authors[0].name,
  publisher: METADATA.authors[0].name,
  manifest: '/manifest.json',
  generator: METADATA.authors[0].name,
  applicationName: METADATA.name,
  appleWebApp: {
    capable: true,
    title: METADATA.title,
    // startUpImage: [],
  },
  category: 'webapp',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: METADATA.name,
    title: { default: METADATA.title, template: METADATA.titleTemplate },
    description: METADATA.description,
    locale: 'ko_KR',
    url: METADATA.url,
    images: [
      {
        url: '/og/og-image.png',
        width: 1200,
        height: 630,
        alt: 'New Formative',
        type: 'image/png',
      },
      {
        url: '/og/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'New Formative',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: METADATA.title,
    description: METADATA.description,
    images: ['/og/og-image.png'],
  },
  referrer: 'origin-when-cross-origin',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: '/icons/apple-icon.png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32' },
      { url: '/icons/apple-icon.png', sizes: '180x180' },
    ],
    apple: [
      { url: '/icons/apple-icon.png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32' },
      { url: '/icons/favicon-180x180.png', sizes: '180x180' },
      { url: '/icons/apple-icon.png', sizes: '180x180' },
    ],
    shortcut: ["/favicon.ico"],
    other: {
      rel: 'mask-icon',
      url: '/icons/favicon.svg',
      color: '#000000',
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko'>
      <body className={`${pretendard.variable} antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
