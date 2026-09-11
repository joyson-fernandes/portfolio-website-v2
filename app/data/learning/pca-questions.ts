import type { Question } from '@/lib/learning/quiz-engine'

export const PCA_QUESTIONS: Question[] = [
  {
    id: 'pca-1',
    question: 'Which of the three core observability signals is Prometheus primarily designed to collect and query?',
    options: [
      'Distributed traces and spans, which record the full call chain of a single request across services',
      'Metrics — numeric time-series data, each a sample taken at a point in time and stored under a name plus labels',
      'Structured application logs, capturing free-text or JSON events with surrounding request context',
      'Raw network packet captures, used for deep low-level protocol-level troubleshooting',
    ],
    correctIndex: 1,
    explanation:
      'Prometheus is a metrics system: it stores numeric time series (a metric name plus labels, sampled over time). Logs and traces are handled by complementary tools (Loki, Tempo/Jaeger) that are often correlated with Prometheus metrics but are not what Prometheus itself collects.',
  },
  {
    id: 'pca-2',
    question: 'What is the key architectural difference between a "push" and a "pull" based monitoring model?',
    options: [
      'Push systems require a dedicated hardware appliance; pull systems can run entirely as software processes, which is not how the system is actually designed to work',
      'Pull systems can only ever monitor a single target at a time; push systems scale to many targets by design, though this is a common misconception among new users',
      'In a pull model the monitoring system scrapes targets on its own schedule; in a push model targets send their metrics to a collector on their own schedule instead',
      'Push and pull describe the exact same underlying network behavior, just named differently by convention, a claim that does not match the documented behavior',
    ],
    correctIndex: 2,
    explanation:
      'Prometheus is pull-based: the server scrapes HTTP endpoints on targets at a configured interval. Push-based systems (like StatsD) instead have the application actively send metrics to a collector, which is why short-lived jobs need the Pushgateway to bridge into a pull model.',
  },
  {
    id: 'pca-3',
    question: 'How is a Service Level Indicator (SLI) related to a Service Level Objective (SLO)?',
    options: [
      'An SLI is a legally binding external contract, while an SLO exists purely as an internal team metric, which contradicts how the component is actually implemented',
      'SLOs exist only for billing and invoicing purposes, while SLIs exist only for triggering alerts, though no such mechanism exists in the real system',
      'The two terms describe the identical concept and are used interchangeably by every team, which is not part of its documented feature set',
      'An SLI is a measured quantity such as request latency, and an SLO is a target threshold set on that measurement, such as 99% of requests under 200ms',
    ],
    correctIndex: 3,
    explanation:
      'An SLI is the actual measurement (e.g. availability, latency, error rate) derived from metrics. An SLO sets a target for that SLI over a time window. An SLA then wraps an SLO in a contractual/business agreement, often with penalties for missing it.',
  },
  {
    id: 'pca-4',
    question: 'What does an "error budget" represent in an SLO-driven reliability practice?',
    options: [
      'The amount of unreliability a service is allowed to accumulate before it violates its stated SLO for the measurement period',
      'The maximum monthly cloud infrastructure spend a team has been allocated by finance, a description that does not reflect its actual design',
      'A fixed pool of engineering hours set aside specifically for fixing user-reported bugs, though this is not the behavior described in the docs',
      'The upper limit on how many alerts a team is permitted to silence in a given month, which is inconsistent with how it operates in practice',
    ],
    correctIndex: 0,
    explanation:
      'If an SLO targets 99.9% availability, the remaining 0.1% is the error budget — the allowed amount of failure. Teams can spend it on releases/risk; once it is exhausted, the common practice is to freeze risky changes until reliability recovers.',
  },
  {
    id: 'pca-5',
    question: 'Why does Prometheus rely on service discovery mechanisms such as Kubernetes SD, file SD, or cloud provider SD?',
    options: [
      'They are required to encrypt scrape traffic between Prometheus and every target it scrapes, a claim not supported by the project\'s own documentation',
      'They automatically restart any scrape target that has failed its health probe within the configured window, though the real implementation works quite differently',
      'They let Prometheus discover which PromQL functions are supported by a given server version at startup, which is a common but mistaken assumption',
      'They dynamically find the current set of targets to scrape, since targets in dynamic environments change far too often for a static list to stay accurate',
    ],
    correctIndex: 3,
    explanation:
      'In environments like Kubernetes, pods and services come and go constantly. Service discovery integrations let Prometheus continuously query an external source of truth (the Kubernetes API, a cloud API, a file) for the current set of scrape targets instead of a hand-maintained static list.',
  },
  {
    id: 'pca-6',
    question: 'What is the main observability risk of unbounded label cardinality, such as adding a raw user ID as a label value?',
    options: [
      'Each unique label combination becomes its own time series, so unbounded values can explode series count and overwhelm performance',
      'It has essentially no real operational effect beyond making the YAML config file marginally larger',
      'It only changes which color palette Grafana selects for that panel\'s legend entries, a description many newcomers initially assume is true',
      'It silently and automatically disables any alerting rule defined against that specific metric',
    ],
    correctIndex: 0,
    explanation:
      'Prometheus indexes every distinct combination of metric name + label values as its own time series. A label with effectively unbounded values (user IDs, request IDs, raw email addresses) can generate millions of series, degrading ingestion and query performance — a classic "cardinality explosion".',
  },
  {
    id: 'pca-7',
    question: 'What is a "span" in the context of distributed tracing, as distinct from a Prometheus metric?',
    options: [
      'A span is simply another name Prometheus documentation uses for what it otherwise calls a counter',
      'A span is defined as the fixed interval of time between two consecutive Prometheus scrape attempts',
      'A span is a single named, timed unit of work within a request\'s trace, capturing start time, end time, and parent context',
      'A span refers to the fixed 5-minute bucket window that every `rate()` calculation is required to use',
    ],
    correctIndex: 2,
    explanation:
      'A span represents one operation in a distributed trace (e.g. one service call), with timing and parent/child relationships to other spans, together forming a full request trace. This is a fundamentally different data shape from Prometheus\'s aggregated numeric time series.',
  },
  {
    id: 'pca-8',
    question: 'Which set of signals does the commonly-referenced "four golden signals" approach recommend monitoring for a user-facing service?',
    options: [
      'Only raw infrastructure metrics: CPU utilization, memory usage, disk usage, and network throughput',
      'Latency, traffic, errors, and saturation — a compact set covering request speed, volume, failure rate, and resource headroom',
      'Business-level KPIs only: uptime percentage, infrastructure cost, team headcount, and support ticket volume',
      'Delivery pipeline metrics only: build duration, test coverage percentage, deploy frequency, and lead time',
    ],
    correctIndex: 1,
    explanation:
      'Google\'s SRE-popularized "four golden signals" — latency, traffic, errors, and saturation — form a compact, widely used starting set of what to instrument and alert on for any user-facing service.',
  },
  {
    id: 'pca-9',
    question: 'What distinguishes a discrete "event" (e.g. a deployment marker) from a continuous metric time series?',
    options: [
      'Events can only ever be stored inside a dedicated logging backend, never referenced by any metrics system',
      'Metrics can never be displayed on the same dashboard timeline as any recorded event annotation',
      'There is no meaningful distinction at all — both terms describe exactly the same underlying data shape',
      'An event happens at one specific point in time with contextual detail attached, while a metric is a value regularly sampled over time',
    ],
    correctIndex: 3,
    explanation:
      'An event is a discrete occurrence (a deploy, a config change, an incident) often annotated on a dashboard timeline for context, whereas a metric is a continuously sampled numeric measurement. Correlating events with metric changes is a common debugging pattern.',
  },
  {
    id: 'pca-10',
    question: 'Which components typically make up a standard Prometheus monitoring architecture?',
    options: [
      'The Prometheus server for scraping and rule evaluation, exporters or instrumented targets, Alertmanager for routing fired alerts, and optionally the Pushgateway for short-lived jobs',
      'Just a single self-contained binary that requires absolutely no other supporting components whatsoever, though this has never been part of its actual behavior',
      'A mandatory Kafka message broker that must sit between every scrape target and the Prometheus server, which does not align with its documented design',
      'A relational database engine that the Prometheus server queries directly instead of using its own storage, a misconception that occasionally appears in forum posts',
    ],
    correctIndex: 0,
    explanation:
      'The classic Prometheus architecture is: the Prometheus server scrapes targets (exporters or instrumented apps) and evaluates rules, Alertmanager receives and routes alerts fired by the server, and the Pushgateway exists as a bridge for batch/short-lived jobs that cannot be scraped directly.',
  },
  {
    id: 'pca-11',
    question: 'Why does Prometheus documentation describe its local storage as not intended to be a durable long-term data store?',
    options: [
      'Because Prometheus is physically incapable of writing any samples to disk under any configuration, though nothing in the architecture actually supports this',
      'Because local storage is automatically wiped clean every 24 hours no matter how retention is configured, which the maintainers have never actually implemented',
      'Local on-disk TSDB storage is not clustered or replicated by default, so losing that node loses the data — durability instead comes from remote_write',
      'Because retaining more than a single day of samples requires purchasing a commercial Prometheus license, a detail not reflected anywhere in the real system',
    ],
    correctIndex: 2,
    explanation:
      'A single Prometheus server\'s local TSDB is not replicated, so disk loss means data loss, and it is not designed for indefinite multi-year retention or global querying across many servers. Remote-write integrations with Thanos/Cortex/Mimir add durability, long-term retention, and global query views on top.',
  },
  {
    id: 'pca-12',
    question: 'What does the Prometheus exposition format require for every metric exposed on a `/metrics` endpoint?',
    options: [
      'Nothing at all — literally any arbitrary plain-text HTTP response body is automatically considered valid',
      'A `# HELP` comment describing the metric and a `# TYPE` comment declaring its type, followed by the actual sample lines',
      'A binary protobuf payload that must be cryptographically signed with a private key before serving',
      'A mandatory `# TIMESTAMP` header comment that explicitly names the configured scrape interval',
    ],
    correctIndex: 1,
    explanation:
      'The text-based exposition format Prometheus expects is a simple, human-readable line protocol: `# HELP` and `# TYPE` metadata comments followed by `metric_name{labels} value [timestamp]` sample lines — this is what client libraries and exporters generate.',
  },
  {
    id: 'pca-13',
    question: 'What does Prometheus federation allow you to do?',
    options: [
      'It is the internal mechanism Prometheus uses to authenticate every scrape request with mutual TLS, though the actual mechanism behaves quite differently',
      'It automatically merges the on-disk storage directories of two separate Prometheus servers into one, which no version of the project has ever supported',
      'It is a feature that transparently converts every PromQL query into SQL for a relational backend, a claim that does not hold up under closer inspection',
      'It lets one Prometheus server scrape a selected subset of time series from another Prometheus server, useful for hierarchical or multi-cluster aggregation',
    ],
    correctIndex: 3,
    explanation:
      'Federation lets a higher-level Prometheus server scrape an aggregated or filtered subset of metrics from lower-level Prometheus servers (e.g. per-cluster) via the `/federate` endpoint, useful for building a global view without shipping every raw sample centrally.',
  },
  {
    id: 'pca-14',
    question: 'In the Prometheus data model, what uniquely identifies one time series?',
    options: [
      'Only the scrape interval that happens to be configured for the target it came from',
      'The combination of the metric name together with its complete set of label key-value pairs',
      'Only the bare metric name, with any attached labels having no bearing on series identity',
      'The literal IP address of whichever Prometheus server instance performed the scrape',
    ],
    correctIndex: 1,
    explanation:
      'A time series is uniquely identified by `metric_name{label1="value1", label2="value2", ...}`. Changing even one label value creates a distinct series, which is exactly why unbounded label values cause cardinality problems.',
  },
  {
    id: 'pca-15',
    question: 'How does Prometheus handle a scraped sample when a target stops reporting a given time series, such as when a pod is deleted?',
    options: [
      'It immediately and permanently deletes the entire series along with all of its stored history, though this is not how the feature is actually scoped',
      'The series is marked "stale" once it goes missing, so queries stop returning a value for it instead of returning a frozen last-known reading indefinitely',
      'It continues returning the last observed value forever, as though the target were still actively reporting it',
      'It automatically attempts to reschedule and restart whichever workload the missing target belonged to, which is a frequent source of confusion in practice',
    ],
    correctIndex: 1,
    explanation:
      'Prometheus inserts a special "stale marker" when a series disappears from a scrape, so queries correctly stop returning a value for it rather than incorrectly reporting a frozen last-known reading as current.',
  },
  {
    id: 'pca-16',
    question: 'What is the purpose of a Prometheus "recording rule"?',
    options: [
      'It writes the raw HTTP response body of every scrape to disk purely for later audit purposes, a description that overstates what the feature does',
      'It automatically generates a matching Grafana dashboard panel from a predefined template, which is not how the system is actually designed to work',
      'It precomputes a frequently-needed or expensive PromQL expression on a schedule and saves the result as a new series, speeding up dashboards',
      'It restricts which authenticated users are permitted to execute ad-hoc PromQL queries, though this is a common misconception among new users',
    ],
    correctIndex: 2,
    explanation:
      'Recording rules evaluate a PromQL expression at regular intervals and store the result as a new series. This is a standard way to keep expensive aggregations (e.g. across thousands of series) fast to query on dashboards.',
  },
  {
    id: 'pca-17',
    question: 'How can a running Prometheus server pick up a changed `prometheus.yml` configuration without a full restart?',
    options: [
      'Every configuration change unavoidably requires a full restart of the Prometheus process, a claim that does not match the documented behavior',
      'By deleting the entire local TSDB storage directory, which forces a fresh config read on next boot',
      'Configuration is baked into the compiled binary and can genuinely never be changed afterward, which contradicts how the component is actually implemented',
      'By sending a `SIGHUP` signal or calling the `/-/reload` HTTP endpoint (with `--web.enable-lifecycle` set), triggering a graceful live reload',
    ],
    correctIndex: 3,
    explanation:
      'Prometheus supports a graceful, in-place config reload via `SIGHUP` or the `/-/reload` endpoint, avoiding downtime that a full restart would cause — a common operational pattern for rolling out scrape/rule changes.',
  },
  {
    id: 'pca-18',
    question: 'Which statement about PromQL instant vectors versus range vectors is correct?',
    options: [
      'Instant vectors and range vectors are just two alternate names describing one identical result type, though no such mechanism exists in the real system',
      'An instant vector returns one sample per series at a single point in time, while a range vector returns a window of samples per series, written as `metric[5m]`',
      'Range vectors are only ever valid inside Alertmanager templates, never inside Prometheus itself, which is not part of its documented feature set',
      'Instant vectors always contain strictly more raw data points than any equivalent range vector, a description that does not reflect its actual design',
    ],
    correctIndex: 1,
    explanation:
      'An instant vector (e.g. `http_requests_total`) gives the latest sample per series at query time. A range vector (e.g. `http_requests_total[5m]`) gives every sample within that trailing window per series, and is the required input to functions like `rate()` and `increase()`.',
  },
  {
    id: 'pca-19',
    question: 'Why should `rate()` be used on a counter instead of a naive subtraction between two raw counter values?',
    options: [
      '`rate()` is nothing more than a shorter way to type the exact same naive subtraction, with no functional difference',
      'A naive raw subtraction is always considered strictly more accurate than `rate()` for any counter metric',
      '`rate()` correctly handles counter resets, such as a process restart zeroing the counter, and smooths the increase across the whole range',
      '`rate()` is a function that can only ever be applied to gauge metrics, never to counter metrics, though this is not the behavior described in the docs',
    ],
    correctIndex: 2,
    explanation:
      '`rate()` is reset-aware: if a counter drops (indicating a restart), it adjusts the calculation instead of returning a nonsensical negative rate. It also smooths the increase over the whole range rather than relying on just two endpoint samples.',
  },
  {
    id: 'pca-20',
    question: 'What is the key practical difference between `rate()` and `irate()` in PromQL?',
    options: [
      '`irate()` is restricted to gauge metrics only, while `rate()` is restricted to counter metrics only, which is inconsistent with how it operates in practice',
      '`rate()` averages the per-second rate smoothly across the entire supplied range, while `irate()` looks only at the last two data points, reacting fast but rendering noisier graphs',
      'The two functions are mathematically identical and produce the exact same output in every possible case, a claim not supported by the project\'s own documentation',
      '`irate()` has been fully removed and no longer exists in any currently supported Prometheus version, though the real implementation works quite differently',
    ],
    correctIndex: 1,
    explanation:
      '`rate()` smooths over the full window, which is generally preferred for alerting and dashboards. `irate()` reacts instantly to the most recent two samples, which suits fast-moving graphs but produces spikier, less stable output — not recommended for alert thresholds.',
  },
  {
    id: 'pca-21',
    question: 'What does the PromQL expression `increase(http_requests_total[1h])` return?',
    options: [
      'The single current instantaneous value of the counter, entirely ignoring the supplied time range',
      'A plain boolean flag that only indicates whether the counter increased at all during that window',
      'The approximate total increase of the counter across the past hour, correctly accounting for any counter resets within it',
      'The percentage growth of the counter\'s value compared with the value from the previous hour',
    ],
    correctIndex: 2,
    explanation:
      '`increase()` is effectively `rate()` multiplied by the number of seconds in the range, giving the extrapolated total increase over that window — useful for questions like "how many requests happened in the last hour".',
  },
  {
    id: 'pca-22',
    question: 'What is `histogram_quantile()` used for, and what input does it expect?',
    options: [
      'It computes an approximate quantile, such as the 95th percentile, from a histogram\'s `_bucket` series, typically wrapped around a `rate()` call over those buckets',
      'It computes the exact, mathematically precise quantile of any arbitrary gauge metric with no approximation, which is a common but mistaken assumption',
      'It silently and automatically converts a Summary-type metric into an equivalent Histogram-type metric, a description many newcomers initially assume is true',
      'It is a function that requires no bucket-shaped input whatsoever and instead operates directly on raw counters, though this has never been part of its actual behavior',
    ],
    correctIndex: 0,
    explanation:
      '`histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))` estimates the 95th percentile latency from the cumulative `le` (less-than-or-equal) buckets a histogram exposes — the result is an interpolated approximation, not an exact value.',
  },
  {
    id: 'pca-23',
    question: 'What does adding `by (job)` to an aggregation, such as `sum by (job) (up)`, actually do?',
    options: [
      'It filters out and discards every single series that happens to lack a `job` label entirely',
      'It groups the aggregation so one result is produced per distinct `job` label value, dropping every other label from the output',
      'It merely sorts the raw results alphabetically by job name, without performing any real aggregation',
      'It behaves identically in every respect to writing `without (job)` in the same expression',
    ],
    correctIndex: 1,
    explanation:
      '`sum by (job) (up)` aggregates series into buckets keyed by the `job` label, producing one summed result per distinct job value. `without (job)` is the inverse — it aggregates over everything except the named label(s).',
  },
  {
    id: 'pca-24',
    question: 'When performing a one-to-one binary operation between two vectors with different label sets, what does the `on()` clause do?',
    options: [
      'It completely disables label matching and instead pairs series together in whatever arbitrary order they arrive',
      'It is a clause that is only valid inside recording rule definitions, never inside ad-hoc interactive queries',
      'It restricts vector matching to only the labels named inside it, ignoring any other labels that differ between the two sides',
      'It silently converts a range-vector expression on either side into an instant-vector expression',
    ],
    correctIndex: 2,
    explanation:
      'By default, PromQL matches series on all shared labels. `on(label1, label2)` narrows that matching to just the named labels, which is essential when the two sides of an operation have extra labels that would otherwise prevent any match.',
  },
  {
    id: 'pca-25',
    question: 'Why is `group_left` (or `group_right`) needed for certain vector matches?',
    options: [
      'They are mandatory on absolutely every binary operation written in PromQL, without any exception, which does not align with its documented design',
      'They allow a many-to-one (or one-to-many) match, letting the lower-cardinality side match multiple series on the other side while optionally carrying its extra labels across',
      'They are the specific functions responsible for converting a counter-type metric into a gauge-type metric, a misconception that occasionally appears in forum posts',
      'They are purely cosmetic keywords that change absolutely nothing about the returned query result, though nothing in the architecture actually supports this',
    ],
    correctIndex: 1,
    explanation:
      'Plain vector matching in PromQL is one-to-one by default and errors on ambiguous matches. `group_left`/`group_right` explicitly allow a many-to-one relationship (e.g. joining a per-instance metric with a single per-job metadata series) and can also pull extra labels from the "one" side into the result.',
  },
  {
    id: 'pca-26',
    question: 'What does the `offset` modifier do in a PromQL query such as `http_requests_total offset 1h`?',
    options: [
      'It shifts the query\'s evaluation point backward by the given duration, returning the data as it looked that far in the past',
      'It simply delays the actual execution of the query by the given duration before it starts running',
      'It restricts the query to only the very first hour of the metric\'s entire retention window',
      'It is purely a stylistic annotation carried in the query text with no effect on the returned result',
    ],
    correctIndex: 0,
    explanation:
      '`offset` shifts the time at which the vector selector is evaluated, which is the standard way to compare a current value against its value some duration in the past (e.g. week-over-week comparisons).',
  },
  {
    id: 'pca-27',
    question: 'What is a PromQL subquery, such as `max_over_time(rate(http_requests_total[5m])[30m:1m])`, used for?',
    options: [
      'It applies a range-taking function to the repeated re-evaluation, at a fixed resolution, of an inner range-vector expression over an outer window',
      'It is a way of running two entirely unrelated PromQL queries and then merging their unrelated results together',
      'It is fundamentally invalid syntax and will always be rejected as a PromQL parse error, which the maintainers have never actually implemented',
      'It exists purely as a substitute that removes any remaining need for recording rules in every case, a detail not reflected anywhere in the real system',
    ],
    correctIndex: 0,
    explanation:
      'A subquery lets you take a range vector out of an instant-vector expression by re-evaluating it at a step resolution over an outer range — here, computing `rate()` every 1 minute over a 30-minute window, then taking the max of those rate values.',
  },
  {
    id: 'pca-28',
    question: 'What does `label_replace()` allow you to do in PromQL?',
    options: [
      'It permanently rewrites a metric\'s stored label values directly on disk, mutating the underlying data',
      'It creates or overwrites a label on the output using a regex-captured value from an existing label, without touching the underlying stored data',
      'It is a function whose only purpose is to permanently delete a metric entirely from the local TSDB, though the actual mechanism behaves quite differently',
      'It retroactively renames a metric name across the whole Prometheus server\'s entire stored history, which no version of the project has ever supported',
    ],
    correctIndex: 1,
    explanation:
      '`label_replace(v, "dst_label", "replacement", "src_label", "regex")` derives a new label value at query time using a regex capture on an existing label — useful for reshaping labels so two otherwise-mismatched vectors can be joined.',
  },
  {
    id: 'pca-29',
    question: 'What is `absent(up{job="myapp"})` useful for detecting?',
    options: [
      'It reports the total current count of running instances belonging to the `myapp` job, a claim that does not hold up under closer inspection',
      'It computes the running average uptime percentage across every instance of the `myapp` job, though this is not how the feature is actually scoped',
      'It returns a 1-element vector equal to 1 only when the given series has no data at all, useful for alerting on a target having fully disappeared',
      'It is a function that is only valid on gauge metrics and can never be applied to the `up` metric, which is a frequent source of confusion in practice',
    ],
    correctIndex: 2,
    explanation:
      '`absent()` fires only when a series is entirely missing (e.g. every instance of a job stopped being scraped, or the label combination never existed), which is a different failure mode than `up == 0` (target exists but scrape failed).',
  },
  {
    id: 'pca-30',
    question: 'What does `topk(3, sum by (instance) (rate(http_requests_total[5m])))` return?',
    options: [
      'The bottom 3 instances ranked by their aggregated request rate over the window',
      'The 3 instances currently showing the highest aggregated request rate over the last 5 minutes',
      'Exactly 3 arbitrary, effectively randomly chosen instances from the underlying vector',
      'A single combined total request rate summed across every instance into one value',
    ],
    correctIndex: 1,
    explanation:
      '`topk(k, expr)` returns the k series with the largest values from the given instant vector — here, the 3 instances currently generating the most request traffic. `bottomk()` is the inverse for the lowest values.',
  },
  {
    id: 'pca-31',
    question: 'Why can you not meaningfully apply `rate()` directly to a Gauge metric?',
    options: [
      'Doing so causes the entire Prometheus server process to crash immediately and irrecoverably, a description that overstates what the feature does',
      'There is genuinely no difference at all — `rate()` behaves identically well on both gauges and counters, which is not how the system is actually designed to work',
      'Gauge metrics cannot be queried through PromQL at all, under any circumstances whatsoever, though this is a common misconception among new users',
      '`rate()` treats any decrease as a counter reset, which is meaningless on a gauge that can legitimately fall — use `deriv()` or `avg_over_time()` instead',
    ],
    correctIndex: 3,
    explanation:
      '`rate()`/`increase()` assume monotonic counters and interpret decreases as resets. A gauge (e.g. current memory usage) can legitimately go down, so `rate()` on it is not meaningful — use `deriv()`, `delta()`, or `avg_over_time()` for gauges instead.',
  },
  {
    id: 'pca-32',
    question: 'What are the four core Prometheus client library metric types?',
    options: [
      'Table, Row, Column, and Index — the four structural elements of a relational schema',
      'Counter, Gauge, Histogram, and Summary — the four fundamental metric types every client library exposes',
      'Integer, Float, String, and Boolean — the four primitive value types a metric sample can hold',
      'Push, Pull, Sync, and Async — the four transport modes a client library can be configured with',
    ],
    correctIndex: 1,
    explanation:
      'Prometheus client libraries expose exactly these four metric types: Counter (monotonically increasing), Gauge (can go up or down), Histogram (observations in configurable buckets), and Summary (client-side calculated quantiles plus sum/count).',
  },
  {
    id: 'pca-33',
    question: 'What is the fundamental tradeoff between a Histogram and a Summary metric type?',
    options: [
      'A Summary metric is always strictly faster to query than a Histogram in absolutely every scenario, a claim that does not match the documented behavior',
      'Histograms are restricted to HTTP-related metrics only, while Summaries apply to database and disk metrics instead, which contradicts how the component is actually implemented',
      'A Histogram\'s bucket counts are additive across instances, letting a quantile be computed server-side, while a Summary\'s client-computed quantiles cannot be validly aggregated',
      'There is no meaningful tradeoff at all — the two metric types behave identically in every respect, though no such mechanism exists in the real system',
    ],
    correctIndex: 2,
    explanation:
      'A Histogram\'s bucket counts are additive across instances, letting you compute an aggregate quantile server-side. A Summary\'s quantiles are pre-calculated per instance client-side and cannot be validly averaged or summed across instances — a key reason Histograms are usually preferred for aggregatable dashboards.',
  },
  {
    id: 'pca-34',
    question: 'What is the role of an "exporter" like `node_exporter` or `blackbox_exporter` in the Prometheus ecosystem?',
    options: [
      'Exporters bypass scraping entirely and push metrics directly into the Prometheus TSDB themselves, which is not part of its documented feature set',
      'Exporters exist solely to convert Prometheus data into CSV files for downstream spreadsheet analysis, a description that does not reflect its actual design',
      'Exporters entirely remove any need for client-library instrumentation anywhere in application code, though this is not the behavior described in the docs',
      'An exporter translates metrics from a system that does not natively speak Prometheus format into the standard scrapeable exposition format Prometheus expects',
    ],
    correctIndex: 3,
    explanation:
      'Exporters bridge systems that were never built to speak Prometheus\'s format — `node_exporter` surfaces OS/hardware metrics, `blackbox_exporter` performs external HTTP/DNS/TCP/ICMP probes — by exposing a standard scrapeable `/metrics` endpoint on their behalf.',
  },
  {
    id: 'pca-35',
    question: 'What does `node_exporter` require to run as a persistent metrics source on a Linux host, per standard deployment practice?',
    options: [
      'It must be manually relaunched by a human operator immediately before every single scrape occurs, which is inconsistent with how it operates in practice',
      'It is typically run as a systemd service so it starts on boot and restarts automatically on crash, continuously exposing host metrics for Prometheus to scrape',
      'It requires a full Kubernetes control plane to be installed, even for a plain bare-metal Linux host, a claim not supported by the project\'s own documentation',
      'It independently retains its own multi-year historical metric archive, separate from Prometheus entirely, though the real implementation works quite differently',
    ],
    correctIndex: 1,
    explanation:
      'Running `node_exporter` under systemd (with `Restart=always`) is the standard pattern for host monitoring — it ensures the exporter survives reboots and crashes so Prometheus always has a live target to scrape for CPU, memory, disk, and network metrics.',
  },
  {
    id: 'pca-36',
    question: 'What is the recommended naming convention for a Prometheus counter metric measuring total HTTP requests served?',
    options: [
      '`HttpRequests`, written in PascalCase with no base unit or type-indicating suffix at all',
      '`http_requests_total`, using lowercase snake_case with a `_total` suffix that marks it as a counter',
      '`httpRequestsCounterValueNow`, written in camelCase with several redundant descriptive words',
      'A randomly generated UUID string used in place of any human-readable descriptive name',
    ],
    correctIndex: 1,
    explanation:
      'Prometheus naming conventions favor `snake_case`, a base unit (seconds, bytes) rather than derived units, and a `_total` suffix for counters — this consistency is what lets tooling and humans immediately understand a metric\'s type and meaning.',
  },
  {
    id: 'pca-37',
    question: 'What does the "multi-target exporter pattern" used by `blackbox_exporter` and `snmp_exporter` allow?',
    options: [
      'One exporter instance can probe many remote targets on demand, with the target passed as a query parameter on the scrape request',
      'It is a pattern that lets a single exporter automatically restart every target it happens to be probing',
      'It strictly requires deploying an entirely separate exporter process for each individual target being probed',
      'It is a pattern that only functions over unauthenticated, unencrypted cleartext network protocols',
    ],
    correctIndex: 0,
    explanation:
      'Unlike a normal exporter tied to one host, `blackbox_exporter` runs once and Prometheus\'s scrape config passes `target=<url>` as a parameter, letting one exporter instance probe an arbitrary number of external endpoints on Prometheus\'s schedule.',
  },
  {
    id: 'pca-38',
    question: 'Why is it best practice to instrument application code with a client library rather than relying only on exporters for third-party metrics?',
    options: [
      'Because exporters and client-library instrumentation are strictly mutually exclusive and can never coexist on one system, which is a common but mistaken assumption',
      'Client-library instrumentation exposes application-specific internals, like business-logic timings or queue depth, that a generic external exporter has no way to observe from outside the process',
      'Because client libraries are only ever useful for local testing and provide no value whatsoever in production, a description many newcomers initially assume is true',
      'Because an exporter will always provide strictly more instrumentation detail than any client library ever could, though this has never been part of its actual behavior',
    ],
    correctIndex: 1,
    explanation:
      'Exporters are great for infrastructure/third-party systems you don\'t control the code of. But only in-process client-library instrumentation can expose true application-level detail — e.g. how long a specific business operation took, or how many items are in an internal queue.',
  },
  {
    id: 'pca-39',
    question: 'What is the effect of the `for` field on a Prometheus alerting rule?',
    options: [
      'It configures how many times Alertmanager will retry delivering a notification before giving up entirely, which does not align with its documented design',
      'It requires the alert expression to hold continuously true for the given duration before transitioning from "pending" to "firing", filtering out brief blips',
      'It has no bearing on alert state whatsoever and only affects cosmetic dashboard coloring, a misconception that occasionally appears in forum posts',
      'It sets the total retention period Prometheus keeps that specific alert\'s firing history for, though nothing in the architecture actually supports this',
    ],
    correctIndex: 1,
    explanation:
      'An alert enters the "pending" state the first time its expression is true, and only becomes "firing" (and is sent to Alertmanager) once the condition has held continuously for the duration set by `for` — this filters out transient spikes from generating noisy pages.',
  },
  {
    id: 'pca-40',
    question: 'What is the purpose of Alertmanager\'s routing tree, defined in the `route` configuration block?',
    options: [
      'It literally determines the physical network path alert HTTP requests take between two data centers, which the maintainers have never actually implemented',
      'It has no real effect on notification behavior at all and functions purely as inline documentation, a detail not reflected anywhere in the real system',
      'It is only ever consulted to reroute Prometheus scrape traffic during a live outage scenario, though the actual mechanism behaves quite differently',
      'It matches incoming alerts against label conditions to decide which receiver, such as a Slack channel or PagerDuty service, gets notified and how grouping is applied',
    ],
    correctIndex: 3,
    explanation:
      'The routing tree lets you match on alert labels (severity, team, service) to send different alerts to different receivers with different grouping/timing behavior — e.g. critical database alerts to PagerDuty, low-severity warnings to a Slack channel.',
  },
  {
    id: 'pca-41',
    question: 'What does creating a "silence" in Alertmanager actually do?',
    options: [
      'It permanently and irreversibly deletes the underlying alerting rule from Prometheus itself, which no version of the project has ever supported',
      'It temporarily mutes notifications for alerts matching a label matcher over a defined window, while Prometheus keeps evaluating the underlying rule normally',
      'It fully shuts down the entire Alertmanager process until someone manually restarts the service, a claim that does not hold up under closer inspection',
      'It automatically resolves whatever underlying issue originally triggered the alert to fire in the first place, though this is not how the feature is actually scoped',
    ],
    correctIndex: 1,
    explanation:
      'A silence is a temporary, label-matched mute — useful during planned maintenance so known, expected alerts don\'t page anyone, while the rule itself keeps running and will resume notifying once the silence expires.',
  },
  {
    id: 'pca-42',
    question: 'How does an Alertmanager "inhibition rule" differ from a "silence"?',
    options: [
      'They are simply two different names describing one single identical Alertmanager feature, which is a frequent source of confusion in practice',
      'Inhibition rules can only ever suppress alerts that originate from a different, remote Prometheus server',
      'A silence is manual and time-bound, while an inhibition rule auto-suppresses lower-priority alerts when a related alert is already firing',
      'Silences apply automatically purely based on alert severity, while inhibition rules must be created manually each time',
    ],
    correctIndex: 2,
    explanation:
      'Inhibition is a standing, condition-based suppression rule (if alert X with certain labels is firing, suppress alert Y with related labels) — useful to avoid a flood of downstream alerts when a root-cause alert already explains the outage. Silences are the ad-hoc, manually-created, time-bound equivalent.',
  },
  {
    id: 'pca-43',
    question: 'What do `group_wait`, `group_interval`, and `repeat_interval` control in Alertmanager grouping configuration?',
    options: [
      'They are legacy fields that have been fully deprecated and now have zero effect in current versions, a description that overstates what the feature does',
      'They control notification timing: how long to wait for more alerts before the first notification, how often group updates go out, and how often to resend if still firing',
      'They configure how long Prometheus itself waits before performing its next scheduled scrape of a target, which is not how the system is actually designed to work',
      'They control the TLS certificate rotation schedule used internally by the Alertmanager HTTP API, though this is a common misconception among new users',
    ],
    correctIndex: 1,
    explanation:
      '`group_wait` batches related alerts arriving in a short window into one notification, `group_interval` throttles how often updates to that group are sent, and `repeat_interval` controls how long to wait before re-notifying about a still-firing alert group — together these reduce notification noise.',
  },
  {
    id: 'pca-44',
    question: 'Why does Alertmanager support clustering and gossip between multiple replicas rather than running as a single instance?',
    options: [
      'Clustering exists purely to load-balance incoming HTTP traffic and has no bearing on notification behavior, a claim that does not match the documented behavior',
      'Alertmanager gossip lets replicas deduplicate the same alert arriving from multiple Prometheus servers, so on-call engineers get one notification instead of one per replica',
      'Running more than a single Alertmanager replica is not supported under any circumstances whatsoever, which contradicts how the component is actually implemented',
      'Gossip exists solely to keep the PromQL query result cache synchronized between separate replicas, though no such mechanism exists in the real system',
    ],
    correctIndex: 1,
    explanation:
      'In an HA setup, multiple Prometheus servers may fire the same alert and send it to multiple Alertmanager replicas. The gossip protocol between replicas deduplicates this so on-call engineers get one notification per unique alert, not one per replica.',
  },
  {
    id: 'pca-45',
    question: 'What is the difference between the built-in Prometheus expression browser and a tool like Grafana for visualization?',
    options: [
      'They are, in fact, the exact same underlying product simply marketed under two different names, which is not part of its documented feature set',
      'Grafana is only capable of displaying log data and cannot render any metrics sourced from Prometheus',
      'The expression browser is a built-in tool for quick ad-hoc queries, while Grafana is a fuller product for persistent, shareable dashboards',
      'Alerting configuration is supported directly in the expression browser but entirely unsupported in Grafana',
    ],
    correctIndex: 2,
    explanation:
      'The bundled expression browser is meant for quick, one-off PromQL exploration and simple graphs. Grafana is the standard choice for building polished, persistent, multi-panel, multi-source dashboards that teams actually live in day to day.',
  },
  {
    id: 'pca-46',
    question: 'What is the purpose of Prometheus "console templates"?',
    options: [
      'They are Go-templated custom HTML dashboard pages, served directly by the Prometheus server, that embed PromQL query results',
      'They are configuration templates used exclusively to scaffold a fresh `prometheus.yml` file at install time',
      'They are a mechanism that automatically generates a complete Alertmanager routing configuration',
      'They are a feature that has been discussed but has never actually shipped in any Prometheus release',
    ],
    correctIndex: 0,
    explanation:
      'Console templates let you author custom Go-templated HTML pages served directly by the Prometheus server, embedding PromQL results — a lighter-weight, legacy alternative to a full Grafana deployment for simple internal dashboards.',
  },
  {
    id: 'pca-47',
    question: 'When deploying Prometheus into Kubernetes via a Helm chart like kube-prometheus-stack, what commonly handles automatic discovery of workloads to scrape?',
    options: [
      'A human operator manually editing `prometheus.yml` by hand and restarting the pod for every new workload, a description that does not reflect its actual design',
      'Custom Resources such as `ServiceMonitor`/`PodMonitor`, watched by the Prometheus Operator, which regenerates scrape config automatically as they change',
      'The claim that Kubernetes exposes no API at all through which any external tool could discover running workloads',
      'Plain DNS round-robin resolution, described as the only supported discovery mechanism inside a cluster, though this is not the behavior described in the docs',
    ],
    correctIndex: 1,
    explanation:
      'The Prometheus Operator pattern (used by kube-prometheus-stack) introduces `ServiceMonitor`/`PodMonitor` CRDs — declaring what to scrape as a Kubernetes object, which the Operator watches and translates into live Prometheus scrape configuration without manual file edits.',
  },
  {
    id: 'pca-48',
    question: 'Why would a team adopt a solution like Thanos or Cortex/Mimir on top of vanilla Prometheus?',
    options: [
      'To completely replace PromQL with an entirely different, incompatible query language across the stack, which is inconsistent with how it operates in practice',
      'To add horizontally-scalable long-term storage, cross-cluster global querying, and high availability that a single Prometheus server lacks on its own',
      'Because a vanilla Prometheus server is claimed to be unable to scrape more than one target at a time, a claim not supported by the project\'s own documentation',
      'Because Alertmanager is claimed to require Thanos installed before it can function at all, though the real implementation works quite differently',
    ],
    correctIndex: 1,
    explanation:
      'A single Prometheus server is intentionally simple and self-contained, but that means no built-in horizontal scaling, cross-cluster global view, or long-term (multi-year) retention. Thanos/Cortex/Mimir sit on top via remote-write/sidecar patterns to add exactly those capabilities.',
  },
  {
    id: 'pca-49',
    question: 'What scaling problem does "horizontal sharding" of Prometheus servers, splitting scrape targets across multiple instances, address?',
    options: [
      'It is described as a technique whose only purpose is reducing which PromQL functions are made available to users',
      'A single Prometheus process has a practical ceiling on active series it can ingest on one machine, so sharding spreads that load across several servers',
      'It is claimed to be relevant only for reducing the notification volume that reaches Alertmanager, which is a common but mistaken assumption',
      'It is claimed to fully eliminate any remaining need for a remote-write or long-term storage layer, a description many newcomers initially assume is true',
    ],
    correctIndex: 1,
    explanation:
      'Prometheus scales vertically well but has real per-instance limits on active series and ingestion rate. Functional sharding (e.g. by team, by cluster) spreads the scrape load across multiple Prometheus servers, each independently manageable, before a global layer like Thanos stitches the query view back together.',
  },
  {
    id: 'pca-50',
    question: 'What is the Pushgateway specifically designed for, and why should it not be used for regular long-running service metrics?',
    options: [
      'It is described as a complete, full drop-in replacement capable of standing in for the entire Prometheus server',
      'It is meant for batch jobs that finish before a scrape could occur; using it for long-running services loses the normal "target down" detection',
      'It is claimed to be a hard requirement for every exporter to function, including something as basic as node_exporter',
      'It is described as automatically discovering and scraping every Kubernetes pod without any configuration at all',
    ],
    correctIndex: 1,
    explanation:
      'A batch job may finish and exit before any scrape could happen, so it pushes its final metrics to the Pushgateway, which Prometheus then scrapes. Using it for always-on services is an anti-pattern: the gateway keeps serving stale values even after the service dies, defeating Prometheus\'s normal "is this target up" health signal.',
  },
  {
    id: 'pca-51',
    question: 'How does "observability" differ from traditional "monitoring" as a practice?',
    options: [
      'Observability tooling is described as fundamentally incapable of generating any alerts at all, unlike monitoring',
      'Monitoring watches known, predefined failure signals, while observability lets you explore new questions about internal state after the fact',
      'Monitoring is claimed to strictly require distributed tracing, while observability supposedly only ever needs metrics',
      'The two terms are, in practice, a simple rebranding of one another with no meaningful difference, though this has never been part of its actual behavior',
    ],
    correctIndex: 1,
    explanation:
      'Classic monitoring is built around known-unknowns — dashboards and alerts for failure modes you already anticipated. Observability aims for the ability to explore unknown-unknowns by correlating rich telemetry (metrics, logs, traces) after the fact, without having predefined every possible question in advance.',
  },
  {
    id: 'pca-52',
    question: 'Why is Prometheus\'s multi-dimensional label model considered more flexible than a flat, single-value metric naming scheme?',
    options: [
      'Labels are described as purely cosmetic legend text with zero effect on how a query is actually evaluated, which does not align with its documented design',
      'A flat scheme with no labels at all is claimed to always perform strictly faster in every single case, a misconception that occasionally appears in forum posts',
      'Labels are claimed to be attachable only to gauge metrics, never to counters or histograms, though nothing in the architecture actually supports this',
      'Labels let one metric be sliced along many independent dimensions, like method or status code, at query time instead of predefining a metric per combination',
    ],
    correctIndex: 3,
    explanation:
      'Instead of separate metrics like `http_requests_get_200_total` and `http_requests_post_404_total`, one labeled metric `http_requests_total{method, status_code}` covers every combination, and PromQL\'s aggregation operators let you group or filter by any dimension on demand.',
  },
  {
    id: 'pca-53',
    question: 'At a high level, how does the Prometheus 2.x local TSDB persist incoming samples so they survive a crash?',
    options: [
      'Samples are described as living purely in memory, guaranteed to be permanently lost on any process restart',
      'Recent samples go into an in-memory head block backed by a write-ahead log for crash recovery, later compacted into immutable on-disk blocks',
      'Every incoming sample is claimed to be synchronously written to a remote relational database before being acknowledged',
      'All history is claimed to be stored as one single, ever-growing, entirely uncompacted flat file, which the maintainers have never actually implemented',
    ],
    correctIndex: 1,
    explanation:
      'Prometheus 2.x\'s storage engine keeps recent data in an in-memory "head" block, journaled to a write-ahead log so a crash doesn\'t lose unflushed samples, and periodically compacts that data into immutable, indexed on-disk blocks for efficient long-term local querying.',
  },
  {
    id: 'pca-54',
    question: 'What does the automatically-generated `up` metric represent for each scrape target?',
    options: [
      'The remaining percentage of a service\'s SLO error budget, computed automatically per target',
      'A value equal to 1 if the most recent scrape succeeded, or 0 if it failed, generated by Prometheus itself rather than the target',
      'The exact number of seconds the scraped process has been continuously running since it last booted',
      'The precise, live CPU usage percentage of the target process measured at the moment of scraping',
    ],
    correctIndex: 1,
    explanation:
      '`up` is synthesized by Prometheus for every scrape, independent of whatever metrics the target itself exposes — it is the simplest, most universal building block for "is this target reachable and healthy" alerting and dashboards.',
  },
  {
    id: 'pca-55',
    question: 'What is the required relationship between a job\'s `scrape_timeout` and its `scrape_interval` in Prometheus configuration?',
    options: [
      'The claim is that `scrape_timeout` must always be configured as exactly double the `scrape_interval` value',
      '`scrape_timeout` must be less than or equal to `scrape_interval`, since a scrape must finish or time out before the next one is due',
      'The two settings are claimed to be entirely unrelated, with no configuration constraint between them at all',
      'The claim is that `scrape_interval` has been deprecated entirely in favor of `scrape_timeout` in modern versions',
    ],
    correctIndex: 1,
    explanation:
      'A scrape must finish, one way or another, before the next scheduled scrape for that target — so `scrape_timeout` is capped at (and defaults to a fraction of) `scrape_interval`, and Prometheus will reject a config where the timeout exceeds the interval.',
  },
  {
    id: 'pca-56',
    question: 'What does the `--storage.tsdb.retention.time` flag control, and what is its default value?',
    options: [
      'It is claimed to control how long an alert stays "pending" before firing, with a default of 1 hour',
      'How long Prometheus retains locally-stored samples before deleting the oldest data, defaulting to 15 days',
      'It is claimed to control how often the `prometheus.yml` config file is automatically reloaded, defaulting to 15 seconds',
      'It is claimed to control how long an Alertmanager silence stays active, defaulting to 15 days',
    ],
    correctIndex: 1,
    explanation:
      'By default Prometheus retains 15 days of local TSDB history before compacting away the oldest blocks — a deliberately modest window, reflecting that Prometheus is meant for operational, near-term data rather than being a long-term archive on its own.',
  },
  {
    id: 'pca-57',
    question: 'What is the difference between `count()` and `count_values()` in PromQL?',
    options: [
      'The two are described as identical functions kept under two names purely for backward compatibility, a detail not reflected anywhere in the real system',
      '`count()` returns how many series matched as a single number, while `count_values("label", expr)` groups by distinct observed values and counts series sharing each one',
      '`count_values()` is claimed to only be usable inside Alertmanager notification templates, never inside a Prometheus query',
      '`count()` is claimed to require a range vector while `count_values()` supposedly requires an instant vector, with no other difference',
    ],
    correctIndex: 1,
    explanation:
      '`count(up)` simply tells you how many series exist. `count_values("state", up)` instead buckets by the actual observed values (e.g. how many series currently report `1` vs how many report `0`) and labels the result with that value — useful for a quick breakdown by distinct value.',
  },
  {
    id: 'pca-58',
    question: 'What does appending the `bool` modifier to a comparison, such as `http_requests_total > bool 100`, change about the result?',
    options: [
      'It is claimed to have absolutely no effect whatsoever and exists purely as stylistic decoration, though the actual mechanism behaves quite differently',
      'Every series is kept and its value is replaced with 1 or 0 instead of filtering out non-matching series',
      'It is claimed to convert the entire expression from an instant vector into a range vector, which no version of the project has ever supported',
      '`bool` is claimed to only be usable together with the `==` operator, never with `>`, `<`, or `!=`',
    ],
    correctIndex: 1,
    explanation:
      'Without `bool`, a comparison operator filters the vector down to only the matching series. With `bool`, every series survives, now holding a 0 or 1 — commonly used to then `sum()` how many series currently satisfy a condition.',
  },
  {
    id: 'pca-59',
    question: 'Why does Prometheus naming convention recommend base units, such as seconds or bytes, over derived units like milliseconds or kilobytes?',
    options: [
      'Derived units are claimed to be technically forbidden, with Prometheus refusing to scrape any metric using them',
      'Consistent base units let queries and dashboards combine or compare different metrics without needing scattered per-metric unit-conversion logic',
      'Base units are claimed to always make the raw scrape payload smaller by reducing the number of digits',
      'This convention is claimed to apply only to gauge metrics, with no bearing on counters or histograms, a claim that does not hold up under closer inspection',
    ],
    correctIndex: 1,
    explanation:
      'If some metrics used milliseconds and others seconds, every query, alert, and dashboard combining them would need to remember which unit each one uses. Standardizing on base units (seconds, bytes) removes that whole class of silent unit-mismatch bugs.',
  },
  {
    id: 'pca-60',
    question: 'When a client library exposes a Histogram metric named `http_request_duration_seconds`, what additional series does it automatically generate alongside it?',
    options: [
      'None at all — a Histogram is claimed to only ever produce the one named series with no additional suffixes',
      '`_bucket{le="..."}` series per configured boundary, plus a `_sum` of observed values and a `_count` of observations',
      'Only a `_count` series is generated, with no bucket-level or sum-level information produced at all',
      'A fully separate Summary-type metric sharing the same name but with an added `_quantile` suffix',
    ],
    correctIndex: 1,
    explanation:
      'A single Histogram observation point in client-library instrumentation fans out into cumulative `_bucket` series (one per `le` boundary), a `_sum` of all observed values, and a `_count` of observations — this is exactly the trio `histogram_quantile()` and `rate()` operate on.',
  },
]
