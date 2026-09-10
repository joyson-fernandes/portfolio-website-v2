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
  {
    id: 'cgoa-31',
    question: 'What is the difference between an "in-cluster" GitOps reconciler (e.g. Argo CD, Flux running inside the target cluster) and an "external" reconciler?',
    options: [
      'There is no difference; both terms describe the same deployment model',
      'An in-cluster reconciler runs as a controller inside the cluster it manages and needs no inbound network access from outside; an external reconciler runs outside the cluster (e.g. in CI) and must be granted credentials/network access to reach the cluster API',
      'External reconcilers cannot use Git as a source',
      'In-cluster reconcilers require a paid license, external ones do not',
    ],
    correctIndex: 1,
    explanation:
      'In-cluster reconcilers (Argo CD, Flux) poll or receive webhooks and apply changes using credentials scoped to the cluster they run in — nothing outside needs push access. An external reconciler sits outside the cluster and must be handed cluster API credentials, reintroducing some of the standing-access risk GitOps aims to avoid.',
  },
  {
    id: 'cgoa-32',
    question: 'Why is Git considered a suitable "state store" for GitOps compared to a general-purpose database?',
    options: [
      'Git has no advantages over a database for this purpose',
      'Git natively provides versioning, diffing, branching, and an audit trail (commit history) for the desired-state configuration, which a plain database would require significant extra tooling to replicate',
      'Git can execute Kubernetes API calls directly',
      'Git automatically encrypts all stored content by default',
    ],
    correctIndex: 1,
    explanation:
      "Git's built-in history, diffing, branching, and merge/review workflow already give GitOps most of what it needs for tracking and reviewing desired-state changes — a generic database would need bespoke versioning and audit logic layered on top to match that.",
  },
  {
    id: 'cgoa-33',
    question: 'What role can an OCI (Open Container Initiative) registry play in a GitOps workflow, beyond storing container images?',
    options: [
      'OCI registries can also store and version Helm charts (and other artifacts) as OCI artifacts, letting a GitOps tool pull packaged manifests from the same registry infrastructure used for images',
      'OCI registries can only ever store container images and nothing else',
      'OCI is a replacement for Git as the desired-state source',
      'OCI registries automatically apply manifests to a cluster',
    ],
    correctIndex: 0,
    explanation:
      'The OCI artifact spec generalizes registries beyond container images — Helm now supports pushing/pulling charts as OCI artifacts (`helm push`/`helm pull oci://...`), so a single registry can host both images and packaged manifests that a GitOps agent references as a source.',
  },
  {
    id: 'cgoa-34',
    question: 'Why would a GitOps setup integrate with a notification tool (e.g. Slack, email) rather than relying only on the GitOps tool\'s own UI?',
    options: [
      'Notifications are required for Argo CD or Flux to function at all',
      'It surfaces sync/health state changes (e.g. a deploy failed, an Application went Degraded) to the team in the channels they already watch, instead of requiring someone to keep the GitOps UI open to notice problems',
      'It replaces the need for drift detection',
      'Notifications remove the need for Git commit history',
    ],
    correctIndex: 1,
    explanation:
      "Push notifications (Argo CD's Notifications controller, Flux's notification-controller) turn sync/health events into alerts in tools the team already monitors, so failures or drift are noticed proactively rather than only when someone happens to check the dashboard.",
  },
  {
    id: 'cgoa-35',
    question: "What kind of metrics does Argo CD typically expose for scraping by Prometheus?",
    options: [
      'Only HTTP request latency for the Argo CD UI',
      'Application-level metrics such as sync status, health status, and sync operation counts/durations per Application, alongside standard controller/process metrics',
      'Argo CD cannot be monitored by Prometheus at all',
      'Only Kubernetes node-level CPU and memory metrics',
    ],
    correctIndex: 1,
    explanation:
      "Argo CD's `metrics` endpoints (on the application controller, repo server, and API server) expose Prometheus metrics including per-Application sync/health status gauges and sync operation counters, which are the basis for Grafana dashboards and Alertmanager rules covering GitOps-specific state.",
  },
  {
    id: 'cgoa-36',
    question: 'What would an Alertmanager rule built on Argo CD metrics typically alert on?',
    options: [
      'Only raw CPU usage of the Argo CD pods',
      'Conditions like an Application remaining OutOfSync or Degraded for longer than a threshold, indicating a stuck or failing reconciliation that needs human attention',
      'The number of Git branches in the source repository',
      'The size of container images being deployed',
    ],
    correctIndex: 1,
    explanation:
      'Because Argo CD exposes sync/health status as metrics, a common Alertmanager rule fires when an Application has stayed OutOfSync or Degraded beyond an acceptable window — signaling reconciliation is stuck or a deployed workload is unhealthy, rather than just a transient blip.',
  },
  {
    id: 'cgoa-37',
    question: 'Besides Argo CD and Flux, what is an example of an alternative GitOps reconciliation engine?',
    options: [
      'kubectl',
      'Rancher Fleet (or similar tools like Jenkins X GitOps) — both implement the same pull-based reconciliation model against Git, with different architectures and target use cases',
      'Prometheus',
      'Helm',
    ],
    correctIndex: 1,
    explanation:
      'Rancher Fleet is built for managing large fleets of clusters from Git at scale, and Jenkins X applies GitOps principles inside a CI/CD-focused platform — both are alternative implementations of the same pull-based, Git-as-source-of-truth reconciliation model as Argo CD and Flux.',
  },
  {
    id: 'cgoa-38',
    question: 'What is the distinction between "Configuration as Code" (CaC) and "Infrastructure as Code" (IaC)?',
    options: [
      'They are identical terms for the same practice',
      'IaC typically refers to declaratively provisioning infrastructure resources (VMs, networks, cloud services), while CaC refers to declaratively managing application/system configuration (e.g. Kubernetes manifests, app settings) — GitOps commonly applies the same Git-driven principles to both',
      'CaC only applies to container images; IaC only applies to bare-metal servers',
      'IaC cannot be version-controlled, unlike CaC',
    ],
    correctIndex: 1,
    explanation:
      'IaC (Terraform, CloudFormation, Bicep) provisions the underlying infrastructure; CaC manages the configuration running on top of it (Kubernetes manifests, app config). GitOps borrows from and extends both by requiring Git as the declarative source of truth and reconciling toward it.',
  },
  {
    id: 'cgoa-39',
    question: 'How does GitOps relate to DevOps and DevSecOps as broader practices?',
    options: [
      'GitOps replaces DevOps and DevSecOps entirely',
      'GitOps is a specific implementation pattern that operationalizes some DevOps/DevSecOps goals — using Git as the auditable, reviewed source of truth for changes — but does not by itself cover practices like security scanning, testing culture, or team collaboration norms',
      'DevSecOps cannot be practiced alongside GitOps',
      'GitOps and DevOps are unrelated concepts with no overlap',
    ],
    correctIndex: 1,
    explanation:
      "GitOps is a narrower, concrete pattern (Git as source of truth, pull-based reconciliation) that supports broader DevOps goals like fast, auditable delivery, and DevSecOps goals like enforced review gates — but things like security scanning pipelines, testing culture, and cross-team collaboration are separate practices layered around it, not replaced by it.",
  },
  {
    id: 'cgoa-40',
    question: 'What is the key conceptual difference between "CI" (Continuous Integration) and "CD" (Continuous Delivery/Deployment) in relation to GitOps?',
    options: [
      'CI and CD are the same thing and both are entirely replaced by GitOps',
      'CI (build, test, produce an artifact) remains largely unchanged by GitOps; GitOps specifically changes how CD works — from a pipeline pushing changes to the cluster, to a pipeline (or human) committing desired state to Git and an in-cluster agent pulling and reconciling it',
      'GitOps eliminates the need for CI entirely',
      'CD only refers to compact discs and has no relevance here',
    ],
    correctIndex: 1,
    explanation:
      "GitOps doesn't change how code gets built and tested (CI) — it changes the delivery mechanism: instead of CD meaning a pipeline directly pushes to the cluster, CD becomes 'commit desired state to Git' and a separate, in-cluster reconciler handles the actual deployment step.",
  },
  {
    id: 'cgoa-41',
    question: 'What is a "shadow" deployment (traffic shadowing / mirroring), as distinct from canary or blue-green?',
    options: [
      'Live production traffic is duplicated (mirrored) to the new version for observation, but the mirrored responses are discarded and never returned to real users — so the new version is tested against real traffic patterns with zero user-facing risk',
      'It is a synonym for blue-green deployment',
      'It hides the deployment from the Kubernetes API to avoid detection',
      'It only works for batch jobs, never for services',
    ],
    correctIndex: 0,
    explanation:
      'Shadow (mirrored) traffic sends a copy of real requests to the new version alongside the live one, but the new version\'s responses are never served to users — this validates behavior/performance under real-world load patterns without any risk of a bad response reaching a real user, unlike canary which does expose some real users.',
  },
  {
    id: 'cgoa-42',
    question: 'How does an A/B deployment pattern differ in purpose from a canary deployment, even though both can split traffic between versions?',
    options: [
      'They are functionally and purposefully identical',
      'Canary is primarily a risk-mitigation technique for safely rolling out a new version by gradually increasing exposure; A/B testing is primarily a product/business experiment comparing user behavior or metrics between two intentionally different versions, often run for a fixed duration regardless of "safety"',
      'A/B testing can never be automated, while canary always is',
      'A/B testing requires no traffic-splitting mechanism at all',
    ],
    correctIndex: 1,
    explanation:
      "Canary's goal is a safe path to full rollout, informed by health/error metrics — it typically increases to 100% once confidence is established. A/B testing's goal is comparing outcomes (e.g. conversion rate) between two versions, often keeping both running at a fixed split for a set period regardless of either version being 'unhealthy'.",
  },
  {
    id: 'cgoa-43',
    question: 'What is the practical difference between a "rolling" update strategy and a "recreate" strategy in Kubernetes?',
    options: [
      'They behave identically for stateless workloads',
      'Rolling update replaces old pods with new ones incrementally, keeping the app available throughout; recreate terminates all old pods first, then creates new ones, causing a brief downtime window but guaranteeing no two versions run simultaneously',
      'Recreate is always faster than rolling update',
      'Rolling update is only available for StatefulSets',
    ],
    correctIndex: 1,
    explanation:
      "Rolling update trades a moment of mixed-version coexistence for zero downtime. Recreate trades a downtime window for the guarantee that old and new versions never run at the same time — useful when running both versions simultaneously would be unsafe (e.g. an incompatible schema change).",
  },
  {
    id: 'cgoa-44',
    question: "In Argo CD's ApplicationSet `list` generator, what is the generator's role?",
    options: [
      'It renders one Application per literal set of key/value parameters defined inline in the ApplicationSet spec, useful for a small, static, hand-maintained set of targets',
      'It automatically discovers every namespace in the cluster',
      'It can only be used for Helm-based Applications',
      'It replaces the need for an Application template entirely',
    ],
    correctIndex: 0,
    explanation:
      "The `list` generator is the simplest ApplicationSet generator: you hardcode a list of parameter sets directly in the spec, and one Application is rendered per entry — appropriate for a small, mostly-static fleet where a dynamic generator (git, cluster, matrix) would be overkill.",
  },
  {
    id: 'cgoa-45',
    question: 'Why might a team package their Kubernetes manifests as a Helm chart rather than plain YAML for a GitOps workflow?',
    options: [
      'Helm charts cannot be used with GitOps tools at all',
      'Helm provides templating (parameterizing values per environment), packaging/versioning of a chart as a single artifact, and dependency management between charts — capabilities plain YAML lacks natively',
      'Plain YAML is always preferred and Helm offers no advantages',
      'Helm charts remove the need for a Git repository',
    ],
    correctIndex: 1,
    explanation:
      "Helm adds a templating layer (values.yaml overrides per environment), chart versioning/packaging, and the ability to declare dependencies on other charts — all of which plain YAML manifests handle only through manual duplication or separate tooling like Kustomize.",
  },
  {
    id: 'cgoa-46',
    question: 'What advantage does Kustomize\'s "base + overlay" approach have specifically over maintaining fully separate copies of manifests per environment?',
    options: [
      'It has no advantage — separate copies and overlays behave identically',
      'A change to shared configuration only needs to be made once in the base, and every overlay automatically inherits it, whereas fully separate copies require the same edit to be manually repeated (and can silently drift) across every environment',
      'Kustomize overlays cannot be version-controlled',
      'Overlays require a running cluster to be created',
    ],
    correctIndex: 1,
    explanation:
      "The core problem with N full copies of manifests is that a shared fix (e.g. adding a common label, bumping a shared resource limit) has to be applied N times and can easily be missed in one environment. Kustomize's base/overlay model keeps that shared definition in one place, patched only where environments actually differ.",
  },
  {
    id: 'cgoa-47',
    question: 'What is the purpose of a GitOps tool\'s "manual reconciliation" trigger (e.g. `argocd app sync` run on demand) versus its normal polling loop?',
    options: [
      'It permanently disables the polling loop going forward',
      'It forces an immediate sync attempt right now, without waiting for the next scheduled poll interval or a webhook — useful when you need a change applied immediately or want to test at will during setup',
      'It only works if selfHeal is disabled',
      'It has no effect if the Application is already Synced',
    ],
    correctIndex: 1,
    explanation:
      "Manual reconciliation is an on-demand trigger layered on top of the normal reconciliation loop (polling and/or webhooks) — useful when you don't want to wait for the poll interval, e.g. while iterating on manifests during initial setup or troubleshooting.",
  },
  {
    id: 'cgoa-48',
    question: 'A GitOps pipeline uses a webhook-driven EventSource/Sensor combination (e.g. Argo Events) instead of the GitOps tool\'s own built-in Git webhook support to trigger reconciliation. What is a reason a team might do this?',
    options: [
      'It is never a valid approach and always redundant',
      'To run additional custom logic (e.g. validation, notifications, triggering a separate workflow) alongside or instead of a simple "notify the GitOps agent" webhook, when the built-in webhook integration alone is not expressive enough for the desired pipeline',
      'Because GitOps tools cannot receive webhooks natively',
      'Because Argo Events replaces the need for a GitOps reconciler entirely',
    ],
    correctIndex: 1,
    explanation:
      "Argo CD/Flux's built-in webhook receivers just trigger a resync. A general event-driven pipeline (Argo Events) can add richer logic — filtering, fan-out to multiple actions, custom validation — around the same Git push event, when the simple built-in webhook isn't expressive enough for the full desired workflow.",
  },
  {
    id: 'cgoa-49',
    question: 'What does "reconciliation timeout" (or a similar reconciliation frequency setting) control in a GitOps tool?',
    options: [
      'How long a user session in the UI stays logged in',
      'How often (or the maximum interval at which) the tool re-checks Git and the live cluster for drift, even without a webhook — balancing responsiveness against load on the Git provider and cluster API',
      'How long a container image is retained in the registry',
      'It has no configurable effect and is always fixed at exactly 24 hours',
    ],
    correctIndex: 1,
    explanation:
      "Reconciliation/poll interval settings define the fallback cadence of drift checks when no webhook fires — shortening it increases responsiveness to unnoticed changes at the cost of more frequent Git/API calls; lengthening it reduces load but increases the delay before drift is caught.",
  },
  {
    id: 'cgoa-50',
    question: 'What is the significance of a GitOps agent supporting "manual reconciliation" and "continuous reconciliation" as distinct modes, from a change-management perspective?',
    options: [
      'They are the same mode described differently',
      'Continuous reconciliation gives fully automated, always-converging behavior (including selfHeal), while manual reconciliation gives teams an explicit approval gate before any detected change is actually applied — useful for higher-risk environments wanting a human checkpoint',
      'Manual reconciliation is only available in paid tiers of every GitOps tool',
      'Continuous reconciliation cannot detect drift, only manual reconciliation can',
    ],
    correctIndex: 1,
    explanation:
      "Continuous (automated) reconciliation applies detected changes immediately with no human step, matching the classic GitOps ideal of full automation. Manual reconciliation still detects and reports drift/new commits, but requires an explicit human trigger to apply — a deliberate control some teams add for production environments.",
  },
]
