import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
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
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="https://analytics.joysontech.com/script.js"
            data-website-id="e96686d6-a6ae-4d79-aea4-202f1afcb251"
            // NODE_ENV=production is baked into both the dev and prod
            // deployments (see Dockerfile), so it alone doesn't
            // distinguish real visitors from dev.joysonfernandes.com
            // traffic. data-domains is Umami's own hostname allowlist —
            // the script checks window.location.hostname client-side and
            // no-ops anywhere else, including dev/localhost.
            data-domains="joysonfernandes.com"
            strategy="afterInteractive"
          />
        )}
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
