'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from 'reactflow'
import {
  Server, Boxes, Network, Cable, Globe, GitBranch, Container, Lock, Key,
  Shield, Activity, BarChart3, FileText, Zap, HardDrive, Database, Archive,
  RefreshCw, Link, CloudSun, Layout, Github, Play, ShieldCheck, UserCheck,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  server: Server, boxes: Boxes, network: Network, cable: Cable, globe: Globe,
  'git-branch': GitBranch, container: Container, lock: Lock, key: Key,
  shield: Shield, activity: Activity, 'bar-chart-3': BarChart3,
  'file-text': FileText, zap: Zap, 'hard-drive': HardDrive, database: Database,
  archive: Archive, 'refresh-cw': RefreshCw, link: Link, 'cloud-sun': CloudSun,
  layout: Layout, github: Github, play: Play, 'shield-check': ShieldCheck,
  'user-check': UserCheck,
}

interface ServiceNodeData {
  label: string
  subtitle: string
  category: string
  icon: string
  categoryColor: string
}

function ServiceNode({ data }: NodeProps<ServiceNodeData>) {
  const Icon = ICON_MAP[data.icon] || Server
  const color = data.categoryColor || '#3b82f6'

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0 !w-3 !h-3" />
      <div
        className="group relative flex items-center gap-3 px-4 py-3 rounded-xl border bg-card/90 backdrop-blur-sm transition-all duration-200 hover:shadow-lg min-w-[180px]"
        style={{ borderColor: `${color}30`, boxShadow: `0 0 0 0 ${color}00` }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = `${color}60`
          e.currentTarget.style.boxShadow = `0 0 20px ${color}15`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = `${color}30`
          e.currentTarget.style.boxShadow = `0 0 0 0 ${color}00`
        }}
      >
        {/* Left color accent */}
        <div
          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
          style={{ backgroundColor: color }}
        />

        {/* Icon */}
        <div
          className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon className="h-4 w-4" />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground leading-tight truncate">
            {data.label}
          </div>
          <div className="text-[10px] text-muted-foreground leading-tight truncate">
            {data.subtitle}
          </div>
        </div>

        {/* Status dot */}
        <div className="absolute top-2 right-2">
          <span className="flex h-1.5 w-1.5">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: '#22c55e' }}
            />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-3 !h-3" />
    </>
  )
}

export default memo(ServiceNode)
