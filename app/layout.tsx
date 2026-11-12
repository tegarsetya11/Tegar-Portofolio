import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tegar Setya Andiputra — Junior Technical Support & Web Specialist',
  description: 'Portofolio Tegar Setya Andiputra — Junior Technical Support, Network, dan Web Specialist dari SMK Negeri 1 Pracimantoro.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        </body>
    </html>
  )
}
