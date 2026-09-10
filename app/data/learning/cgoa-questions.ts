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
  {
    id: 'cgoa-16',
    question: 'What is an Argo CD "sync wave" used for?',
    options: [
      'Controlling the order resources are applied within a single sync, e.g. applying a Namespace or CRD before the resources that depend on it',
      'Scheduling how often Argo CD polls Git for changes',
      'Grouping Applications by team for billing purposes',
      'Determining which cluster an Application deploys to',
    ],
    correctIndex: 0,
    explanation:
      'Sync waves (set via the `argocd.argoproj.io/sync-wave` annotation) let you sequence resource application within one sync — lower-numbered waves apply first and must reach a healthy state before the next wave proceeds, useful for ordering dependencies like CRDs before custom resources.',
  },
  {
    id: 'cgoa-17',
    question: 'What is the purpose of Argo CD PreSync and PostSync resource hooks?',
    options: [
      'They run arbitrary Jobs before or after the main sync, commonly used for database migrations (PreSync) or smoke tests/notifications (PostSync)',
      'They control which user can trigger a sync',
      'They are only used to validate YAML syntax before applying',
      'They automatically create the destination namespace',
    ],
    correctIndex: 0,
    explanation:
      'Hooks are ordinary Kubernetes resources (usually Jobs) annotated with `argocd.argoproj.io/hook: PreSync` or `PostSync`. Argo CD runs PreSync hooks before syncing the rest of the manifests (e.g. a migration Job) and PostSync hooks after the sync succeeds (e.g. a smoke test).',
  },
  {
    id: 'cgoa-18',
    question: 'A resource in Git differs from the live cluster only in a field managed by another controller (e.g. a webhook-injected sidecar). How should this be handled in Argo CD without disabling selfHeal entirely?',
    options: [
      'Delete the Application and recreate it whenever this happens',
      'Use `ignoreDifferences` to exclude that specific field/path from the diff so Argo CD stops reporting it as drift',
      'There is no way to handle this — the Application must always show OutOfSync',
      'Set `prune: false` on the entire Application',
    ],
    correctIndex: 1,
    explanation:
      '`ignoreDifferences` lets you scope out specific JSON paths (or whole resource kinds) from Argo CD\'s diffing, so fields legitimately mutated by another controller (like an admission webhook injecting a sidecar) don\'t cause perpetual OutOfSync noise or fight with selfHeal.',
  },
  {
    id: 'cgoa-19',
    question: 'What is "image automation" in a GitOps context (e.g. Flux\'s image-automation-controller)?',
    options: [
      'Automatically compressing container images to reduce registry storage',
      'A controller that scans a registry for new image tags matching a policy, then automatically commits the updated tag into the Git repo on the app\'s behalf',
      'A tool that automatically builds Docker images from source with no CI pipeline needed',
      'A feature that deletes unused images from a cluster\'s local container runtime',
    ],
    correctIndex: 1,
    explanation:
      "Flux's image reflector/automation controllers watch a registry for new tags matching a policy (e.g. semver range), then write the updated tag back into the Git manifests automatically — closing the loop from CI-built image to GitOps-deployed change without a human editing YAML.",
  },
  {
    id: 'cgoa-20',
    question: 'Why do most GitOps setups prefer webhook-triggered reconciliation in addition to periodic polling?',
    options: [
      'Webhooks are required by Kubernetes and polling is not supported',
      'Webhooks notify the GitOps agent immediately on a Git push, reducing the delay between a commit and the cluster reconciling to it, compared to waiting for the next poll interval',
      'Polling causes data loss, webhooks do not',
      'Webhooks eliminate the need for a Git repository entirely',
    ],
    correctIndex: 1,
    explanation:
      'Without a webhook, the agent notices new commits only on its next poll (e.g. every 3 minutes), delaying reconciliation. A webhook lets the Git provider push a notification immediately on `git push`, so sync happens in seconds instead of waiting for the poll cycle.',
  },
  {
    id: 'cgoa-21',
    question: 'What does "environment promotion" typically mean in a GitOps repository structure?',
    options: [
      'Manually re-typing the same manifests into each environment\'s directory',
      'Advancing a specific, already-tested artifact/tag (or a Git commit) from one environment\'s config (e.g. dev) to the next (e.g. staging, then prod) via a Git operation, rather than rebuilding for each stage',
      'Giving a Kubernetes namespace admin privileges',
      'Deleting the dev environment once staging is ready',
    ],
    correctIndex: 1,
    explanation:
      'Promotion means moving a known-good, already-built artifact through environments by updating each environment\'s Git-tracked config (e.g. bumping the image tag in the staging overlay to match what dev validated), preserving the principle of "build once, deploy many times" instead of rebuilding per environment.',
  },
  {
    id: 'cgoa-22',
    question: 'Why is "build once, deploy many" considered a GitOps best practice?',
    options: [
      'It reduces cloud storage costs for container registries',
      'It guarantees the exact artifact tested in one environment is the same one promoted to the next, eliminating "it worked in staging but not prod" caused by rebuilding with different dependency versions',
      'It is required by the CNCF for GitOps certification',
      'It removes the need for a container registry entirely',
    ],
    correctIndex: 1,
    explanation:
      'Rebuilding per environment risks picking up a different dependency version between builds (e.g. an unpinned base image or floating package version), so what passed staging isn\'t bit-for-bit what reaches production. Building once and promoting the same immutable artifact/tag removes that variable entirely.',
  },
  {
    id: 'cgoa-23',
    question: 'What is a key difference between using GitOps for application deployments versus for infrastructure provisioning (e.g. Terraform)?',
    options: [
      'There is no difference; the same reconciliation model applies identically to both',
      'Application GitOps tools (Argo CD, Flux) reconcile continuously against a live Kubernetes API; infrastructure-as-code tools like Terraform are typically plan/apply-driven and reconcile against cloud provider APIs, often on a schedule or via a pipeline rather than continuous drift correction',
      'Terraform cannot be used with Git at all',
      'GitOps tools cannot manage anything outside of Kubernetes',
    ],
    correctIndex: 1,
    explanation:
      'Argo CD/Flux run inside the cluster and continuously reconcile Kubernetes resources against Git. Terraform\'s native workflow is plan-then-apply against a state file and cloud APIs — some teams wrap it with periodic "Terraform GitOps" pipelines to approximate continuous reconciliation, but it is not the same built-in control-loop model.',
  },
  {
    id: 'cgoa-24',
    question: 'What is the primary compliance/audit benefit of a GitOps workflow?',
    options: [
      'It automatically generates SOC2 certificates',
      'Every change to the cluster has a corresponding Git commit with author, timestamp, and diff, providing a complete, immutable audit trail of who changed what and when',
      'It encrypts all data at rest by default',
      'It removes the need for any access controls',
    ],
    correctIndex: 1,
    explanation:
      'Because every desired-state change must go through a Git commit (ideally via a reviewed pull request) rather than an ad-hoc `kubectl` command, GitOps produces a natural, tamper-evident audit log of every production change — who proposed it, who approved it, and exactly what changed.',
  },
  {
    id: 'cgoa-25',
    question: 'Why do many GitOps workflows require changes to go through a pull request rather than a direct commit to the main branch?',
    options: [
      'Pull requests are a hard technical requirement of Argo CD and Flux',
      'It adds a human review/approval gate before a change is merged and picked up by the GitOps agent, catching mistakes before they reach the cluster',
      'Direct commits to main are technically impossible in Git',
      'Pull requests automatically run the application\'s test suite with no CI configuration needed',
    ],
    correctIndex: 1,
    explanation:
      'GitOps tools themselves don\'t require PRs — they just watch a branch. Teams add branch protection requiring PR review as a process control, so a second person reviews infrastructure/config changes before they merge and get reconciled into the cluster, catching errors pre-merge instead of post-deploy.',
  },
  {
    id: 'cgoa-26',
    question: 'What does "immutable infrastructure" mean, and how does it relate to GitOps?',
    options: [
      'Servers/containers are never patched in place; instead a new image/resource is built and the old one is replaced entirely — GitOps reinforces this by always deploying a full desired-state definition rather than incremental in-place edits',
      'Infrastructure that can never be deleted once created',
      'A synonym for read-only file systems inside containers',
      'It has no relationship to GitOps',
    ],
    correctIndex: 0,
    explanation:
      'Immutable infrastructure replaces rather than patches — e.g. deploying a new container image instead of SSH-ing in to update code. GitOps naturally supports this: the desired state in Git fully describes what should exist, and reconciliation replaces drifted resources rather than patching them incrementally.',
  },
  {
    id: 'cgoa-27',
    question: 'In a disaster recovery scenario where a cluster is completely lost and rebuilt from scratch, what is the key advantage a GitOps workflow provides?',
    options: [
      'GitOps prevents clusters from ever being lost',
      'Since the entire desired state is declared in Git, pointing a fresh GitOps agent at the same repo reconstructs the full application/config state automatically, without needing separate manual runbooks for every resource',
      'GitOps automatically backs up persistent volume data',
      'It eliminates the need for a new cluster to be provisioned',
    ],
    correctIndex: 1,
    explanation:
      'Git already holds the complete, versioned desired state of everything the GitOps agent manages. Bootstrapping a new cluster is largely "install the agent, point it at the repo" — the reconciliation loop rebuilds everything it declares. (Stateful data like PV contents still needs its own backup/restore strategy — GitOps covers config and manifests, not data.)',
  },
  {
    id: 'cgoa-28',
    question: 'What is a "sync window" in Argo CD used for?',
    options: [
      'Restricting the physical browser window size for the Argo CD UI',
      'Defining time-based rules for when automated syncs are allowed or denied, e.g. blocking auto-sync during a change freeze or business hours',
      'Setting a timeout after which a stuck sync operation is killed',
      'Controlling the resolution of the sync progress bar in the UI',
    ],
    correctIndex: 1,
    explanation:
      'Sync windows (`spec.syncWindows` on an AppProject) let you allow or deny automated syncing during specific time ranges — commonly used to enforce change freezes (e.g. no prod deploys on Friday afternoons) without disabling GitOps management outright.',
  },
  {
    id: 'cgoa-29',
    question: 'Why does GitOps typically discourage giving individual engineers direct `kubectl` write access to production clusters?',
    options: [
      'kubectl is deprecated and no longer works with modern Kubernetes',
      'Direct kubectl access bypasses the Git-reviewed change process and creates untracked drift that a GitOps agent will either fight against (if selfHeal is on) or silently diverge from (if not), undermining Git as the single source of truth',
      'kubectl cannot connect to clusters managed by Argo CD',
      'It is a hard technical restriction enforced by Kubernetes RBAC by default',
    ],
    correctIndex: 1,
    explanation:
      "It's a process/security recommendation, not a technical block. Direct kubectl changes aren't recorded in Git, so they either get silently reverted by selfHeal (confusing whoever made the change) or accumulate as untracked, unreviewed drift — both undermine Git as the actual source of truth.",
  },
  {
    id: 'cgoa-30',
    question: "What is the difference between Argo CD's manual sync and automated sync policy?",
    options: [
      'They are functionally identical; "manual" is just a legacy name',
      'With automated sync, Argo CD applies new Git changes to the cluster on its own as soon as it detects them; with manual sync, changes are detected and shown as OutOfSync, but a person must explicitly trigger the sync to apply them',
      'Manual sync only works for Helm charts',
      'Automated sync requires a paid Argo CD license',
    ],
    correctIndex: 1,
    explanation:
      'Automated sync (`syncPolicy.automated`) has Argo CD apply detected Git changes immediately without human intervention. Without it, Argo CD still detects and reports drift/new commits as OutOfSync, but waits for someone to click "Sync" (or run `argocd app sync`) before actually applying them — useful for environments wanting a manual gate.',
  },
]
