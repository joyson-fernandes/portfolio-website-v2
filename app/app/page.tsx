import Navigation from '@/components/layout/navigation'
import Hero from '@/components/sections/hero'
import Metrics from '@/components/sections/metrics'
import About from '@/components/sections/about'
import Infrastructure from '@/components/sections/infrastructure'
import Pipeline from '@/components/sections/pipeline'
import Skills from '@/components/sections/skills'
import Projects from '@/components/sections/projects'
import Terminal from '@/components/sections/terminal'
import Experience from '@/components/sections/experience'
import Certifications from '@/components/sections/certifications'
import Footer from '@/components/sections/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Metrics />
      <About />
      <Infrastructure />
      <Pipeline />
      <Skills />
      <Projects />
      <Terminal />
      <Experience />
      <Certifications />
      <Footer />
    </main>
  )
}
