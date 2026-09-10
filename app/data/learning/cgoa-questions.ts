import type { Question } from '@/lib/learning/quiz-engine'

export const CGOA_QUESTIONS: Question[] = [
  {
    id: 'cgoa-1',
    question: 'What is the core principle that distinguishes GitOps from a traditional CI/CD push pipeline?',
    options: [
      'Git is used only to store application source code, not configuration',
      'Deployments are triggered by an agent pulling and reconciling desired state from Git, rather than a pipeline pushing changes to the cluster',
      'GitOps requires a service mesh to function',
      'GitOps replaces the need for container images',
    ],
    correctIndex: 1,
    explanation:
      'GitOps is defined by the pull-based reconciliation model: an in-cluster agent (e.g. Argo CD, Flux) continuously compares live state to the desired state declared in Git and converges toward it, rather than an external CI pipeline pushing changes with cluster credentials.',
  },
  {
    id: 'cgoa-2',
    question: "In Argo CD, what does setting `prune: true` in the sync policy do?",
    options: [
      'Automatically reverts manual changes made directly to the cluster',
      'Deletes live resources that are no longer defined in the Git source',
      'Removes old Git commits from the repository history',
      'Disables health checks for the Application',
    ],
    correctIndex: 1,
    explanation:
      "`prune: true` tells Argo CD to delete resources it manages that have been removed from the Git manifests. Reverting manual/out-of-band changes is instead the job of `selfHeal: true`.",
  },
  {
    id: 'cgoa-3',
    question: "What does Argo CD's `selfHeal: true` sync option do?",
    options: [
      'Automatically retries a failed sync operation up to 3 times',
      'Restarts unhealthy pods in the target namespace',
      'Automatically re-syncs the Application when the live state drifts from Git due to manual changes',
      'Rolls back to the previous Git commit on sync failure',
    ],
    correctIndex: 2,
    explanation:
      "`selfHeal` triggers an automatic sync whenever Argo CD detects the live cluster state has drifted from the desired state in Git — for example if someone runs `kubectl edit` on a managed resource — converging it back to match Git.",
  },
  {
    id: 'cgoa-4',
    question: 'Why is storing plaintext secrets directly in a Git repository considered an anti-pattern in GitOps?',
    options: [
      'Git repositories have a hard size limit that secrets would exceed',
      'Git history is immutable, so a committed secret remains recoverable from history even after being removed in a later commit',
      'Kubernetes cannot read Secret objects that originate from Git',
      'GitOps tools refuse to sync any manifest containing a Secret',
    ],
    correctIndex: 1,
    explanation:
      'Because Git preserves full history, deleting or rotating a secret in a new commit does not remove it from earlier commits — anyone with repo access (or a leaked clone) can still recover it. Tools like Sealed Secrets, SOPS, or External Secrets Operator exist specifically to avoid committing plaintext secrets.',
  },
  {
    id: 'cgoa-5',
    question: 'What problem does Sealed Secrets solve in a GitOps workflow?',
    options: [
      'It encrypts a Secret so it can be safely committed to Git, and only the in-cluster controller holding the matching private key can decrypt it',
      'It automatically rotates all Kubernetes secrets on a schedule',
      'It replaces the need for RBAC on Secret objects',
      'It compresses large ConfigMaps to reduce Git repo size',
    ],
    correctIndex: 0,
    explanation:
      "Sealed Secrets uses asymmetric encryption: a `kubeseal` CLI encrypts a Secret against the cluster's public key into a `SealedSecret` CRD, which is safe to commit to Git. Only the sealed-secrets controller in that specific cluster (holding the private key) can decrypt it back into a real Secret.",
  },
  {
    id: 'cgoa-6',
    question: 'In a typical GitOps repository layout, what is the purpose of separating "app-of-apps" or environment overlay directories (e.g. `overlays/dev`, `overlays/prod`)?',
    options: [
      'To satisfy a Git provider requirement for repository size',
      'To allow environment-specific configuration (replicas, resource limits, image tags) to be layered on top of a shared base without duplicating the entire manifest set',
      'To prevent Argo CD from syncing more than one environment at a time',
      'It has no functional purpose, only cosmetic organization',
    ],
    correctIndex: 1,
    explanation:
      'This is the Kustomize base/overlay pattern (or the equivalent Helm values-per-environment pattern): a shared base defines common resources, and each environment overlay patches only what differs, avoiding duplicated, drift-prone copies of the full manifest set per environment.',
  },
  {
    id: 'cgoa-7',
    question: "Which statement best describes Argo CD's \"Application\" custom resource?",
    options: [
      'It represents a single running Pod in the cluster',
      'It declares a Git source (repo, path, revision) and a destination (cluster, namespace), and Argo CD reconciles the two',
      'It is only used to define RBAC policies for Argo CD users',
      'It is a Helm chart repository index',
    ],
    correctIndex: 1,
    explanation:
      "An `Application` is Argo CD's core CRD: it binds a Git source (repoURL, path/chart, targetRevision) to a destination (cluster + namespace) and continuously reconciles the destination toward the source.",
  },
  {
    id: 'cgoa-8',
    question: 'What is the "app-of-apps" pattern in Argo CD?',
    options: [
      'Running multiple separate Argo CD installations, one per team',
      'A root Argo CD Application whose only job is to manage a set of other Application manifests, so a whole fleet of apps can be bootstrapped and managed from one Git commit',
      'A Kubernetes feature that groups pods into logical applications',
      'A Helm chart that installs Argo CD itself',
    ],
    correctIndex: 1,
    explanation:
      'App-of-apps uses one parent Application that points at a directory of other Application manifests. Syncing the parent creates/updates all the child Applications, giving a single Git-driven entry point for onboarding or reconfiguring many apps at once.',
  },
  {
    id: 'cgoa-9',
    question: "A GitOps agent detects that a ConfigMap in the cluster has extra keys not present in Git, added by `kubectl patch`. With `prune: true` and `selfHeal: true` both enabled, what happens on the next reconciliation?",
    options: [
      'Nothing — Argo CD only manages resources it created, never modifies existing ones',
      'The extra keys are removed, since selfHeal reverts the live state back to match the Git-declared desired state',
      'Argo CD merges the extra keys into Git automatically',
      'The sync fails with a conflict error requiring manual resolution',
    ],
    correctIndex: 1,
    explanation:
      "selfHeal reconciles any drift — additions, removals, or modifications made out-of-band — back to exactly what Git declares. The extra keys aren't part of the desired state, so they get removed on the next reconciliation.",
  },
  {
    id: 'cgoa-10',
    question: 'What is the main risk of giving a CI pipeline direct `kubectl apply` / cluster-admin credentials, which GitOps aims to avoid?',
    options: [
      'CI pipelines are too slow to apply Kubernetes manifests',
      'It expands the security perimeter — long-lived cluster credentials must be stored and protected in the CI system, and pipeline compromise means direct cluster compromise',
      'Kubernetes does not support being managed from outside the cluster',
      'CI systems cannot produce valid YAML',
    ],
    correctIndex: 1,
    explanation:
      'Push-based CI/CD requires storing cluster credentials in the CI system and granting it network access to the cluster, widening the attack surface. GitOps removes this by having an in-cluster agent pull changes instead, so no external system needs standing cluster access.',
  },
  {
    id: 'cgoa-11',
    question: 'In Flux, what is the role of a `Kustomization` (or `HelmRelease`) resource relative to a `GitRepository` source?',
    options: [
      'The GitRepository resource defines what to deploy, and Kustomization only manages RBAC',
      'The GitRepository resource fetches and tracks a Git repo as an artifact; the Kustomization/HelmRelease resource then reconciles a specific path or chart from that artifact into the cluster',
      'They are interchangeable and either can be used for both fetching and applying',
      'GitRepository resources apply manifests directly; Kustomization only reports status',
    ],
    correctIndex: 1,
    explanation:
      'Flux separates "source" (fetching and revision-tracking, via `GitRepository`, `HelmRepository`, `OCIRepository`) from "reconciliation" (applying a path or chart from that source, via `Kustomization` or `HelmRelease`). This lets one source feed multiple reconcilers.',
  },
  {
    id: 'cgoa-12',
    question: 'Why is "drift detection" an important capability of a GitOps tool?',
    options: [
      'It measures network latency between the cluster and Git provider',
      'It identifies where the live cluster state has diverged from the Git-declared desired state, which is the basis for both alerting on and correcting configuration drift',
      'It detects when a Docker image has drifted to a larger file size',
      'It is only used for compliance report generation, with no operational purpose',
    ],
    correctIndex: 1,
    explanation:
      'Drift detection is the comparison step at the heart of the GitOps reconciliation loop — without it, a tool has no way to know a resource needs correcting (via selfHeal) or to surface an OutOfSync status to an operator.',
  },
  {
    id: 'cgoa-13',
    question: 'What does "declarative" mean in the context of GitOps configuration, as opposed to "imperative"?',
    options: [
      'Declarative configuration describes the desired end state; imperative configuration describes the sequence of commands to reach that state',
      'Declarative configuration must be written in YAML; imperative must be written in a scripting language',
      'Declarative configuration cannot be version-controlled',
      'There is no meaningful difference for Kubernetes tooling',
    ],
    correctIndex: 0,
    explanation:
      '`kubectl apply -f deployment.yaml` (declarative) says "this is what I want to exist" and lets the control loop figure out how to get there. `kubectl create`/`kubectl scale` style imperative commands instead specify the exact action to take, with no persisted desired-state record for reconciliation to compare against.',
  },
  {
    id: 'cgoa-14',
    question: 'A team wants their CI pipeline to update the image tag deployed to production automatically after a successful build, while still keeping the deploy itself GitOps-driven. What is the standard pattern for this?',
    options: [
      'The CI pipeline runs `kubectl set image` directly against the production cluster',
      'The CI pipeline commits the new image tag into the GitOps repository (e.g. patching a manifest or Kustomize overlay), and the GitOps agent picks up that commit and reconciles it',
      'This cannot be automated in a GitOps workflow — a human must always update the tag manually',
      'The CI pipeline restarts the GitOps agent to force a redeploy',
    ],
    correctIndex: 1,
    explanation:
      "CI keeps doing what it's good at — build, test, tag — but instead of deploying directly, it writes the result (an updated tag) back into Git. The GitOps agent, watching that repo, treats the new commit as an updated desired state and reconciles the cluster to it. This preserves Git as the single source of truth and full audit trail.",
  },
  {
    id: 'cgoa-15',
    question: "What does Argo CD's Application \"Health Status\" (e.g. Healthy, Progressing, Degraded) represent, as distinct from \"Sync Status\"?",
    options: [
      'Health Status and Sync Status are two names for the same thing',
      'Sync Status shows whether the live state matches Git; Health Status shows whether the resources are actually functioning correctly (e.g. a Deployment has enough ready replicas), independent of whether they match Git',
      'Health Status only applies to StatefulSets',
      'Sync Status is reported by Kubernetes; Health Status is reported by Git',
    ],
    correctIndex: 1,
    explanation:
      'A resource can be Synced (its spec matches Git exactly) but Degraded (e.g. a Deployment rolled out the correct spec, but the pods are crash-looping) — Sync Status is about matching desired state, Health Status is about whether the workload is actually operating correctly.',
  },
]
