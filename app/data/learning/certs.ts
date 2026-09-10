export interface CertMeta {
  id: string
  name: string
  shortName: string
  description: string
  questionCount: number
  durationMinutes: number
  passThreshold: number
  available: boolean
}

export const CERTS: CertMeta[] = [
  {
    id: 'cgoa',
    name: 'Certified GitOps Associate',
    shortName: 'CGOA',
    description: 'GitOps principles, Argo CD & Flux, and declarative deployment workflows.',
    questionCount: 25,
    durationMinutes: 50,
    passThreshold: 75,
    available: true,
  },
  {
    id: 'capa',
    name: 'Certified Argo Project Associate',
    shortName: 'CAPA',
    description: 'Argo Workflows, Argo CD, Argo Rollouts, and Argo Events in production.',
    questionCount: 25,
    durationMinutes: 50,
    passThreshold: 75,
    available: true,
  },
  {
    id: 'kcna',
    name: 'Kubernetes and Cloud Native Associate',
    shortName: 'KCNA',
    description: 'Core Kubernetes concepts and the cloud-native landscape.',
    questionCount: 0,
    durationMinutes: 0,
    passThreshold: 75,
    available: false,
  },
  {
    id: 'kcsa',
    name: 'Kubernetes and Cloud Native Security Associate',
    shortName: 'KCSA',
    description: 'Kubernetes security fundamentals across the cluster and supply chain.',
    questionCount: 0,
    durationMinutes: 0,
    passThreshold: 75,
    available: false,
  },
  {
    id: 'pca',
    name: 'Prometheus Certified Associate',
    shortName: 'PCA',
    description: 'Observability concepts, PromQL, instrumentation, exporters, and alerting.',
    questionCount: 0,
    durationMinutes: 0,
    passThreshold: 75,
    available: false,
  },
  {
    id: 'cba',
    name: 'Certified Backstage Associate',
    shortName: 'CBA',
    description: 'Backstage plugins, software catalog, and internal developer portals.',
    questionCount: 0,
    durationMinutes: 0,
    passThreshold: 75,
    available: false,
  },
  {
    id: 'otca',
    name: 'OpenTelemetry Certified Associate',
    shortName: 'OTCA',
    description: 'Traces, metrics, logs, and the OpenTelemetry Collector pipeline.',
    questionCount: 0,
    durationMinutes: 0,
    passThreshold: 75,
    available: false,
  },
  {
    id: 'cnpa',
    name: 'Cloud Native Platform Engineering Associate',
    shortName: 'CNPA',
    description: 'Platform engineering principles and internal developer platforms.',
    questionCount: 0,
    durationMinutes: 0,
    passThreshold: 75,
    available: false,
  },
  {
    id: 'kca',
    name: 'Kyverno Certified Associate',
    shortName: 'KCA',
    description: 'Kubernetes policy-as-code with Kyverno.',
    questionCount: 0,
    durationMinutes: 0,
    passThreshold: 75,
    available: false,
  },
  {
    id: 'cca',
    name: 'Cilium Certified Associate',
    shortName: 'CCA',
    description: 'eBPF-based networking, security, and observability with Cilium.',
    questionCount: 0,
    durationMinutes: 0,
    passThreshold: 75,
    available: false,
  },
]

export function getCertById(id: string): CertMeta | undefined {
  return CERTS.find((c) => c.id === id)
}
