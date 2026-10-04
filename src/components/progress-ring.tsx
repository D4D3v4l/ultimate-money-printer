import type * as React from "react"
import { cn } from "cn"

/**
 * Indicador circular de progreso. Reemplaza el anillo SVG del diseño con la
 * misma API visual pero usando los tokens del proyecto.
 */
export function ProgressRing({
  value,
  size = 112,
  thickness = 8,
  className,
  children,
}: {
  value: number
  size?: number
  thickness?: number
  className?: string
  children?: React.ReactNode
}) {
  const radius = 50 - thickness / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, value))
  const offset = circumference - (clamped / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="size-full -rotate-90"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-muted"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-primary transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      {children ? (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      ) : null}
    </div>
  )
}
