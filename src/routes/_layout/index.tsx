import { ProgressRing } from "@/components/progress-ring";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";
import { portal, student, tutors } from "@/lib/mock-data";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  ChartPieIcon,
  ClockIcon,
  CompassIcon,
  InfoIcon,
  SchoolIcon,
} from "lucide-react";

export const Route = createFileRoute("/_layout/")({
  component: Portal,
});

function Portal() {
  const diagnostic = portal.diagnostic;
  const pathPreview = portal.learningPathPreview;
  const history = portal.history;

  return (
    <>
      <section className="flex flex-col gap-4 border-b border-border/60 pb-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
              {student.cycle}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {student.grade}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Bienvenido, {student.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Tu espacio personal de estudio adaptativo. Completa tu paso inicial
            para desbloquear el plan de contenidos personalizados.
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 self-start rounded-xl bg-card px-4 py-2 ring-1 ring-foreground/10 md:self-auto">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            Estado:{" "}
            <strong className="font-semibold text-foreground">
              {portal.phase}
            </strong>
          </span>
        </div>
      </section>

      {/* Acción principal: evaluación diagnóstica */}
      <Card className="gap-0 p-0 lg:flex-row lg:items-stretch lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="uppercase">
                {diagnostic.badge}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ClockIcon className="size-3.5" />
                {diagnostic.estimatedTime}
              </span>
            </div>
            <h2 className="text-xl font-semibold md:text-2xl">
              {diagnostic.title}
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {diagnostic.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-xl bg-muted/50 px-4 py-3 sm:grid-cols-3">
            {diagnostic.meta.map((item, index) => (
              <div
                key={item.label}
                className={
                  index === diagnostic.meta.length - 1
                    ? "col-span-2 flex flex-col sm:col-span-1"
                    : "flex flex-col"
                }
              >
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
                <span
                  className={
                    item.pending
                      ? "flex items-center gap-1 text-sm font-semibold text-primary"
                      : "text-sm font-semibold"
                  }
                >
                  {item.pending ? <ClockIcon className="size-3.5" /> : null}
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center">
            <Button
              size="lg"
              className="h-10 px-4"
              render={<Link to="/diagnostic" />}
            >
              Iniciar Evaluación Diagnóstica
              <ArrowRightIcon />
            </Button>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-between gap-4 border-t bg-muted/60 p-4 text-center lg:w-72 lg:shrink-0 lg:border-t-0 lg:border-l">
          <div className="flex w-full items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Progreso previo</span>
            <span className="font-mono text-sm font-semibold text-primary">
              {diagnostic.progress}%
            </span>
          </div>
          <ProgressRing value={diagnostic.progress} size={112}>
            <SchoolIcon className="size-8 text-primary" />
          </ProgressRing>
          <p className="text-xs text-muted-foreground">
            {diagnostic.emptyProgressNote}
          </p>
        </div>
      </Card>

      {/* Estado de ruta e historial */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="justify-between">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-primary">
                  <CompassIcon className="size-4" />
                </div>
                <CardTitle>{pathPreview.title}</CardTitle>
              </div>
              <Badge variant="outline">{pathPreview.status}</Badge>
            </div>
            <CardDescription className="text-sm">
              {pathPreview.description}{" "}
              <strong className="font-medium text-foreground">
                {tutors[0].name}
              </strong>{" "}
              (lógica y estrategia) y{" "}
              <strong className="font-medium text-foreground">
                {tutors[1].name}
              </strong>{" "}
              (lectura y vocabulario).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded-lg bg-muted/70 px-3 py-2">
              <AvatarGroup>
                {tutors.map((tutor) => (
                  <Avatar key={tutor.id} className="size-7">
                    <AvatarFallback className="text-[0.65rem] font-semibold">
                      {tutor.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <span className="text-xs text-muted-foreground">
                {pathPreview.footNote}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="justify-between">
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-muted text-primary">
                  <ChartPieIcon className="size-4" />
                </div>
                <CardTitle>{history.title}</CardTitle>
              </div>
              <span className="font-mono text-xs font-medium text-primary">
                {history.completed} de {history.total} listo
              </span>
            </div>
            <CardDescription className="text-sm">
              {history.completedLabel}:{" "}
              <strong className="font-medium text-foreground">
                {history.completed}/{history.total}
              </strong>
              . {history.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{history.stage}</span>
              <span className="font-medium text-foreground">
                {history.status}
              </span>
            </div>
            <ProgressBar
              value={history.progress}
              size="lg"
              label={history.stage}
            />
          </CardContent>
        </Card>
      </section>

      {/* Pautas de la prueba */}
      <section className="flex flex-col gap-4 rounded-xl bg-muted/60 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <InfoIcon className="size-5 text-primary" />
          <h3 className="text-base font-semibold">
            Pautas para tu prueba diagnóstica
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {portal.guidelines.map((guideline, index) => (
            <div key={guideline.title} className="flex items-start gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-xs font-bold text-primary ring-1 ring-foreground/10">
                {index + 1}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{guideline.title}</span>
                <span className="text-sm text-muted-foreground">
                  {guideline.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
