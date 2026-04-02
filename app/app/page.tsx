import Navigation from '@/components/layout/navigation'
import Hero from '@/components/sections/hero'
import About from '@/components/sections/about'
import Infrastructure from '@/components/sections/infrastructure'
import Skills from '@/components/sections/skills'
import Projects from '@/components/sections/projects'
import Experience from '@/components/sections/experience'
import Certifications from '@/components/sections/certifications'
import Footer from '@/components/sections/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Infrastructure />
      <Skills />
      <Projects />
      <Experience />
      <Certifications />
      <Footer />
    </main>
  )
}
