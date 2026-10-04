import type { DiagnosticFigure } from "@/lib/mock-data"
import { cn } from "cn"

const CENTER = 100
const RADIUS = 92

function pointAt(angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: CENTER + RADIUS * Math.cos(radians),
    y: CENTER + RADIUS * Math.sin(radians),
  }
}

function slicePath(startAngle: number, endAngle: number) {
  const start = pointAt(startAngle)
  const end = pointAt(endAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    "Z",
  ].join(" ")
}

/**
 * Representación geométrica de un reactivo: círculo dividido en `total` porción
 * congruentes, con las primeras `highlighted` resaltadas.
 */
export function FractionFigure({
  figure,
  className,
}: {
  figure: DiagnosticFigure
  className?: string
}) {
  const step = 360 / figure.total
  const slices = Array.from({ length: figure.total }, (_, index) => index)

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-6 rounded-xl bg-muted/60 p-6 md:flex-row md:gap-10",
        className
      )}
    >
      <svg
        viewBox="0 0 200 200"
        role="img"
        aria-label={`Círculo dividido en ${figure.total} porciones iguales, de las cuales ${figure.highlighted} están resaltadas.`}
        className="size-48 shrink-0 select-none md:size-56"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          strokeWidth="1.5"
          className="fill-background stroke-border"
        />
        {slices.map((index) => {
          const isHighlighted = index < figure.highlighted
          return (
            <path
              key={index}
              d={slicePath(index * step, (index + 1) * step)}
              strokeWidth={isHighlighted ? 1 : 1.5}
              className={
                isHighlighted
                  ? "fill-muted-foreground/15 stroke-border"
                  : "fill-primary/15 stroke-primary"
              }
            />
          )
        })}
        <circle cx={CENTER} cy={CENTER} r="3" className="fill-primary" />
      </svg>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <span className="text-sm font-medium">Convención de referencia</span>
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-4 shrink-0 rounded-sm border border-border bg-muted-foreground/15"
          />
          <span className="text-sm text-muted-foreground">
            {figure.highlightedLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="size-4 shrink-0 rounded-sm border border-primary bg-primary/15"
          />
          <span className="text-sm font-medium">{figure.restLabel}</span>
        </div>
        <p className="mt-1 rounded-lg border border-border bg-background p-3 font-mono text-xs text-muted-foreground">
          {figure.note}
        </p>
      </div>
    </div>
  )
}
