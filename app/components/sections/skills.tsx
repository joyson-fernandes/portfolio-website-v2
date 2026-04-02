'use client'

import {
  Cloud, FileCode, Boxes, GitBranch, Code, Activity, Shield,
} from 'lucide-react'
import SectionWrapper from '@/components/layout/section-wrapper'
import SectionHeading from '@/components/shared/section-heading'
import { MovingBorder } from '@/components/ui/aceternity/moving-border'
import { BlurFade } from '@/components/ui/magic/blur-fade'
import skillsData from '@/data/skills.json'

const ICON_MAP: Record<string, React.ElementType> = {
  cloud: Cloud,
  'file-code': FileCode,
  boxes: Boxes,
  'git-branch': GitBranch,
  code: Code,
  activity: Activity,
  shield: Shield,
}

export default function Skills() {
  return (
    <SectionWrapper id="skills">
      <SectionHeading
        label="Tech Stack"
        title="Skills & Technologies"
        description="Tools and technologies I use daily to build and operate production infrastructure."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skillsData.categories.map((cat, i) => {
          const Icon = ICON_MAP[cat.icon] || Cloud
          return (
            <BlurFade key={cat.title} delay={0.1 + i * 0.08}>
              <MovingBorder
                duration={6000 + i * 500}
                className="p-5 h-full"
                containerClassName="h-full"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-foreground">{cat.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 text-xs font-mono font-medium rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </MovingBorder>
            </BlurFade>
          )
        })}
      </div>
    </SectionWrapper>
  )
}
