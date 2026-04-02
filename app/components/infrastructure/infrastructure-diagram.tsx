'use client'

import { useMemo, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from 'reactflow'
import 'reactflow/dist/style.css'
import ServiceNode from './nodes/service-node'
import AnimatedEdge from './edges/animated-edge'
import infraData from '@/data/infrastructure.json'

const nodeTypes = { service: ServiceNode }
const edgeTypes = { animated: AnimatedEdge }

export default function InfrastructureDiagram() {
  const initialNodes: Node[] = useMemo(
    () =>
      infraData.nodes.map((n) => ({
        id: n.id,
        type: 'service',
        position: n.position,
        data: {
          label: n.label,
          subtitle: n.subtitle,
          category: n.category,
          icon: n.icon,
          categoryColor:
            infraData.categories[n.category as keyof typeof infraData.categories]?.color || '#3b82f6',
        },
      })),
    []
  )

  const initialEdges: Edge[] = useMemo(
    () =>
      infraData.edges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'animated',
        data: { animated: e.animated || false },
      })),
    []
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="w-full h-[600px] md:h-[700px] rounded-xl border border-border bg-card/50 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        panOnScroll={false}
        className="bg-transparent"
      >
        <Background color="hsl(var(--border))" gap={30} size={1} />
        <Controls
          showInteractive={false}
          className="!bottom-4 !right-4 !left-auto"
        />
        <MiniMap
          nodeColor={(node) => {
            return node.data?.categoryColor || '#3b82f6'
          }}
          maskColor="hsl(var(--background) / 0.8)"
          className="!bottom-4 !left-4 !right-auto"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  )
}
