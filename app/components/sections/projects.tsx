'use client'

import { ExternalLink, Github, BookOpen } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import TechBadge from '@/components/shared/tech-badge'
import { BlurFade } from '@/components/ui/magic/blur-fade'
import { CardHoverEffect } from '@/components/ui/aceternity/card-hover-effect'
import { useProjects } from '@/hooks/useProjects'

const HOMELAB_PROJECTS = [
  {
    title: 'LinkVolt',
    description:
      'URL shortener & link page SaaS — 6 Go microservices (CQRS) on a self-managed 4-node HA K8s cluster. Full GitOps via ArgoCD App-of-Apps, Gitea Actions CI/CD, Cilium CNI, Sealed Secrets, and hybrid failover to Fly.io.',
    technologies: ['Go', 'Kubernetes', 'ArgoCD', 'Cilium', 'PostgreSQL', 'SQS', 'Prometheus'],
    github: 'https://github.com/joyson-fernandes',
  },
  {
    title: 'Homelab Platform',
    description:
      'Production-grade 4-node HA Kubernetes cluster on VMware ESXi/vCenter. ArgoCD GitOps, Cilium CNI, kube-vip, Prometheus/Grafana/Loki observability, and hands-on exploration of Backstage, Crossplane, and Karpenter.',
    technologies: ['Kubernetes', 'ArgoCD', 'Cilium', 'Prometheus', 'Grafana', 'VMware'],
    github: 'https://github.com/joyson-fernandes',
  },
  {
    title: 'Portfolio v2',
    description:
      'This site — Next.js on K8s with interactive React Flow infrastructure diagram, Credly & Medium integrations, GitHub Actions CI/CD with PR preview deployments.',
    technologies: ['Next.js', 'TypeScript', 'React Flow', 'GitHub Actions', 'Kubernetes'],
    github: 'https://github.com/joyson-fernandes/portfolio-website-v2',
  },
]

export default function Projects() {
  const { combinedProjects, loading } = useProjects()
  const articles = (combinedProjects || [])
    .filter((p) => p.type === 'medium')
    .slice(0, 6)

  return (
    <SectionWrapper id="projects">
      <SectionHeading
        label="Projects"
        title="What I've Built"
        description="Homelab applications and technical articles on cloud infrastructure."
      />

      {/* Homelab Projects */}
      <div className="mb-16">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <span className="h-1 w-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
          Homelab Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOMELAB_PROJECTS.map((project, i) => (
            <BlurFade key={project.title} delay={0.1 + i * 0.1}>
              <CardHoverEffect>
                <div className="h-full rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-foreground">{project.title}</h4>
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((t) => (
                      <TechBadge key={t} name={t} />
                    ))}
                  </div>
                </div>
              </CardHoverEffect>
            </BlurFade>
          ))}
        </div>
      </div>

      {/* Technical Articles */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <span className="h-1 w-6 rounded-full bg-gradient-to-r from-violet-500 to-purple-500" />
          Technical Articles
        </h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-6 animate-pulse"
              >
                <div className="h-4 bg-muted rounded w-3/4 mb-3" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article, i) => (
              <BlurFade key={article.id} delay={0.1 + i * 0.08}>
                <a
                  href={article.mediumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block h-full"
                >
                  <div className="h-full rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex items-start justify-between mb-3">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h4>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {article.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {article.technologies.slice(0, 4).map((t) => (
                        <TechBadge key={t} name={t} />
                      ))}
                    </div>
                  </div>
                </a>
              </BlurFade>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            Articles loading from Medium...
          </p>
        )}
      </div>
    </SectionWrapper>
  )
}
