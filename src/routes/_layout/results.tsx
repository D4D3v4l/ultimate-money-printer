import { Badge, badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";
import { report, student, type ReportTone } from "@/lib/mock-data";
import { Link, createFileRoute } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import {
  ArrowRightIcon,
  AwardIcon,
  BookOpenIcon,
  CalculatorIcon,
  CalendarDaysIcon,
  ChartNoAxesCombinedIcon,
  ChartPieIcon,
  CircleCheckIcon,
  DownloadIcon,
  GraduationCapIcon,
  RouteIcon,
  TrendingUpIcon,
  TriangleAlertIcon,
  UserIcon,
} from "lucide-react";

export const Route = createFileRoute("/_layout/results")({
  component: Results,
});

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const toneStyles: Record<
  ReportTone,
  {
    badge: BadgeVariant;
    value: string;
    iconBox: string;
    SignalIcon: typeof CircleCheckIcon;
  }
> = {
  primary: {
    badge: "default",
    value: "text-primary",
    iconBox: "bg-primary/10 text-primary",
    SignalIcon: CircleCheckIcon,
  },
  secondary: {
    badge: "secondary",
    value: "text-foreground/70",
    iconBox: "bg-secondary text-secondary-foreground",
    SignalIcon: TrendingUpIcon,
  },
  destructive: {
    badge: "destructive",
    value: "text-destructive",
    iconBox: "bg-destructive/10 text-destructive",
    SignalIcon: TriangleAlertIcon,
  },
};

const competencyIcons: Record<string, typeof ChartPieIcon> = {
  fracciones: ChartPieIcon,
  inferencia: BookOpenIcon,
  calculo: CalculatorIcon,
};

function Results() {
  return (
    <>
      {/* Encabezado del reporte */}
      <Card className="gap-4 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-primary">
              <ChartNoAxesCombinedIcon className="size-4" />
              <span className="text-sm font-semibold tracking-wider uppercase">
                {report.eyebrow}
              </span>
            </div>
            <CardTitle className="text-2xl font-semibold tracking-tight md:text-3xl">
              {report.title}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <UserIcon className="size-4" />
                Estudiante:{" "}
                <strong className="font-semibold text-foreground">
                  {student.name}
                </strong>
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCapIcon className="size-4" />
                Grado:{" "}
                <strong className="font-medium text-foreground">
                  {student.grade}
                </strong>
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDaysIcon className="size-4" />
                Fecha de aplicación:{" "}
                <strong className="font-medium text-foreground">
                  {report.appliedOn}
                </strong>
              </span>
            </div>
          </div>
          <span className="flex w-fit shrink-0 items-center gap-2 self-start rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground md:self-auto">
            <span className="size-2 rounded-full bg-primary" />
            {report.period}
          </span>
        </div>
      </Card>

      {/* Métricas principales */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <MetricCard
          label={report.globalScore.label}
          value={report.globalScore.value}
          badge={{ label: "Completado", variant: "secondary" }}
          trailing={report.globalScore.level}
          note={report.globalScore.note}
          tone="primary"
        />
        <MetricCard
          label={report.highlight.label}
          value={report.highlight.value}
          trailing={report.highlight.name}
          note={report.highlight.note}
          tone="secondary"
          headerIcon={<AwardIcon className="size-4 text-primary" />}
        />
        <MetricCard
          label={report.focus.label}
          value={report.focus.value}
          badge={{ label: "Prioritario", variant: "destructive" }}
          trailing={report.focus.name}
          note={report.focus.note}
          tone="destructive"
        />
      </section>

      {/* Diagnóstico de causas de brecha */}
      <Card className="gap-6 [--card-spacing:--spacing(5)]">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>{report.gapAnalysis.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {report.gapAnalysis.description}
            </p>
          </div>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-primary" />
            {report.competencies.length} competencias evaluadas
          </span>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {report.competencies.map((competency) => {
            const tone = toneStyles[competency.tone];
            const Icon = competencyIcons[competency.id] ?? ChartPieIcon;
            const SignalIcon = tone.SignalIcon;

            return (
              <div
                key={competency.id}
                className="flex flex-col gap-4 rounded-xl bg-muted/60 p-4 transition-colors hover:bg-muted lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tone.iconBox}`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-semibold">
                        {competency.name}
                      </span>
                      <Badge variant={tone.badge}>{competency.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <strong className="font-semibold text-foreground">
                        Causa raíz detectada:
                      </strong>{" "}
                      {competency.rootCause}
                    </p>
                  </div>
                </div>
                <div className="flex w-full items-center justify-between gap-4 lg:w-auto lg:justify-end">
                  <div className="flex w-28 flex-col items-end gap-1.5">
                    <span className={`text-xl font-semibold ${tone.value}`}>
                      {competency.score}%
                    </span>
                    <ProgressBar
                      value={competency.score}
                      tone={competency.tone}
                      label={competency.name}
                    />
                  </div>
                  <SignalIcon className={`size-5 ${tone.value}`} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Siguiente paso */}
      <Card className="flex flex-col items-start gap-6 p-4 md:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-2xl items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <RouteIcon className="size-5" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              {report.nextStep.label}
            </span>
            <h3 className="text-lg font-semibold">{report.nextStep.title}</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Se han estructurado{" "}
              <strong className="font-semibold text-foreground">
                {report.nextStep.modules} módulos priorizados
              </strong>{" "}
              de 15 minutos diarios para abordar las dificultades conceptuales
              detectadas en fracciones e inferencias.
            </p>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <Button
            size="lg"
            className="h-10"
            render={<Link to="/learning-path" />}
          >
            Ver Ruta de Aprendizaje
            <ArrowRightIcon />
          </Button>
          <Button variant="secondary" size="lg" className="h-10">
            <DownloadIcon />
            Descargar Reporte PDF
          </Button>
        </div>
      </Card>
    </>
  );
}

function MetricCard({
  label,
  value,
  trailing,
  note,
  badge,
  tone,
  headerIcon,
}: {
  label: string;
  value: number;
  trailing: string;
  note: string;
  badge?: { label: string; variant: BadgeVariant };
  tone: ReportTone;
  headerIcon?: ReactNode;
}) {
  const styles = toneStyles[tone];

  return (
    <Card className="justify-between">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {badge ? (
          <Badge variant={badge.variant}>{badge.label}</Badge>
        ) : (
          headerIcon
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span
            className={`text-4xl font-semibold tracking-tight ${styles.value}`}
          >
            {value}%
          </span>
          <span className="text-base text-foreground">{trailing}</span>
        </div>
        <ProgressBar value={value} size="lg" tone={tone} label={label} />
        <span className="text-sm text-muted-foreground">{note}</span>
      </CardContent>
    </Card>
  );
}
