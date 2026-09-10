# Learning Hub — Design Spec

## Purpose

Add a "Learning Hub" to the portfolio site: a page linking to interactive
practice-question simulators for Cloud Native / GitOps certifications,
inspired by https://phillipsteinert.de/learning but built with this site's
own design system and content pipeline rather than copied wholesale.

## Scope

**Certs covered (10 total):** CGOA, CAPA, KCNA, KCSA, PCA, CBA, OTCA, CNPA,
KCA, CCA.

**Phased rollout:**
- Hub page ships with all 10 cert cards visible.
- **CGOA** (Certified GitOps Associate) and **CAPA** (Certified Argo Project
  Associate) launch with real, working question banks.
- The remaining 8 show a "Coming Soon" state — visible on the grid, not
  clickable, no route exists yet. Each gets a real question bank and route
  added later as its own follow-up unit of work.

**Out of scope for this spec:** question banks for the 8 "Coming Soon"
certs, user accounts / persisted quiz history across devices, a CMS for
authoring questions (they're plain data files, edited directly).

## Navigation

Add "Learning" as a top-level nav item (same level as the Homelab link) in
`components/layout/navigation.tsx`, pointing to `/learning`.

## Routes

- `/learning` — hub page, grid of all 10 cert cards
- `/learning/[certId]` — quiz-taking page for an available cert (`cgoa`,
  `capa` initially). Requesting a certId with no question bank 404s.

## Data model

Two new data files under `app/data/learning/`, following this project's
existing convention of plain data files (`data/about.json`,
`data/experience.json`, etc.) rather than a database or CMS.

**`app/data/learning/certs.ts`** — one entry per cert, drives the hub grid
and quiz page config:

```ts
interface CertMeta {
  id: string              // 'cgoa'
  name: string             // 'Certified GitOps Associate'
  shortName: string        // 'CGOA'
  description: string      // one-liner shown on the hub card
  questionCount: number    // 60
  durationMinutes: number  // 90
  passThreshold: number    // 75 (percent)
  available: boolean       // false => "Coming Soon" card, no link
}
```

**`app/data/learning/<certId>-questions.ts`** (one file per *available*
cert, e.g. `cgoa-questions.ts`) — the question bank:

```ts
interface Question {
  id: string
  question: string
  options: [string, string, string, string]
  correctIndex: 0 | 1 | 2 | 3
  explanation: string   // shown after answering, explains the correct choice
}
```

A quiz session draws `questionCount` questions from the bank (random
sample without replacement if the bank has more than `questionCount`
entries; if it has exactly `questionCount`, use all of them in shuffled
order).

## Hub page design

Reuses this site's existing visual language (same tokens as the
Certifications section) rather than inventing a new theme:

- `SectionHeading`-style header: mono uppercase pill label ("Cert Prep"),
  large gradient (`blue-500` → `violet-500`) title "Learning Hub",
  description line
- Grid of cards, `rounded-2xl border border-border bg-card`, hover border
  transitions to `primary/50` with a subtle gradient glow overlay
  (`blue-500/5` → `violet-500/5`, matching the Kubestronaut hero card
  pattern in `certifications.tsx`)
- Each card: gradient icon chip (blue→violet, `font-mono` short name),
  full cert name, one-line description, `font-mono` meta row (question
  count · duration · pass threshold), "Start Simulator →" CTA in
  `text-primary`
- Unavailable certs: same card shape, muted/greyscale icon chip, a
  "Coming Soon" pill instead of the CTA, `pointer-events-none opacity-50`
  container (same disabled-card pattern as the reference site)

## Quiz page design

**In-progress state:**
- Top bar: cert name (left), countdown timer (right, `text-primary`)
- Thin gradient progress bar (blue→cyan) under the top bar
- Question card (`rounded-2xl border-border bg-card`): question number
  label, question text, 4 lettered choice rows
- Choice row states: default (`border-border`), hover
  (`border-primary/40` + faint tint), selected (`border-primary` +
  tint, filled letter badge)
- Prev/Next buttons below the card

**Answer-feedback state** (immediately on submitting a choice — this is
the key interaction the reference site doesn't have and the user
specifically asked for):
- Correct choice row turns `emerald-500` bordered/tinted with a check icon
- If the user's pick was wrong, that row turns `red-500` bordered/tinted
  with an X icon; other two rows dim to `opacity-45`
- A banner appears: "✗ Incorrect — the correct answer is C" (red) or a
  green/emerald equivalent when they got it right
- An explanation box below (left border accent in `primary` blue, matching
  existing info-callout styling elsewhere on the site) shows the
  question's `explanation` text
- "Next Question →" button replaces Prev/Next; answers cannot be changed
  after submission

**Results screen** (after the last question):
- Large score display (e.g. "47 / 60 — 78%")
- PASS / FAIL badge against the cert's `passThreshold`
- Full scrollable review section listing **every** question (not just
  missed ones): the question, the user's answer, the correct answer, and
  the explanation — matching the same visual treatment as the in-quiz
  feedback state
- A "Retake" CTA that starts a fresh session (new random sample/shuffle)

## Content sourcing (CGOA, CAPA)

- **CGOA**: KodeKloud's "GitOps Certified Associate" prep course
  (`notes.kodekloud.com`, full doc index at
  `notes.kodekloud.com/llms.txt`) plus official Argo CD and CNCF GitOps
  docs. The user has already passed this cert and will review the
  question bank for accuracy before it ships.
- **CAPA**: official Argo Workflows / Argo CD / Argo Rollouts / Argo
  Events documentation. Also reviewed by the user before shipping.

Questions are original content (not reproductions of real exam
questions), consistent with the reference site's disclaimer approach —
worth carrying a similar "these are practice questions based on public
docs, not real exam content" disclaimer on the hub page.

## Testing

- Unit-test the quiz session logic (sampling/shuffling, scoring,
  pass/fail threshold) independent of UI
- Manually verify both question banks render correctly and every
  explanation is accurate before merging (this is the part that most
  needs human review — wrong practice answers are worse than no practice
  tool)

## Open items for implementation planning

- Exact list + count of questions per bank for CGOA/CAPA (a reasonable
  bank size to sample 60 from — e.g. 90–120 questions per cert, TBD
  during content drafting)
- Whether quiz progress (mid-session) persists across a page refresh
  (localStorage) — not raised during brainstorming; default to **no**
  persistence for v1 unless the implementation plan flags it as trivial
  to add
