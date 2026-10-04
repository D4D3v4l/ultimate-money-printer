import { Progress } from "@/components/ui/progress";
import type { ReportTone } from "@/lib/mock-data";
import { cn } from "cn";

/**
 * El componente `Progress` de shadcn siempre renderiza su propia pista e
 * indicador; pasarle un `ProgressTrack` como `children` genera una barra extra.
 * Esta envoltura expone el alto de la pista y el tono del indicador mediante
 * variantes literales (necesario para que Tailwind las detecte).
 */

const trackSizeClasses = {
  sm: "[&_[data-slot=progress-track]]:h-1",
  md: "[&_[data-slot=progress-track]]:h-1.5",
  lg: "[&_[data-slot=progress-track]]:h-2",
} as const;

const indicatorToneClasses: Record<ReportTone, string> = {
  primary: "[&_[data-slot=progress-indicator]]:bg-primary",
  secondary: "[&_[data-slot=progress-indicator]]:bg-foreground/45",
  destructive: "[&_[data-slot=progress-indicator]]:bg-destructive",
};

export function ProgressBar({
  value,
  size = "md",
  tone,
  label,
  className,
}: {
  value: number;
  size?: keyof typeof trackSizeClasses;
  tone?: ReportTone;
  label?: string;
  className?: string;
}) {
  return (
    <Progress
      value={value}
      aria-label={label}
      className={cn(
        trackSizeClasses[size],
        tone && indicatorToneClasses[tone],
        className,
      )}
    />
  );
}
