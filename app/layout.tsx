import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react';
import './globals.css'

export const metadata: Metadata = {
  title: 'Emotion Network',
  description: 'Emotion Network is an interactive web-based art platform visualising anonymous emotions through a collective digital space.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon.png',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body 
        className="min-h-screen" 
        style={{
          background: 'radial-gradient(ellipse 50.00% 50.00% at 50.00% 50.00%, rgba(33.58, 45.81, 29.82, 0.64) 0%, rgba(23.56, 27.95, 22.46, 0.50) 100%), black'
        }}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
} 