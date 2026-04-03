import Navigation from '@/components/layout/navigation'
import Hero from '@/components/sections/hero'
import Metrics from '@/components/sections/metrics'
import About from '@/components/sections/about'
import Infrastructure from '@/components/sections/infrastructure'
import Pipeline from '@/components/sections/pipeline'
import Skills from '@/components/sections/skills'
import Grafana from '@/components/sections/grafana'
import Status from '@/components/sections/status'
import Projects from '@/components/sections/projects'
import Experience from '@/components/sections/experience'
import Certifications from '@/components/sections/certifications'
import ADRs from '@/components/sections/adrs'
import GitHubActivity from '@/components/sections/github-activity'
import DeployInfo from '@/components/sections/deploy-info'
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
      <Grafana />
      <Status />
      <Projects />
      <Experience />
      <Certifications />
      <ADRs />
      <GitHubActivity />
      <DeployInfo />
      <Footer />
    </main>
  )
}
