import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/shared/theme-provider'

export const metadata: Metadata = {
  title: 'Joyson Fernandes — Cloud DevOps Engineer',
  description:
    'Cloud DevOps Engineer building production-grade infrastructure. Kubernetes, GitOps, observability, and infrastructure automation on a 6-node homelab cluster.',
  keywords: [
    'Cloud DevOps Engineer',
    'Kubernetes',
    'GitOps',
    'ArgoCD',
    'Terraform',
    'Docker',
    'Infrastructure Automation',
    'Homelab',
  ],
  authors: [{ name: 'Joyson Fernandes' }],
  robots: 'index, follow',
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: 'Joyson Fernandes — Cloud DevOps Engineer',
    description:
      'Production-grade homelab infrastructure. Kubernetes, GitOps, observability, and more.',
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
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
