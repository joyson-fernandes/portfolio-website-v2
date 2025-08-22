
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AdminProvider } from '@/contexts/AdminContext'
import { ThemeProvider } from '@/components/theme-provider'
import AdminToggle from '@/components/admin-toggle'
import ProfilePictureAdmin from '@/components/profile-picture-admin'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Joyson Fernandes - Cloud DevOps Engineer',
  description: 'Professional portfolio of Joyson Fernandes, Cloud DevOps Engineer specializing in AWS, Azure, Terraform, Docker, and Kubernetes. Infrastructure automation and cloud architecture expert.',
  keywords: ['Cloud DevOps Engineer', 'AWS', 'Azure', 'Terraform', 'Docker', 'Kubernetes', 'Infrastructure Automation', 'Cloud Architecture'],
  authors: [{ name: 'Joyson Fernandes' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'Joyson Fernandes - Cloud DevOps Engineer',
    description: 'Professional portfolio showcasing cloud infrastructure expertise and DevOps solutions.',
    type: 'website',
    locale: 'en_US',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AdminProvider>
            {children}
            <AdminToggle />
            <ProfilePictureAdmin />
          </AdminProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
