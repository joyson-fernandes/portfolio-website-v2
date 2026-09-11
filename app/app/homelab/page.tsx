import HomelabNavigation from '@/components/layout/homelab-navigation'
import HomelabHero from '@/components/sections/homelab-hero'
import Infrastructure from '@/components/sections/infrastructure'
import Pipeline from '@/components/sections/pipeline'
import ADRs from '@/components/sections/adrs'
import DeployInfo from '@/components/sections/deploy-info'
import Footer from '@/components/sections/footer'

export default function HomelabPage() {
  return (
    <main className="min-h-screen">
      <HomelabNavigation />
      <HomelabHero />
      <Infrastructure />
      <Pipeline />
      <ADRs />
      <DeployInfo />
      <Footer />
    </main>
  )
}
