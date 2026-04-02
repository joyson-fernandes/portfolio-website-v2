import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { ThemeProvider } from '@/components/shared/theme-provider'

export const metadata: Metadata = {
  title: 'Joyson Fernandes — Platform & DevOps Engineer',
  description:
    'Platform Engineer and DevOps specialist focused on Kubernetes, K8s security, IaC with Terraform, cloud automation on AWS & Azure, GitHub Actions CI/CD, and AI-driven infrastructure.',
  keywords: [
    'Platform Engineer',
    'DevOps Engineer',
    'Kubernetes',
    'Kubernetes Security',
    'Terraform',
    'AWS',
    'Azure',
    'GitHub Actions',
    'Infrastructure as Code',
    'AI Automation',
    'GitOps',
    'ArgoCD',
  ],
  authors: [{ name: 'Joyson Fernandes' }],
  robots: 'index, follow',
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: 'Joyson Fernandes — Platform & DevOps Engineer',
    description:
      'Platform engineering, Kubernetes security, Terraform IaC, and AI-driven automation on AWS & Azure.',
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
