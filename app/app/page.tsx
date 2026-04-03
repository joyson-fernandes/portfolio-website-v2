import Navigation from '@/components/layout/navigation'
import Hero from '@/components/sections/hero'
import Metrics from '@/components/sections/metrics'
import About from '@/components/sections/about'
import Skills from '@/components/sections/skills'
import HomelabCTA from '@/components/sections/homelab-cta'
import Projects from '@/components/sections/projects'
import Experience from '@/components/sections/experience'
import Certifications from '@/components/sections/certifications'
import GitHubActivity from '@/components/sections/github-activity'
import Footer from '@/components/sections/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Metrics />
      <About />
      <Skills />
      <HomelabCTA />
      <Projects />
      <Experience />
      <Certifications />
      <GitHubActivity />
      <Footer />
    </main>
  )
}
