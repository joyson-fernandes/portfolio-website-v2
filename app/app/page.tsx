
import Navigation from '@/components/navigation'
import Hero from '@/components/hero'
import About from '@/components/about'
import Skills from '@/components/skills'
import Projects from '@/components/projects'
import Experience from '@/components/experience'
import Certifications from '@/components/certifications'
import Footer from '@/components/footer'
import CertificationsAdmin from '@/components/certifications-admin'
import ExperienceAdmin from '@/components/experience-admin'
import ProjectsAdmin from '@/components/projects-admin'
import AboutAdmin from '@/components/about-admin'
import AdminWrapper from '@/components/admin-wrapper'

export default function Home() {
  return (
    <main className="relative">
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Certifications />
      <Footer />
      
      <AdminWrapper showInDevelopment={false}>
        <AboutAdmin />
        <CertificationsAdmin />
        <ExperienceAdmin />
        <ProjectsAdmin />
      </AdminWrapper>
    </main>
  )
}
