# Portfolio Website — Claude Code Context

## Project

Personal portfolio website for Joyson Fernandes — Cloud/DevOps Engineer.

**Live:** https://joysonfernandes.com
**Repo:** https://github.com/joyson-fernandes/portfolio-website-v2
**Stack:** Next.js, Tailwind CSS, Prisma, TypeScript

## Infrastructure

- **K8s namespace:** `portfolio`
- **Image:** `registry.joysontech.com/library/portfolio-app`
- **Service:** LoadBalancer at `10.0.1.66:80`
- **Domain:** `joysonfernandes.com` via NPM (Nginx Proxy Manager)
- **ArgoCD:** managed as `portfolio` app, reads from `k8s/` directory
- **CI:** GitHub Actions with self-hosted runner on `10.0.1.40`
- **Registry:** Harbor at `registry.joysontech.com`

## CI Pipeline

Push to `main` → GitHub Actions → Docker build → Trivy scan → push to Harbor → kubectl deploy

## Build Notes

- **Must use Node 20+** — Node 18 causes ECONNRESET during Prisma engine download on the self-hosted runner
- **Dockerfile:** in `app/` directory
- **server.js path:** `app/server.js` (nested due to `outputFileTracingRoot: ../` in next.config.js)
- **Standalone output:** Next.js standalone mode, distroless-like Alpine image

## File Structure

```
app/                  — Next.js application
  data/
    about.json        — About me section content
    experience.json   — Work experience
    projects.json     — Projects showcase
  components/         — React components
  app/                — Next.js app router pages
  public/             — Static assets
  Dockerfile          — Multi-stage build (Node 20 Alpine)
k8s/
  deployment.yaml     — K8s Deployment + Service + Namespace
.github/workflows/
  ci.yaml             — GitHub Actions CI pipeline
```

## Homelab Infrastructure (for portfolio showcase)

The portfolio should showcase the full homelab platform that powers it:

**Kubernetes Cluster:**
- 6-node K8s v1.31 cluster (3 control planes, 3 workers) on VMware ESXi
- kube-vip HA for API server failover (VIP 10.0.1.20)
- Cilium CNI, MetalLB for LoadBalancer services
- Longhorn distributed block storage (2 replicas per PVC)

**GitOps & CI/CD:**
- GitHub Actions CI with self-hosted runner
- Trivy container image scanning before push
- Harbor private container registry with Trivy scanning
- ArgoCD GitOps — 22 apps, all Synced & Healthy
- Multi-environment: dev (auto), staging (RC tag), production (PR merge)

**Observability:**
- Prometheus + Grafana dashboards (Node Resources, ESXi Hosts)
- Loki log aggregation + Promtail
- Grafana Tempo distributed tracing (OTLP)
- Alert rules: CPU/memory/disk on K8s nodes + ESXi hosts → Email/Slack/Discord
- VMware vCenter monitoring via vmware_exporter

**Backup & DR:**
- Velero cluster backup to TrueNAS MinIO (daily, 30-day retention)
- pgBackRest PostgreSQL PITR (WAL archiving, < 5 min RPO)
- Databasus logical backup on TrueNAS
- Longhorn volume snapshots + S3 backup

**Security:**
- HashiCorp Vault HA (3-replica Raft) for secrets management
- External Secrets Operator syncs Vault → K8s Secrets
- Kyverno policies: resource limits, required labels, registry restriction
- Authentik identity provider

**Platform:**
- Internal Developer Platform with Kyverno + ApplicationSet
- Harbor container registry with Trivy vulnerability scanning
- Nginx Proxy Manager for SSL/reverse proxy
- TrueNAS SCALE for backup storage (MinIO, Databasus, pgAdmin)

**Applications:**
- Linkvolt — link-in-bio platform (7 Go microservices, CQRS, JetStream)
- Weather App — demo Go app deployed via GitHub Actions
- Portfolio — this website (Next.js on K8s)

## Planned: Full Website Overhaul

User wants a complete redesign that showcases:
1. Professional profile (Cloud/DevOps Engineer)
2. The homelab infrastructure and how apps are deployed
3. Architecture diagrams
4. Live monitoring/status indicators
5. Projects and certifications
