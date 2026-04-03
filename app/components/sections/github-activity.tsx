'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, GitCommit, BookOpen, Users } from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import { BlurFade } from '@/components/ui/magic/blur-fade'
import AnimatedCounter from '@/components/shared/animated-counter'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface GitHubData {
  contributions: ContributionDay[]
  total: number
  profile: {
    repos: number
    followers: number
  }
}

const LEVEL_COLORS = [
  'bg-zinc-800',        // 0 contributions
  'bg-emerald-900/70',  // level 1
  'bg-emerald-700/70',  // level 2
  'bg-emerald-500/70',  // level 3
  'bg-emerald-400',     // level 4
]

export default function GitHubActivity() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/github')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Take last 20 weeks for display
  const contributions = data?.contributions || []
  const recentDays = contributions.slice(-140) // ~20 weeks

  // Group into weeks
  const weeks: ContributionDay[][] = []
  for (let i = 0; i < recentDays.length; i += 7) {
    weeks.push(recentDays.slice(i, i + 7))
  }

  return (
    <SectionWrapper id="github">
      <SectionHeading
        label="Activity"
        title="GitHub Contributions"
        description="Consistent open-source activity and infrastructure code contributions."
      />

      {/* Stats row */}
      <BlurFade delay={0.1}>
        <div className="flex flex-wrap items-center justify-center gap-8 mb-10">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold gradient-text">
              {data ? <AnimatedCounter value={data.total} /> : '—'}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
              <GitCommit className="h-3 w-3" />
              Contributions (1yr)
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold gradient-text">
              {data ? <AnimatedCounter value={data.profile.repos} /> : '—'}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
              <BookOpen className="h-3 w-3" />
              Public Repos
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold gradient-text">
              {data ? <AnimatedCounter value={data.profile.followers} /> : '—'}
            </div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 justify-center">
              <Users className="h-3 w-3" />
              Followers
            </div>
          </div>
        </div>
      </BlurFade>

      {/* Contribution heatmap */}
      <BlurFade delay={0.2}>
        <div className="flex flex-col items-center">
          <div className="rounded-xl border border-border bg-card p-6 overflow-x-auto w-full max-w-3xl">
            {loading ? (
              <div className="h-[100px] flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                Loading contributions...
              </div>
            ) : (
              <>
                <div className="flex gap-[3px] justify-center min-w-fit">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <motion.div
                          key={day.date}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.15,
                            delay: wi * 0.02 + di * 0.005,
                          }}
                          className={`h-[11px] w-[11px] rounded-[2px] ${LEVEL_COLORS[day.level] || LEVEL_COLORS[0]}`}
                          title={`${day.date}: ${day.count} contributions`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                {/* Legend */}
                <div className="flex items-center justify-end gap-1 mt-3">
                  <span className="text-[10px] text-muted-foreground mr-1">Less</span>
                  {LEVEL_COLORS.map((color, i) => (
                    <div key={i} className={`h-[10px] w-[10px] rounded-[2px] ${color}`} />
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-1">More</span>
                </div>
              </>
            )}
          </div>

          {/* GitHub link */}
          <a
            href="https://github.com/joyson-fernandes"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 text-sm font-medium rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </BlurFade>
    </SectionWrapper>
  )
}
