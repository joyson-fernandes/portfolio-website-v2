# Learning Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/learning` Learning Hub page with working CGOA and CAPA practice-quiz simulators (8 more certs shown as "Coming Soon" placeholders), matching the site's existing design system.

**Architecture:** Plain TypeScript data files for cert metadata and question banks (no DB/CMS), a small pure-function quiz engine (sampling/scoring, unit-tested), and React components following this project's existing section/card patterns.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind, Framer Motion, Vitest (new — this repo has no test runner yet).

---

## File Structure

- `app/vitest.config.ts` — new, minimal Vitest config
- `app/lib/learning/quiz-engine.ts` — new, pure functions: `sampleQuestions`, `scoreQuiz`, `isPassing`
- `app/lib/learning/quiz-engine.test.ts` — new, unit tests for the above
- `app/data/learning/certs.ts` — new, metadata for all 10 certs
- `app/data/learning/cgoa-questions.ts` — new, CGOA question bank (15 questions)
- `app/data/learning/capa-questions.ts` — new, CAPA question bank (15 questions)
- `app/components/learning/cert-card.tsx` — new, hub grid card (available + coming-soon states)
- `app/components/learning/question-card.tsx` — new, in-progress + answer-feedback states
- `app/components/learning/quiz-results.tsx` — new, score/pass-fail/full review
- `app/app/learning/page.tsx` — new, hub page
- `app/app/learning/[certId]/page.tsx` — new, quiz page (client component, manages quiz state)
- `app/components/layout/navigation.tsx:12` — modify, add `{ label: 'Learning', href: '/learning', isPage: true }` to `NAV_ITEMS`

---

### Task 1: Add Vitest

**Files:**
- Create: `app/vitest.config.ts`
- Modify: `app/package.json`

- [ ] **Step 1: Install Vitest**

```bash
cd app && npm install -D vitest --legacy-peer-deps
```

- [ ] **Step 2: Add the config**

```ts
// app/vitest.config.ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

- [ ] **Step 3: Add the test script**

Edit `app/package.json` — add `"test": "vitest run"` to `"scripts"`:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  },
```

- [ ] **Step 4: Verify it runs (no tests yet, should report 0 passed)**

Run: `cd app && npm test`
Expected: `No test files found` (this is fine — confirms the runner works before Task 2 adds real tests)

- [ ] **Step 5: Commit**

```bash
git add app/vitest.config.ts app/package.json app/package-lock.json
git commit -m "chore: add vitest for quiz engine unit tests"
```

---

### Task 2: Quiz engine (pure logic, TDD)

**Files:**
- Create: `app/lib/learning/quiz-engine.ts`
- Test: `app/lib/learning/quiz-engine.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// app/lib/learning/quiz-engine.test.ts
import { describe, it, expect } from 'vitest'
import { sampleQuestions, scoreQuiz, isPassing, type Question } from './quiz-engine'

const bank: Question[] = [
  { id: 'q1', question: 'Q1', options: ['a', 'b', 'c', 'd'], correctIndex: 0, explanation: 'e1' },
  { id: 'q2', question: 'Q2', options: ['a', 'b', 'c', 'd'], correctIndex: 1, explanation: 'e2' },
  { id: 'q3', question: 'Q3', options: ['a', 'b', 'c', 'd'], correctIndex: 2, explanation: 'e3' },
]

describe('sampleQuestions', () => {
  it('returns the full bank shuffled when count >= bank size', () => {
    const result = sampleQuestions(bank, 10)
    expect(result).toHaveLength(3)
    expect(result.map((q) => q.id).sort()).toEqual(['q1', 'q2', 'q3'])
  })

  it('returns exactly `count` unique questions when count < bank size', () => {
    const result = sampleQuestions(bank, 2)
    expect(result).toHaveLength(2)
    const ids = result.map((q) => q.id)
    expect(new Set(ids).size).toBe(2)
    ids.forEach((id) => expect(bank.map((q) => q.id)).toContain(id))
  })
})

describe('scoreQuiz', () => {
  it('counts correct answers by comparing selected index to correctIndex', () => {
    const answers = new Map([
      ['q1', 0], // correct
      ['q2', 0], // wrong (correct is 1)
      ['q3', 2], // correct
    ])
    const result = scoreQuiz(bank, answers)
    expect(result).toEqual({ correct: 2, total: 3, percent: 67 })
  })

  it('treats unanswered questions as incorrect', () => {
    const answers = new Map([['q1', 0]])
    const result = scoreQuiz(bank, answers)
    expect(result).toEqual({ correct: 1, total: 3, percent: 33 })
  })
})

describe('isPassing', () => {
  it('returns true when percent meets the threshold', () => {
    expect(isPassing(75, 75)).toBe(true)
    expect(isPassing(80, 75)).toBe(true)
  })

  it('returns false when percent is below the threshold', () => {
    expect(isPassing(74, 75)).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd app && npm test`
Expected: FAIL — `Cannot find module './quiz-engine'`

- [ ] **Step 3: Implement the quiz engine**

```ts
// app/lib/learning/quiz-engine.ts
export interface Question {
  id: string
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string
}

export interface QuizScore {
  correct: number
  total: number
  percent: number
}

/** Fisher-Yates shuffle, does not mutate the input array. */
function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Returns `count` unique questions from `bank` in shuffled order.
 * If `count` >= bank.length, returns the whole bank shuffled.
 */
export function sampleQuestions(bank: Question[], count: number): Question[] {
  const shuffled = shuffle(bank)
  return shuffled.slice(0, Math.min(count, bank.length))
}

/**
 * Scores a completed (or partial) quiz. `answers` maps question id ->
 * the index of the option the user selected. Unanswered questions
 * (missing from the map) count as incorrect.
 */
export function scoreQuiz(questions: Question[], answers: Map<string, number>): QuizScore {
  const total = questions.length
  const correct = questions.filter((q) => answers.get(q.id) === q.correctIndex).length
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  return { correct, total, percent }
}

export function isPassing(percent: number, passThreshold: number): boolean {
  return percent >= passThreshold
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd app && npm test`
Expected: PASS — 5 tests passing

- [ ] **Step 5: Commit**

```bash
git add app/lib/learning/quiz-engine.ts app/lib/learning/quiz-engine.test.ts
git commit -m "feat: add quiz engine (sampling, scoring, pass/fail)"
```

---

### Task 3: Cert metadata

**Files:**
- Create: `app/data/learning/certs.ts`

- [ ] **Step 1: Write the data file**

```ts
// app/data/learning/certs.ts
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
    questionCount: 15,
    durationMinutes: 30,
    passThreshold: 75,
    available: true,
  },
  {
    id: 'capa',
    name: 'Certified Argo Project Associate',
    shortName: 'CAPA',
    description: 'Argo Workflows, Argo CD, Argo Rollouts, and Argo Events in production.',
    questionCount: 15,
    durationMinutes: 30,
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
```

- [ ] **Step 2: Commit**

```bash
git add app/data/learning/certs.ts
git commit -m "feat: add learning hub cert metadata (10 certs, 2 available)"
```

---

### Task 4: CGOA question bank

**Files:**
- Create: `app/data/learning/cgoa-questions.ts`

- [ ] **Step 1: Write the question bank**

Sourced from Argo CD's official docs (sync/reconciliation behavior) and the KodeKloud CGOA prep course's stated modules (GitOps fundamentals, manifests & packaging, secrets, reconciliation & delivery, CI integration, observability). Review these for accuracy before shipping, per the design spec.

```ts
// app/data/learning/cgoa-questions.ts
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
    question: 'In Argo CD, what does setting `prune: true` in the sync policy do?',
    options: [
      'Automatically reverts manual changes made directly to the cluster',
      'Deletes live resources that are no longer defined in the Git source',
      'Removes old Git commits from the repository history',
      'Disables health checks for the Application',
    ],
    correctIndex: 1,
    explanation:
      '`prune: true` tells Argo CD to delete resources it manages that have been removed from the Git manifests. Reverting manual/out-of-band changes is instead the job of `selfHeal: true`.',
  },
  {
    id: 'cgoa-3',
    question: 'What does Argo CD\'s `selfHeal: true` sync option do?',
    options: [
      'Automatically retries a failed sync operation up to 3 times',
      'Restarts unhealthy pods in the target namespace',
      'Automatically re-syncs the Application when the live state drifts from Git due to manual changes',
      'Rolls back to the previous Git commit on sync failure',
    ],
    correctIndex: 2,
    explanation:
      '`selfHeal` triggers an automatic sync whenever Argo CD detects the live cluster state has drifted from the desired state in Git — for example if someone runs `kubectl edit` on a managed resource — converging it back to match Git.',
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
      'Sealed Secrets uses asymmetric encryption: a `kubeseal` CLI encrypts a Secret against the cluster\'s public key into a `SealedSecret` CRD, which is safe to commit to Git. Only the sealed-secrets controller in that specific cluster (holding the private key) can decrypt it back into a real Secret.',
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
    question: 'Which statement best describes Argo CD\'s "Application" custom resource?',
    options: [
      'It represents a single running Pod in the cluster',
      'It declares a Git source (repo, path, revision) and a destination (cluster, namespace), and Argo CD reconciles the two',
      'It is only used to define RBAC policies for Argo CD users',
      'It is a Helm chart repository index',
    ],
    correctIndex: 1,
    explanation:
      'An `Application` is Argo CD\'s core CRD: it binds a Git source (repoURL, path/chart, targetRevision) to a destination (cluster + namespace) and continuously reconciles the destination toward the source.',
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
    question: 'A GitOps agent detects that a ConfigMap in the cluster has extra keys not present in Git, added by `kubectl patch`. With `prune: true` and `selfHeal: true` both enabled, what happens on the next reconciliation?',
    options: [
      'Nothing — Argo CD only manages resources it created, never modifies existing ones',
      'The extra keys are removed, since selfHeal reverts the live state back to match the Git-declared desired state',
      'Argo CD merges the extra keys into Git automatically',
      'The sync fails with a conflict error requiring manual resolution',
    ],
    correctIndex: 1,
    explanation:
      'selfHeal reconciles any drift — additions, removals, or modifications made out-of-band — back to exactly what Git declares. The extra keys aren\'t part of the desired state, so they get removed on the next reconciliation.',
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
      'CI keeps doing what it\'s good at — build, test, tag — but instead of deploying directly, it writes the result (an updated tag) back into Git. The GitOps agent, watching that repo, treats the new commit as an updated desired state and reconciles the cluster to it. This preserves Git as the single source of truth and full audit trail.',
  },
  {
    id: 'cgoa-15',
    question: 'What does Argo CD\'s Application "Health Status" (e.g. Healthy, Progressing, Degraded) represent, as distinct from "Sync Status"?',
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
```

- [ ] **Step 2: Commit**

```bash
git add app/data/learning/cgoa-questions.ts
git commit -m "feat: add CGOA question bank (15 questions)"
```

---

### Task 5: CAPA question bank

**Files:**
- Create: `app/data/learning/capa-questions.ts`

- [ ] **Step 1: Write the question bank**

Sourced from official Argo Workflows, Argo CD, Argo Rollouts, and Argo Events documentation. Review for accuracy before shipping.

```ts
// app/data/learning/capa-questions.ts
import type { Question } from '@/lib/learning/quiz-engine'

export const CAPA_QUESTIONS: Question[] = [
  {
    id: 'capa-1',
    question: 'What is an Argo Workflows `Template` of type `steps` used for?',
    options: [
      'Defining a sequence of steps that run in order, where each step can itself run in parallel with others in the same step group',
      'Defining a single container that always runs alone',
      'Declaring RBAC permissions for the workflow controller',
      'Storing workflow secrets',
    ],
    correctIndex: 0,
    explanation:
      'A `steps` template defines a list of step groups executed sequentially; within a single step group (a nested array), steps run in parallel. This is Argo Workflows\' way of expressing sequential-with-parallel-substeps pipelines.',
  },
  {
    id: 'capa-2',
    question: 'How does a `dag` template differ from a `steps` template in Argo Workflows?',
    options: [
      'A `dag` template has no functional difference from `steps`, only different YAML syntax',
      'A `dag` template expresses task dependencies explicitly (via `depends`), allowing more complex non-linear execution graphs, whereas `steps` is strictly ordered step-by-step',
      'A `dag` template can only run a single task',
      '`dag` templates cannot use container images',
    ],
    correctIndex: 1,
    explanation:
      'DAG templates declare tasks and their dependencies explicitly, so the controller can run any task as soon as its dependencies finish — enabling diamond-shaped or fan-out/fan-in graphs that a strictly sequential `steps` template cannot express as naturally.',
  },
  {
    id: 'capa-3',
    question: 'What is the purpose of an Argo Workflows `WorkflowTemplate` (as opposed to a `Workflow`)?',
    options: [
      'It is a reusable, cluster- or namespace-scoped workflow definition that can be referenced and instantiated by multiple Workflow runs, instead of duplicating the same spec inline each time',
      'It is only used to store workflow logs',
      'It replaces the need for a workflow controller',
      'It can only be triggered manually, never by automation',
    ],
    correctIndex: 0,
    explanation:
      'A `WorkflowTemplate` is a saved, reusable workflow definition. Other Workflows can reference it (via `workflowTemplateRef`) instead of repeating the full spec, similar to how a function is defined once and called many times.',
  },
  {
    id: 'capa-4',
    question: 'In Argo Rollouts, what does the `canary` strategy do that a standard Kubernetes Deployment rolling update does not?',
    options: [
      'It deletes the old ReplicaSet immediately on update',
      'It progressively shifts traffic to the new version in controlled steps (e.g. 20%, then 50%, then 100%), optionally pausing for analysis or manual approval between steps',
      'It only works with StatefulSets, not Deployments',
      'It requires no traffic-shaping mechanism at all',
    ],
    correctIndex: 1,
    explanation:
      'A standard Deployment rolling update has no concept of weighted traffic splitting or pause/analysis gates — it just replaces pods gradually. Argo Rollouts\' canary strategy adds explicit, controllable steps with optional automated analysis (via AnalysisTemplates) before proceeding.',
  },
  {
    id: 'capa-5',
    question: 'What is the role of an `AnalysisTemplate` in Argo Rollouts?',
    options: [
      'It defines success/failure metrics (e.g. a Prometheus query for error rate) that Argo Rollouts checks during a canary or blue-green rollout to decide whether to proceed, pause, or automatically roll back',
      'It generates documentation for the rollout',
      'It is required for every Kubernetes Deployment, not just Rollouts',
      'It only controls how many replicas are created',
    ],
    correctIndex: 0,
    explanation:
      'AnalysisTemplates query a metrics provider (Prometheus, Datadog, etc.) during a progressive rollout and compare results against defined success conditions, letting Argo Rollouts automatically abort a bad rollout without a human watching dashboards.',
  },
  {
    id: 'capa-6',
    question: 'What triggers an Argo Events `Sensor` to take action?',
    options: [
      'A Sensor polls the Kubernetes API every second regardless of external events',
      'A Sensor subscribes to events published by an `EventSource` (e.g. a webhook, S3 bucket notification, or Kafka topic) and executes a defined `Trigger` (such as submitting an Argo Workflow) once its event dependencies are satisfied',
      'A Sensor only runs on a fixed cron schedule',
      'A Sensor directly modifies Argo CD Application resources',
    ],
    correctIndex: 1,
    explanation:
      'Argo Events separates event production (`EventSource`) from event consumption (`Sensor`). A Sensor defines dependencies on one or more events and a trigger action (commonly submitting an Argo Workflow) that fires once those dependencies are met.',
  },
  {
    id: 'capa-7',
    question: 'In Argo CD, what does `syncOptions: [CreateNamespace=true]` do on an Application?',
    options: [
      'It deletes the namespace when the Application is deleted',
      'It automatically creates the destination namespace during sync if it does not already exist',
      'It disables namespace isolation for the Application',
      'It is required for every Application regardless of whether the namespace exists',
    ],
    correctIndex: 1,
    explanation:
      'Without this option, Argo CD sync fails if the target namespace doesn\'t already exist, since it won\'t implicitly create namespaces by default. `CreateNamespace=true` opts into having Argo CD create it as part of the sync.',
  },
  {
    id: 'capa-8',
    question: 'What is the difference between Argo Rollouts\' `blueGreen` and `canary` strategies?',
    options: [
      'Blue-green cuts traffic over all at once from the old (blue) to new (green) version after validation, typically keeping the old version running as an instant rollback target; canary shifts traffic gradually in steps',
      'They are the same strategy under two different names',
      'Blue-green only works for stateless apps; canary only works for stateful apps',
      'Canary requires two separate Kubernetes clusters; blue-green does not',
    ],
    correctIndex: 0,
    explanation:
      'Blue-green runs the new version fully alongside the old one, then switches the active Service selector all at once (with the old version kept around briefly for instant rollback). Canary instead exposes both versions simultaneously at controlled traffic percentages, converging gradually.',
  },
  {
    id: 'capa-9',
    question: 'What does an Argo Workflows `exit handler` do?',
    options: [
      'It stops the workflow controller entirely',
      'It defines a template that always runs when the workflow finishes, regardless of whether it succeeded or failed — commonly used for cleanup or notifications',
      'It only runs if the workflow succeeds',
      'It deletes the workflow\'s namespace on completion',
    ],
    correctIndex: 1,
    explanation:
      'An `onExit` handler template runs after the main workflow DAG/steps finish, whether the outcome was Succeeded, Failed, or Error — making it the right place for guaranteed cleanup (e.g. tearing down temp resources) or sending a status notification.',
  },
  {
    id: 'capa-10',
    question: 'Why would an Argo Workflows author use `artifacts` (inputs/outputs) between steps instead of just chaining shell commands in one container?',
    options: [
      'Artifacts allow passing files/data produced by one step (potentially in a different container image or even a different pod) as input to a later step, enabling multi-language, multi-tool pipelines with proper storage-backed handoff',
      'Artifacts are required for every single-step workflow',
      'Artifacts replace the need for any container images',
      'Artifacts only work within the same container, so they offer no benefit over shell chaining',
    ],
    correctIndex: 0,
    explanation:
      'Each Argo Workflows step can run in its own pod/container. Artifacts (backed by S3, GCS, or similar) let a step\'s output files become another step\'s input regardless of language or image, which plain shell chaining inside one container can\'t do across step boundaries.',
  },
  {
    id: 'capa-11',
    question: 'What is the effect of Argo CD\'s `ApplicationSet` resource?',
    options: [
      'It generates and manages multiple Argo CD Applications from a single template, driven by a generator (e.g. list, Git directories, cluster list), instead of manually authoring one Application per target',
      'It is a synonym for a single Application with multiple containers',
      'It only works for Helm charts, never Kustomize or plain YAML',
      'It replaces the Argo CD API server',
    ],
    correctIndex: 0,
    explanation:
      'ApplicationSet uses generators to produce a set of parameters (e.g. one per cluster, or one per directory in a Git repo), then renders an Application template once per generated parameter set — useful for fleets of near-identical Applications across environments or clusters.',
  },
  {
    id: 'capa-12',
    question: 'In Argo Rollouts, what is a `pause` step used for in a canary strategy?',
    options: [
      'It permanently halts the rollout with no way to resume',
      'It stops progression at a given traffic weight, either indefinitely (requiring manual `argo rollouts promote`) or for a fixed duration, giving time for manual review or metrics to stabilize before continuing',
      'It only pauses log collection, not the rollout itself',
      'It is required before every single canary step with no configuration options',
    ],
    correctIndex: 1,
    explanation:
      'A `pause: {}` step (indefinite) or `pause: {duration: 5m}` (timed) stops the canary at its current traffic split until a human promotes it or the duration elapses — the manual-gate mechanism for progressive delivery.',
  },
  {
    id: 'capa-13',
    question: 'What problem does Argo CD\'s "App of Apps" pattern solve when managing dozens of microservices across multiple environments?',
    options: [
      'It reduces the number of container images needed',
      'It provides a single Git-driven entry point to bootstrap, add, or remove many child Applications at once, instead of each being managed as a fully separate, manually-created Argo CD Application',
      'It eliminates the need for RBAC across Applications',
      'It automatically merges all microservices into a single Deployment',
    ],
    correctIndex: 1,
    explanation:
      'Without app-of-apps, onboarding 50 services means creating 50 Application resources by hand (or via a separate script). App-of-apps makes that fleet itself Git-managed: adding a new Application manifest under the parent\'s watched path is enough for Argo CD to pick it up on the next sync.',
  },
  {
    id: 'capa-14',
    question: 'What does an Argo Events `EventBus` provide?',
    options: [
      'A UI for browsing Kubernetes events (`kubectl get events`)',
      'The underlying transport layer (backed by NATS or JetStream) that EventSources publish to and Sensors subscribe from, decoupling event producers from consumers',
      'A CLI tool for editing Argo Workflow YAML',
      'A replacement for the Kubernetes API server',
    ],
    correctIndex: 1,
    explanation:
      'EventBus is the messaging backbone Argo Events runs on. EventSources publish events onto it; Sensors subscribe and react — this decoupling is what lets many EventSources and Sensors compose independently without direct connections between them.',
  },
  {
    id: 'capa-15',
    question: 'A Rollout using the canary strategy fails its AnalysisTemplate check at the 50% traffic step. What is the expected default behavior?',
    options: [
      'The Rollout ignores the failed analysis and proceeds to 100% anyway',
      'The Rollout aborts and rolls back traffic to the stable (previous) version automatically, since the analysis run failed its success condition',
      'The cluster is put into maintenance mode',
      'The Rollout pauses forever with no automated action, requiring full manual intervention',
    ],
    correctIndex: 1,
    explanation:
      'This is the core value of tying AnalysisTemplates to a Rollout: a failed analysis run (metrics breaching the defined failure condition) triggers an automatic abort, shifting traffic back to the last known-good (stable) ReplicaSet without waiting for a human to notice.',
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add app/data/learning/capa-questions.ts
git commit -m "feat: add CAPA question bank (15 questions)"
```

---

### Task 6: Cert card component (hub grid)

**Files:**
- Create: `app/components/learning/cert-card.tsx`

- [ ] **Step 1: Write the component**

```tsx
// app/components/learning/cert-card.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { CertMeta } from '@/data/learning/certs'

interface CertCardProps {
  cert: CertMeta
  index: number
}

export default function CertCard({ cert, index }: CertCardProps) {
  const content = (
    <div
      className={`relative rounded-2xl border bg-card p-6 h-full overflow-hidden transition-colors duration-300 ${
        cert.available
          ? 'border-border hover:border-primary/50 group'
          : 'border-border opacity-50 pointer-events-none'
      }`}
    >
      {cert.available && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      <div className="relative z-10">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xs mb-4 ${
            cert.available
              ? 'bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-violet-500/25 text-blue-300'
              : 'bg-secondary border border-border text-muted-foreground'
          }`}
        >
          {cert.shortName}
        </div>
        <h3 className="text-lg font-bold mb-1">{cert.name}</h3>
        <p className="text-sm text-muted-foreground mb-4 min-h-[2.5rem]">{cert.description}</p>
        {cert.available ? (
          <>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-muted-foreground mb-4">
              <span>{cert.questionCount} Questions</span>
              <span>&middot;</span>
              <span>{cert.durationMinutes} Min</span>
              <span>&middot;</span>
              <span>{cert.passThreshold}% Pass</span>
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
              Start Simulator <ArrowRight className="w-4 h-4" />
            </div>
          </>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
            Coming Soon
          </span>
        )}
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      {cert.available ? <Link href={`/learning/${cert.id}`}>{content}</Link> : content}
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/learning/cert-card.tsx
git commit -m "feat: add CertCard component for learning hub grid"
```

---

### Task 7: Hub page

**Files:**
- Create: `app/app/learning/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
// app/app/learning/page.tsx
import { CERTS } from '@/data/learning/certs'
import CertCard from '@/components/learning/cert-card'
import Navigation from '@/components/layout/navigation'
import Footer from '@/components/sections/footer'

export const metadata = {
  title: 'Learning Hub | Joyson Fernandes',
  description: 'Practice for Cloud Native and GitOps certifications with interactive question simulators.',
}

export default function LearningPage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-mono font-medium tracking-widest uppercase rounded-full border border-border text-muted-foreground">
            Cert Prep
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight gradient-text mb-4">
            Learning Hub
          </h1>
          <p className="text-muted-foreground text-lg">
            Practice for Cloud Native and GitOps certifications with interactive question simulators.
          </p>
          <p className="text-xs text-muted-foreground mt-4 max-w-lg mx-auto">
            These are original practice questions based on public documentation and course
            material — not real exam questions from the CNCF or Linux Foundation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {CERTS.map((cert, i) => (
            <CertCard key={cert.id} cert={cert} index={i} />
          ))}
        </div>
      </div>
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Verify it renders**

Run: `cd app && npm run dev` then open `http://localhost:3000/learning`
Expected: Hub page shows 10 cards, CGOA and CAPA are clickable, the rest show "Coming Soon" and are not clickable

- [ ] **Step 3: Commit**

```bash
git add app/app/learning/page.tsx
git commit -m "feat: add learning hub page at /learning"
```

---

### Task 8: Question card component

**Files:**
- Create: `app/components/learning/question-card.tsx`

- [ ] **Step 1: Write the component**

```tsx
// app/components/learning/question-card.tsx
'use client'

import { Check, X } from 'lucide-react'
import type { Question } from '@/lib/learning/quiz-engine'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  selectedIndex: number | null
  submitted: boolean
  onSelect: (index: number) => void
}

const LETTERS = ['A', 'B', 'C', 'D']

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  submitted,
  onSelect,
}: QuestionCardProps) {
  const isCorrectSelection = selectedIndex === question.correctIndex

  return (
    <div className="rounded-2xl border border-border bg-card p-8">
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
        Question {questionNumber} of {totalQuestions}
      </div>
      <h2 className="text-lg font-semibold leading-relaxed mb-7">{question.question}</h2>

      <div className="space-y-2.5 mb-2">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index
          const isCorrectOption = index === question.correctIndex

          let stateClasses = 'border-border hover:border-primary/40 hover:bg-primary/5'
          if (submitted) {
            if (isCorrectOption) {
              stateClasses = 'border-emerald-500/60 bg-emerald-500/10'
            } else if (isSelected) {
              stateClasses = 'border-red-500/60 bg-red-500/10'
            } else {
              stateClasses = 'border-border opacity-40'
            }
          } else if (isSelected) {
            stateClasses = 'border-primary bg-primary/10'
          }

          return (
            <button
              key={index}
              type="button"
              disabled={submitted}
              onClick={() => onSelect(index)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-colors ${stateClasses}`}
            >
              <span
                className={`w-7 h-7 rounded-md border flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                  submitted && isCorrectOption
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : submitted && isSelected
                      ? 'bg-red-500 border-red-500 text-white'
                      : isSelected
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'bg-secondary border-border text-muted-foreground'
                }`}
              >
                {LETTERS[index]}
              </span>
              <span className="text-sm">{option}</span>
              {submitted && isCorrectOption && <Check className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0" />}
              {submitted && isSelected && !isCorrectOption && <X className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />}
            </button>
          )
        })}
      </div>

      {submitted && (
        <>
          <div
            className={`flex items-center gap-2 p-3 rounded-lg font-semibold text-sm mt-5 mb-4 ${
              isCorrectSelection
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500'
                : 'bg-red-500/10 border border-red-500/30 text-red-500'
            }`}
          >
            {isCorrectSelection
              ? '✓ Correct!'
              : `✗ Incorrect — the correct answer is ${LETTERS[question.correctIndex]}`}
          </div>
          <div className="bg-background border border-border border-l-4 border-l-primary rounded-lg p-4">
            <div className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-2">
              Explanation
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
          </div>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/learning/question-card.tsx
git commit -m "feat: add QuestionCard component with instant answer feedback"
```

---

### Task 9: Quiz results component

**Files:**
- Create: `app/components/learning/quiz-results.tsx`

- [ ] **Step 1: Write the component**

```tsx
// app/components/learning/quiz-results.tsx
'use client'

import type { Question, QuizScore } from '@/lib/learning/quiz-engine'

const LETTERS = ['A', 'B', 'C', 'D']

interface QuizResultsProps {
  questions: Question[]
  answers: Map<string, number>
  score: QuizScore
  passed: boolean
  passThreshold: number
  onRetake: () => void
}

export default function QuizResults({
  questions,
  answers,
  score,
  passed,
  passThreshold,
  onRetake,
}: QuizResultsProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-border bg-card p-8 text-center mb-8">
        <div className="text-5xl font-bold mb-2">
          {score.correct} / {score.total}
        </div>
        <div className="text-muted-foreground mb-4">{score.percent}% correct</div>
        <span
          className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
            passed
              ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
              : 'bg-red-500/10 text-red-500 border border-red-500/30'
          }`}
        >
          {passed ? 'PASS' : 'FAIL'} (needs {passThreshold}%)
        </span>
        <div className="mt-6">
          <button
            type="button"
            onClick={onRetake}
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
          >
            Retake Quiz
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-4">Review</h3>
      <div className="space-y-4">
        {questions.map((q, i) => {
          const selected = answers.get(q.id)
          const isCorrect = selected === q.correctIndex
          return (
            <div key={q.id} className="rounded-xl border border-border bg-card p-5">
              <div className="text-xs font-mono text-muted-foreground mb-2">Question {i + 1}</div>
              <p className="font-medium mb-3">{q.question}</p>
              <p className="text-sm mb-1">
                <span className="text-muted-foreground">Your answer: </span>
                <span className={isCorrect ? 'text-emerald-500' : 'text-red-500'}>
                  {selected !== undefined ? `${LETTERS[selected]}. ${q.options[selected]}` : 'Not answered'}
                </span>
              </p>
              {!isCorrect && (
                <p className="text-sm mb-3">
                  <span className="text-muted-foreground">Correct answer: </span>
                  <span className="text-emerald-500">
                    {LETTERS[q.correctIndex]}. {q.options[q.correctIndex]}
                  </span>
                </p>
              )}
              <div className="bg-background border-l-4 border-l-primary rounded-lg p-3 mt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/learning/quiz-results.tsx
git commit -m "feat: add QuizResults component with full question review"
```

---

### Task 10: Quiz page (wires everything together)

**Files:**
- Create: `app/app/learning/[certId]/page.tsx`

- [ ] **Step 1: Write the page**

```tsx
// app/app/learning/[certId]/page.tsx
'use client'

import { useState, useMemo } from 'react'
import { useParams, notFound } from 'next/navigation'
import { getCertById } from '@/data/learning/certs'
import { CGOA_QUESTIONS } from '@/data/learning/cgoa-questions'
import { CAPA_QUESTIONS } from '@/data/learning/capa-questions'
import { sampleQuestions, scoreQuiz, isPassing, type Question } from '@/lib/learning/quiz-engine'
import QuestionCard from '@/components/learning/question-card'
import QuizResults from '@/components/learning/quiz-results'
import Navigation from '@/components/layout/navigation'
import Footer from '@/components/sections/footer'

const QUESTION_BANKS: Record<string, Question[]> = {
  cgoa: CGOA_QUESTIONS,
  capa: CAPA_QUESTIONS,
}

function useQuizSession(bank: Question[], count: number) {
  const [questions] = useState<Question[]>(() => sampleQuestions(bank, count))
  const [answers, setAnswers] = useState<Map<string, number>>(new Map())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [finished, setFinished] = useState(false)

  const current = questions[currentIndex]
  const selectedIndex = answers.get(current?.id) ?? null

  function select(index: number) {
    if (submitted) return
    setAnswers((prev) => new Map(prev).set(current.id, index))
  }

  function submit() {
    if (selectedIndex === null) return
    setSubmitted(true)
  }

  function next() {
    if (currentIndex + 1 >= questions.length) {
      setFinished(true)
      return
    }
    setCurrentIndex((i) => i + 1)
    setSubmitted(false)
  }

  function retake() {
    setAnswers(new Map())
    setCurrentIndex(0)
    setSubmitted(false)
    setFinished(false)
  }

  return { questions, answers, current, currentIndex, selectedIndex, submitted, finished, select, submit, next, retake }
}

export default function QuizPage() {
  const params = useParams<{ certId: string }>()
  const cert = getCertById(params.certId)
  const bank = QUESTION_BANKS[params.certId]

  if (!cert || !cert.available || !bank) {
    notFound()
  }

  const session = useQuizSession(bank, cert.questionCount)
  const score = useMemo(
    () => scoreQuiz(session.questions, session.answers),
    [session.questions, session.answers, session.finished],
  )
  const passed = isPassing(score.percent, cert.passThreshold)

  return (
    <main className="min-h-screen">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        {session.finished ? (
          <QuizResults
            questions={session.questions}
            answers={session.answers}
            score={score}
            passed={passed}
            passThreshold={cert.passThreshold}
            onRetake={session.retake}
          />
        ) : (
          <>
            <div className="flex items-center justify-between mb-3 text-sm font-mono">
              <span>{cert.shortName} Simulator</span>
            </div>
            <div className="h-1 bg-secondary rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                style={{ width: `${((session.currentIndex + 1) / session.questions.length) * 100}%` }}
              />
            </div>
            <QuestionCard
              question={session.current}
              questionNumber={session.currentIndex + 1}
              totalQuestions={session.questions.length}
              selectedIndex={session.selectedIndex}
              submitted={session.submitted}
              onSelect={session.select}
            />
            <div className="flex justify-end mt-6">
              {session.submitted ? (
                <button
                  type="button"
                  onClick={session.next}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
                >
                  {session.currentIndex + 1 >= session.questions.length ? 'See Results' : 'Next Question →'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={session.submit}
                  disabled={session.selectedIndex === null}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40"
                >
                  Submit Answer
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </main>
  )
}
```

- [ ] **Step 2: Verify manually**

Run: `cd app && npm run dev`, open `http://localhost:3000/learning/cgoa`
Expected: quiz loads 15 shuffled questions, selecting an option highlights it, "Submit Answer" reveals correct/incorrect + explanation, "Next Question" advances, after question 15 the results screen shows score/pass-fail/full review, "Retake Quiz" starts over. Also verify `/learning/kcna` and `/learning/nonexistent` both 404.

- [ ] **Step 3: Commit**

```bash
git add "app/app/learning/[certId]/page.tsx"
git commit -m "feat: add quiz page with instant feedback and results screen"
```

---

### Task 11: Add nav link

**Files:**
- Modify: `app/components/layout/navigation.tsx:12`

- [ ] **Step 1: Add the nav item**

In `app/components/layout/navigation.tsx`, change:

```ts
const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Homelab', href: '/homelab', isPage: true },
]
```

to:

```ts
const NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Homelab', href: '/homelab', isPage: true },
  { label: 'Learning', href: '/learning', isPage: true },
]
```

- [ ] **Step 2: Verify it renders**

Run: `cd app && npm run dev`, check the nav bar (desktop and mobile menu) shows a "Learning" link that navigates to `/learning`

- [ ] **Step 3: Commit**

```bash
git add app/components/layout/navigation.tsx
git commit -m "feat: add Learning nav link"
```

---

### Task 12: Full build + test verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `cd app && npm test`
Expected: all quiz-engine tests pass

- [ ] **Step 2: Run a production build**

Run: `cd app && npm run build`
Expected: builds successfully, `/learning` and `/learning/cgoa`/`/learning/capa` appear in the route output with no type errors

- [ ] **Step 3: Push and let CI verify**

```bash
git push
```

Expected: CI's Trivy scan and build both pass (same pipeline used for the rest of the site); once merged, the dev environment auto-deploys and you can review the live Learning Hub at `dev.joysonfernandes.com/learning` before promoting to production.
