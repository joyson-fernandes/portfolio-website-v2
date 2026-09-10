import { CERTS } from '@/data/learning/certs'
import CertCard from '@/components/learning/cert-card'
import Navigation from '@/components/layout/navigation'
import Footer from '@/components/sections/footer'

export const metadata = {
  title: 'Learning Hub | Joyson Fernandes',
  description: 'Practice for Cloud Native and GitOps certifications with interactive question simulators.',
}

export default function LearningPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-mono font-medium tracking-widest uppercase rounded-full border border-border text-muted-foreground">
            Cert Prep
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight gradient-text mb-4">
            Learning Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Practice for Cloud Native and GitOps certifications with interactive question simulators.
          </p>
          <p className="text-xs text-muted-foreground mt-4 max-w-lg mx-auto">
            These are original practice questions based on public documentation and course
            material — not real exam questions from the CNCF or Linux Foundation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {CERTS.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
