import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ralhum Sports Admin Dashboard',
  description: 'Admin dashboard for managing Ralhum Sports',
  openGraph: {
    title: 'Ralhum Sports Admin Dashboard',
    description: 'Admin dashboard for managing Ralhum Sports',
    url: 'https://yourdomain.com/admin',
    siteName: 'Ralhum Sports',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Ralhum Sports Admin Dashboard',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
