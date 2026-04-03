# Portfolio Website — Claude Code Context

## Project

Personal portfolio website for Joyson Fernandes — Platform & DevOps Engineer.

**Live:** https://joysonfernandes.com
**Repo:** https://github.com/joyson-fernandes/portfolio-website-v2
**Stack:** Next.js 14, Tailwind CSS 3, TypeScript, Framer Motion 11, React Flow, Geist font, next-mdx-remote

## Infrastructure

- **K8s namespace:** `portfolio`
- **Image:** `registry.joysontech.com/library/portfolio-app`
- **Service:** LoadBalancer at `10.0.1.66:80`
- **Domain:** `joysonfernandes.com` via NPM (Nginx Proxy Manager) at `172.16.0.34`
- **ArgoCD:** managed as `portfolio` app, reads from `k8s/` directory, auto-sync enabled, GitHub webhook for instant sync
- **ArgoCD URL:** https://argocd.joysontech.com
- **Grafana URL:** https://grafana.joysontech.com (Public org with anonymous read-only access for portfolio embeds)
- **CI:** GitHub Actions with self-hosted runner on `10.0.1.40`
- **Registry:** Harbor at `registry.joysontech.com`

## CI Pipeline

- **Production (push to main):** GitHub Actions → Docker build → Trivy scan → push to Harbor → commit image tag to k8s/deployment.yaml `[skip ci]` → ArgoCD syncs via webhook
- **PR Preview:** GitHub Actions → Docker build → Trivy scan → push to Harbor → run preview container on runner at `http://10.0.1.40:<4000+PR#>` → auto-comment URL on PR → cleanup on PR close
- **CI needs `permissions: contents: write`** for the image tag commit step

## Build Notes

- **Must use Node 20+** — Node 18 causes ECONNRESET during npm install on the self-hosted runner
- **Dockerfile:** in `app/` directory, multi-stage build (Node 20 Alpine)
- **server.js path:** `app/server.js` (nested due to `outputFileTracingRoot: ../` in next.config.js)
- **Static/public paths in Dockerfile:** must copy to `./app/public` and `./app/.next/static` (not root), because standalone output nests under `app/`
- **Standalone output:** Next.js standalone mode

## Site Structure

### Main page (`/`) — 10 sections
Hero → Metrics → About → Skills → Projects → Experience → Certifications → GitHub Activity → Homelab CTA → Footer

### Homelab page (`/homelab`) — 8 sections
Homelab Hero (intro) → Infrastructure Diagram → Pipeline Animation → Live Grafana → Service Status → ADRs → Deploy Info → Footer

### Setup Guides (`/homelab/guides`)
MDX-based guides with frontmatter, category filters, syntax highlighting (rehype-pretty-code), TOC sidebar. Add new guides by creating `.mdx` files in `app/content/guides/`.

## File Structure

```
app/                        — Next.js application
  app/                      — Next.js app router
    page.tsx                — Main page (10 sections)
    layout.tsx              — Root layout (Geist font, dark-first theme)
    globals.css             — Dark-first design system, HSL tokens
    homelab/
      page.tsx              — Homelab page (infrastructure sections)
      layout.tsx            — Homelab metadata
      guides/
        page.tsx            — Guide listing with category filters
        filters.tsx         — Client-side filter component
        [slug]/page.tsx     — Individual guide renderer (MDX)
    api/
      status/route.ts       — Live service health checks (pings 7 K8s services)
      github/route.ts       — GitHub contribution data
      about/route.ts        — About section data
      experience/route.ts   — Experience data
      projects/route.ts     — Projects + Medium articles
      certifications/       — Credly integration
  components/
    sections/               — Page sections
      hero.tsx              — Animated hero with typing roles, Kubestronaut badge
      metrics.tsx           — Impact metrics strip (70% faster, 32% cost reduction, etc.)
      about.tsx             — Bento grid with animated counters
      infrastructure.tsx    — Interactive React Flow diagram (25 nodes, 26 edges)
      pipeline.tsx          — 8-step animated CI/CD pipeline visualization
      skills.tsx            — 8 skill category cards with moving borders
      grafana.tsx           — Live Grafana panel embeds (CPU, memory, network)
      status.tsx            — Real-time service health dashboard
      projects.tsx          — IDP, LinkVolt, Portfolio + Medium articles with Featured tags
      experience.tsx        — Animated alternating timeline (RHS, Airinmar, earlier)
      certifications.tsx    — Kubestronaut hero card + grouped Credly cert grid
      adrs.tsx              — 5 expandable Architecture Decision Records
      github-activity.tsx   — GitHub contribution heatmap + stats
      deploy-info.tsx       — "How This Site Is Deployed" meta section
      homelab-hero.tsx      — Homelab intro (enthusiast, stats)
      homelab-cta.tsx       — CTA card linking to /homelab from main page
      footer.tsx            — Social links + "Deployed on K8s" indicator
    layout/
      navigation.tsx        — Main nav (always visible, pill indicator, scroll spy)
      homelab-navigation.tsx — Homelab nav (← Portfolio link, Guides link)
      nav-actions.tsx       — Shared social links + theme toggle
      section-wrapper.tsx   — Framer Motion reveal wrapper
    infrastructure/         — React Flow diagram components (nodes/, edges/, legend)
    guides/                 — guide-card, guide-layout, guide-toc, mdx-components
    shared/                 — theme-provider, theme-toggle, section-heading, animated-counter, tech-badge
    ui/aceternity/          — background-beams, spotlight, text-generate, bento-grid, card-hover-effect, moving-border
    ui/magic/               — shimmer-button, blur-fade, particles
    ui/                     — Shadcn UI (button, badge, card, dialog, tabs, tooltip, etc.)
  content/
    guides/                 — MDX setup guide files (add new .mdx files here)
  data/
    about.json              — About section content (Kubestronaut, AWS Community Builder)
    experience.json         — Work experience (RHS, Airinmar, earlier roles)
    projects.json           — Medium articles + manual projects
    skills.json             — 8 skill categories matching CV
    infrastructure.json     — React Flow node/edge definitions
    adrs.json               — 5 Architecture Decision Records
  hooks/
    useScrollSpy.ts         — Parameterized scroll spy (MAIN_SECTIONS, HOMELAB_SECTIONS)
    useCertifications.ts    — Credly API integration
    useProjects.ts          — Medium article fetching
    useExperience.ts        — Experience data fetching
  lib/
    utils.ts                — cn() utility
    guides.ts               — MDX file reader (server-only, imports fs)
    guide-types.ts          — Guide interfaces + categories (client-safe)
    cache.ts                — Caching logic
    types.ts                — TypeScript interfaces
k8s/
  deployment.yaml           — K8s Deployment + Service + Namespace (image tag auto-updated by CI)
.github/workflows/
  ci.yaml                   — GitHub Actions: production deploy + PR preview + cleanup
```

## Grafana Setup (for portfolio embeds)

- **Public org (orgId=2)** with anonymous Viewer access — configured via Helm values in ArgoCD `kube-prometheus` app
- **Dashboard:** `portfolio-public` with 3 panels (CPU, Memory, Network)
- **Datasource:** Prometheus in Public org (uid: `ffhxbpzo0dipsc`)
- **Config:** `auth.anonymous.enabled=true`, `auth.anonymous.org_name=Public`, `security.allow_embedding=true`
- **NPM:** `proxy_hide_header X-Frame-Options;` in Advanced config for grafana.joysontech.com

## Status API Notes

- Pings 7 services from within the K8s cluster via internal DNS
- Vault health endpoint needs `?standbyok=true` (standby replicas return 429 otherwise)
- ArgoCD redirects HTTP→HTTPS; use `redirect: 'manual'` and treat < 400 as up
- Must use `cache: 'no-store'` and `export const dynamic = 'force-dynamic'` to bypass Next.js fetch caching

## Setup Guides (MDX)

- Add guides as `.mdx` files in `app/content/guides/`
- Frontmatter: title, slug, description, category, date, difficulty, duration, services, published
- Categories: kubernetes, networking, security, observability, gitops, storage, ci-cd
- `lib/guides.ts` reads files (server-only); `lib/guide-types.ts` has types (client-safe)
- Syntax highlighting via rehype-pretty-code + shiki

## Homelab Infrastructure

**Kubernetes Cluster:**
- 6-node K8s v1.31 cluster (3 CP, 3 workers) on VMware ESXi
- kube-vip HA (VIP 10.0.1.20), Cilium CNI, MetalLB, Longhorn storage

**Platform Services:**
- ArgoCD GitOps (22 apps, webhook-triggered sync)
- Harbor Registry + Trivy scanning
- HashiCorp Vault HA (3-replica Raft) + External Secrets Operator
- Kyverno policies, Authentik IdP
- Internal Developer Platform (self-service namespace provisioning)

**Observability:**
- Prometheus + Grafana + Loki + Tempo
- Alert rules → Email/Slack/Discord

**Applications:**
- LinkVolt — URL shortener SaaS (6 Go microservices, CQRS, hybrid failover to Fly.io)
- Portfolio — this website (Next.js on K8s)
- Internal Developer Platform — self-service K8s namespaces via ArgoCD ApplicationSet

## Professional Focus

Platform Engineer / DevOps Engineer with emphasis on:
- Kubernetes & K8s security (Kubestronaut — CKA, CKAD, CKS, KCNA, KCSA)
- Infrastructure as Code (Terraform, Bicep, Ansible)
- Cloud (AWS, Azure) — AWS Community Builder
- CI/CD (GitHub Actions, ArgoCD)
- AI-driven automation

## GitHub Profile

- **Repo:** https://github.com/joyson-fernandes/joyson-fernandes
- **Features:** Capsule render header, typing SVG, skill icons grid, Kubestronaut badges, all Credly certs (collapsible), streak stats, activity graph, snake contribution animation (GitHub Action), WakaTime, blog posts auto-update
- **Snake Action:** `.github/workflows/snake.yml` — runs daily, generates SVG on `output` branch
