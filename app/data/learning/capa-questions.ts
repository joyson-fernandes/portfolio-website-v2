import type { Question } from '@/lib/learning/quiz-engine'

export const CAPA_QUESTIONS: Question[] = [
  {
    id: 'capa-1',
    question: "What is an Argo Workflows `Template` of type `steps` used for?",
    options: [
      'Defining a sequence of steps that run in order, where each step can itself run in parallel with others in the same step group',
      'Defining a single container that always runs alone',
      'Declaring RBAC permissions for the workflow controller',
      'Storing workflow secrets',
    ],
    correctIndex: 0,
    explanation:
      "A `steps` template defines a list of step groups executed sequentially; within a single step group (a nested array), steps run in parallel. This is Argo Workflows' way of expressing sequential-with-parallel-substeps pipelines.",
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
      "DAG templates declare tasks and their dependencies explicitly, so the controller can run any task as soon as its dependencies finish — enabling diamond-shaped or fan-out/fan-in graphs that a strictly sequential `steps` template cannot express as naturally.",
  },
  {
    id: 'capa-3',
    question: "What is the purpose of an Argo Workflows `WorkflowTemplate` (as opposed to a `Workflow`)?",
    options: [
      'It is a reusable, cluster- or namespace-scoped workflow definition that can be referenced and instantiated by multiple Workflow runs, instead of duplicating the same spec inline each time',
      'It is only used to store workflow logs',
      'It replaces the need for a workflow controller',
      'It can only be triggered manually, never by automation',
    ],
    correctIndex: 0,
    explanation:
      "A `WorkflowTemplate` is a saved, reusable workflow definition. Other Workflows can reference it (via `workflowTemplateRef`) instead of repeating the full spec, similar to how a function is defined once and called many times.",
  },
  {
    id: 'capa-4',
    question: "In Argo Rollouts, what does the `canary` strategy do that a standard Kubernetes Deployment rolling update does not?",
    options: [
      'It deletes the old ReplicaSet immediately on update',
      'It progressively shifts traffic to the new version in controlled steps (e.g. 20%, then 50%, then 100%), optionally pausing for analysis or manual approval between steps',
      'It only works with StatefulSets, not Deployments',
      'It requires no traffic-shaping mechanism at all',
    ],
    correctIndex: 1,
    explanation:
      "A standard Deployment rolling update has no concept of weighted traffic splitting or pause/analysis gates — it just replaces pods gradually. Argo Rollouts' canary strategy adds explicit, controllable steps with optional automated analysis (via AnalysisTemplates) before proceeding.",
  },
  {
    id: 'capa-5',
    question: "What is the role of an `AnalysisTemplate` in Argo Rollouts?",
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
      "Argo Events separates event production (`EventSource`) from event consumption (`Sensor`). A Sensor defines dependencies on one or more events and a trigger action (commonly submitting an Argo Workflow) that fires once those dependencies are met.",
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
      "Without this option, Argo CD sync fails if the target namespace doesn't already exist, since it won't implicitly create namespaces by default. `CreateNamespace=true` opts into having Argo CD create it as part of the sync.",
  },
  {
    id: 'capa-8',
    question: "What is the difference between Argo Rollouts' `blueGreen` and `canary` strategies?",
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
      "It deletes the workflow's namespace on completion",
    ],
    correctIndex: 1,
    explanation:
      'An `onExit` handler template runs after the main workflow DAG/steps finish, whether the outcome was Succeeded, Failed, or Error — making it the right place for guaranteed cleanup (e.g. tearing down temp resources) or sending a status notification.',
  },
  {
    id: 'capa-10',
    question: "Why would an Argo Workflows author use `artifacts` (inputs/outputs) between steps instead of just chaining shell commands in one container?",
    options: [
      "Artifacts allow passing files/data produced by one step (potentially in a different container image or even a different pod) as input to a later step, enabling multi-language, multi-tool pipelines with proper storage-backed handoff",
      'Artifacts are required for every single-step workflow',
      'Artifacts replace the need for any container images',
      'Artifacts only work within the same container, so they offer no benefit over shell chaining',
    ],
    correctIndex: 0,
    explanation:
      "Each Argo Workflows step can run in its own pod/container. Artifacts (backed by S3, GCS, or similar) let a step's output files become another step's input regardless of language or image, which plain shell chaining inside one container can't do across step boundaries.",
  },
  {
    id: 'capa-11',
    question: "What is the effect of Argo CD's `ApplicationSet` resource?",
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
    question: "In Argo Rollouts, what is a `pause` step used for in a canary strategy?",
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
      "Without app-of-apps, onboarding 50 services means creating 50 Application resources by hand (or via a separate script). App-of-apps makes that fleet itself Git-managed: adding a new Application manifest under the parent's watched path is enough for Argo CD to pick it up on the next sync.",
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
