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
  {
    id: 'capa-16',
    question: 'What is the purpose of Argo Workflows\' `retryStrategy` field on a template?',
    options: [
      'It automatically retries a failed step/task up to a configured limit, optionally with a backoff policy, instead of failing the whole workflow on the first error',
      'It controls how many times a workflow can be manually resubmitted by a user',
      'It retries only successful steps to verify idempotency',
      'It is used exclusively for retrying artifact uploads, not step execution',
    ],
    correctIndex: 0,
    explanation:
      '`retryStrategy` (with `limit` and optional `backoff`) lets a step/task retry automatically on failure — useful for transient errors like a flaky network call — instead of the whole workflow failing on the first attempt.',
  },
  {
    id: 'capa-17',
    question: 'What does a `suspend` template (or a manual suspend point) do in an Argo Workflow?',
    options: [
      'It pauses execution of the workflow, either indefinitely or for a duration, until manually resumed or the duration elapses — commonly used for manual approval gates',
      'It permanently cancels the workflow',
      'It suspends only the workflow controller, not the individual workflow',
      'It is used to pause artifact garbage collection',
    ],
    correctIndex: 0,
    explanation:
      'A suspend template halts the workflow at that point, waiting for `argo resume` (or an automatic duration timeout) before continuing — the standard way to insert a manual approval gate into an otherwise automated pipeline.',
  },
  {
    id: 'capa-18',
    question: 'In Argo Rollouts, what is a `TrafficRouting` configuration used for?',
    options: [
      'It defines which service mesh or ingress controller (e.g. Istio, NGINX, ALB, SMI) Argo Rollouts should configure to actually split live traffic between the stable and canary versions at the specified weights',
      'It only controls DNS resolution for the Rollout',
      'It is required even when no traffic splitting is needed',
      'It replaces the need for a Kubernetes Service entirely',
    ],
    correctIndex: 0,
    explanation:
      'Without a TrafficRouting integration, Argo Rollouts approximates canary weights by scaling ReplicaSet replica counts. With one configured (Istio VirtualService, NGINX Ingress annotations, ALB target groups, SMI, etc.), it precisely controls the percentage of real traffic hitting each version.',
  },
  {
    id: 'capa-19',
    question: 'What is the role of the `experiment` (Argo Rollouts `Experiment` CRD) resource?',
    options: [
      'It runs one or more short-lived ReplicaSets alongside the stable version to gather metrics or run a comparison (e.g. A/B testing) without affecting the main rollout progression, then tears them down',
      'It replaces AnalysisTemplates entirely',
      'It is only used during initial cluster setup',
      'It permanently replaces the stable version once started',
    ],
    correctIndex: 0,
    explanation:
      'An `Experiment` spins up one or more temporary ReplicaSet variants (optionally with their own AnalysisRuns) for a fixed duration to gather comparative data — useful for A/B testing or baseline-vs-candidate metric comparison — independent of a Rollout\'s main progression.',
  },
  {
    id: 'capa-20',
    question: 'What does the Argo Workflows `withItems` (or `withParam`) field enable on a template step?',
    options: [
      'Running the same template multiple times in parallel, once per item in a provided list (or dynamically generated list via withParam), effectively a fan-out loop',
      'Importing external Helm charts into a workflow',
      'Limiting a template to a single execution only',
      'Declaring the workflow\'s RBAC ServiceAccount',
    ],
    correctIndex: 0,
    explanation:
      '`withItems` (a static list) or `withParam` (a dynamically computed JSON list, often from a prior step\'s output) causes Argo Workflows to instantiate that step once per list item, running them in parallel — the standard fan-out mechanism.',
  },
  {
    id: 'capa-21',
    question: 'What is the difference between an Argo Events `EventSource` and a `Sensor`\'s `dependencies` field?',
    options: [
      'An EventSource defines where events come from (the producer); a Sensor\'s dependencies list which of those published events (and how many/which combination) it needs to see before firing its trigger',
      'They are the same concept with different YAML syntax',
      'EventSource is deprecated in favor of dependencies',
      'Dependencies define which other Sensors must run first',
    ],
    correctIndex: 0,
    explanation:
      'EventSource is the producer side (webhook, S3, calendar, etc.), publishing named events onto the EventBus. A Sensor\'s `dependencies` name which of those events it cares about, and its trigger conditions can require one, several, or all of them (via `circuit` logic) before firing.',
  },
  {
    id: 'capa-22',
    question: 'Why might a team choose Argo Rollouts\' `blueGreen` strategy specifically for a database-migration-heavy deployment, over `canary`?',
    options: [
      'Because blue-green requires no traffic routing configuration',
      'Because blue-green fully validates the new version (including running a full smoke test suite against the "preview" service) before any production traffic reaches it at all, whereas canary exposes real users to the new version from the very first step',
      'Because canary strategies cannot use AnalysisTemplates',
      'Because blue-green is faster to complete than canary in all cases',
    ],
    correctIndex: 1,
    explanation:
      'Blue-green keeps the new version fully isolated behind a preview Service until it\'s explicitly promoted, so you can run thorough validation (including a `prePromotionAnalysis`) with zero real-user exposure first — appealing when a bad deploy (e.g. a broken migration) would be costly, versus canary which by design exposes some live traffic immediately.',
  },
  {
    id: 'capa-23',
    question: 'What does Argo CD\'s `Application` `spec.source.helm.valueFiles` field do when using a Helm chart source?',
    options: [
      'It lists additional Helm values files to layer on top of the chart\'s default values.yaml during templating',
      'It defines which Kubernetes namespace the release is installed into',
      'It specifies the Helm binary version to use',
      'It is only used for OCI-based chart repositories',
    ],
    correctIndex: 0,
    explanation:
      '`valueFiles` points at one or more additional values files (often environment-specific, e.g. `values-prod.yaml`) that get merged on top of the chart\'s own defaults during `helm template` rendering, letting one chart source serve multiple environments.',
  },
  {
    id: 'capa-24',
    question: 'What is the purpose of the `analysis` step type available directly within an Argo Workflows DAG or steps template (distinct from Argo Rollouts\' own AnalysisTemplate)?',
    options: [
      'Argo Workflows has no native analysis step type — AnalysisTemplate/AnalysisRun are Argo Rollouts-specific CRDs, not part of core Argo Workflows',
      'It is identical in both projects and fully interchangeable',
      'It only exists in Argo Events',
      'It replaces the need for a workflow controller in Rollouts',
    ],
    correctIndex: 0,
    explanation:
      "This is a common point of confusion: AnalysisTemplate/AnalysisRun/Experiment are Argo Rollouts CRDs used for progressive-delivery metric checks. Argo Workflows itself has no equivalent built-in construct — the two projects share the broader Argo ecosystem but have distinct CRDs for distinct purposes.",
  },
  {
    id: 'capa-25',
    question: 'A Sensor has two dependencies (event A and event B) and its trigger `conditions` field is set to `"A && B"`. What does this mean?',
    options: [
      'The trigger fires as soon as either A or B occurs',
      'The trigger only fires once both event A and event B have occurred (within the applicable time window), not on either alone',
      'The Sensor will fail to start unless both events are pre-registered',
      'This syntax is invalid; conditions can only reference a single dependency',
    ],
    correctIndex: 1,
    explanation:
      'Sensor trigger `conditions` support boolean logic across named dependencies. `"A && B"` requires both named events to have occurred before the trigger executes, letting a Sensor wait for multiple, potentially unrelated event sources to align before acting.',
  },
  {
    id: 'capa-26',
    question: 'What does Argo CD\'s `resource.customizations` (health check) configuration allow you to do?',
    options: [
      'Define a custom Lua script to determine the Health Status of a resource kind Argo CD doesn\'t natively understand (e.g. a custom CRD), since Argo CD can\'t infer health for arbitrary resource types out of the box',
      'Change the CPU/memory resource requests applied to a Deployment',
      'Override which namespace a resource is created in',
      'Disable health checks entirely for the whole cluster',
    ],
    correctIndex: 0,
    explanation:
      'Argo CD ships built-in health logic for common Kubernetes kinds (Deployment, StatefulSet, Ingress, etc.), but has no way to know what "healthy" means for an arbitrary custom resource. `resource.customizations` lets you supply a Lua script that inspects the CR\'s status fields and returns a Health Status, so Argo CD can report meaningful health for CRDs.',
  },
  {
    id: 'capa-27',
    question: 'What is the effect of setting `activeDeadlineSeconds` on an Argo Workflow or template?',
    options: [
      'It sets a maximum runtime after which the workflow/step is forcibly terminated and marked as failed, guarding against a hung step blocking the pipeline indefinitely',
      'It delays the start of the workflow by the given number of seconds',
      'It controls how long completed workflow objects are retained before garbage collection',
      'It sets the polling interval for the workflow controller',
    ],
    correctIndex: 0,
    explanation:
      '`activeDeadlineSeconds` is a timeout: if the workflow or the specific template it\'s set on runs longer than that many seconds, Argo Workflows kills it and marks it Failed — protecting against a stuck step (e.g. a hung network call) blocking the pipeline forever.',
  },
  {
    id: 'capa-28',
    question: 'Why would an Argo CD Application use `spec.source.directory.recurse: true`?',
    options: [
      'To also apply plain Kubernetes manifest YAML files found in subdirectories of the configured path, not just files directly in it',
      'To automatically recurse into and sync every other Application in the cluster',
      'To enable automatic namespace creation',
      'It has no effect when using plain YAML manifests',
    ],
    correctIndex: 0,
    explanation:
      'By default, a directory-type Application source only picks up manifests directly in the configured `path`. `recurse: true` tells Argo CD to also walk and include YAML files in nested subdirectories.',
  },
  {
    id: 'capa-29',
    question: 'What problem does Argo Rollouts\' `scaleDownDelaySeconds` (on the old/stable ReplicaSet during blue-green) solve?',
    options: [
      'It keeps the previous stable ReplicaSet running for a grace period after promotion instead of scaling it to zero immediately, so an instant rollback (by re-pointing the active Service) is still possible without a cold start',
      'It delays how long it takes for the new version to receive its first request',
      'It controls how quickly the canary weight increases between steps',
      'It has no functional purpose beyond logging',
    ],
    correctIndex: 0,
    explanation:
      'Without this delay, the old ReplicaSet would scale to zero the moment the new version is promoted, meaning a rollback would need to cold-start pods again. `scaleDownDelaySeconds` keeps the previous version warm for a window after cutover, so reverting the active Service selector is an instant, low-risk operation.',
  },
  {
    id: 'capa-30',
    question: 'What does Argo Events\' `filter` field on an EventSource or Sensor dependency do?',
    options: [
      'It rejects/accepts incoming events based on conditions applied to the event payload (e.g. only accept a webhook event if a specific JSON field matches a value), before the event reaches the trigger logic',
      'It controls network firewall rules for the EventBus',
      'It filters which Kubernetes namespaces the Sensor can create resources in',
      'It is only used to filter which users can view the EventSource in the UI',
    ],
    correctIndex: 0,
    explanation:
      "Filters let you inspect the actual event body/context (e.g. a GitHub webhook payload) and only let matching events through — for example, only triggering a workflow when a webhook's payload shows the push was to the `main` branch, ignoring pushes to other branches.",
  },
]
