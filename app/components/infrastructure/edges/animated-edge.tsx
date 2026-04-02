'use client'

import { memo } from 'react'
import { BaseEdge, getSmoothStepPath, type EdgeProps } from 'reactflow'

function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  ...rest
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: 'hsl(var(--border))',
          strokeWidth: 1.5,
          strokeDasharray: data?.animated ? '5 5' : 'none',
        }}
        {...rest}
      />
      {data?.animated && (
        <circle r="2" fill="#3b82f6" opacity="0.8">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      )}
    </>
  )
}

export default memo(AnimatedEdge)
