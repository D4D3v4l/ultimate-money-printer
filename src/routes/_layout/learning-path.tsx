import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";
import { learningPath, tutors, type PathItem } from "@/lib/mock-data";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  FlagIcon,
  HourglassIcon,
  LightbulbIcon,
  ListChecksIcon,
  LockIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

export const Route = createFileRoute("/_layout/learning-path")({
  component: LearningPath,
});

function LearningPath() {
  const path = learningPath;

  return (
    <>
      {/* Encabezado */}
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            <SparklesIcon className="size-4" />
            {path.eyebrow}
          </span>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {path.title}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            {path.description}
          </p>
        </div>
        <div className="flex w-fit items-center gap-3 rounded-xl bg-muted p-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FlagIcon className="size-5" />
          </div>
          <div>
            <span className="block text-xs text-muted-foreground">
              {path.goalLabel}
            </span>
            <span className="block text-sm font-semibold">{path.goal}</span>
          </div>
        </div>
      </section>

      {/* Progreso general */}
      <Card className="flex flex-col items-center justify-between gap-4 px-4 md:px-6">
        <div className="w-full flex-1 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{path.progress.label}</span>
            <span className="font-semibold text-primary">
              {path.progress.value}% completado
            </span>
          </div>
          <ProgressBar
            value={path.progress.value}
            size="lg"
            label={path.progress.label}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {path.progress.modulesAdvanced} de {path.progress.totalModules}{" "}
              módulos avanzados
            </span>
            <span>{path.progress.note}</span>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 self-stretch md:w-auto md:self-auto">
          <span className="flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1.5 text-xs text-muted-foreground">
            <BadgeCheckIcon className="size-4 text-primary" />
            {path.badges.lessonsDone}
          </span>
          <span className="flex items-center gap-1.5 rounded-lg bg-muted px-2 py-1.5 text-xs text-muted-foreground">
            <HourglassIcon className="size-4 text-foreground/60" />
            {path.badges.timeLeft}
          </span>
        </div>
      </Card>

      {/* Módulos + equipo pedagógico */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-8">
          {path.modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4">
          <Card className="gap-6">
            <CardHeader>
              <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
                <UsersIcon className="size-4" />
                Equipo pedagógico
              </span>
              <CardTitle className="text-xl">Tus tutores guía</CardTitle>
              <p className="text-sm text-muted-foreground">
                Cada tutor interviene en los momentos clave de tu ruta para
                darte estrategias específicas sin generar frustración.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="flex flex-col gap-3 rounded-xl bg-muted/60 p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="size-14">
                      <AvatarFallback className="bg-card text-sm font-semibold">
                        {tutor.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-primary">
                          {tutor.role}
                        </span>
                        <span className="size-2 rounded-full bg-primary" />
                      </div>
                      <h3 className="truncate text-base font-semibold">
                        {tutor.name}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {tutor.specialty}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tutor.description}
                  </p>
                  <div className="flex items-center gap-2 rounded-lg bg-card p-2 text-xs">
                    <LightbulbIcon className="size-4 shrink-0 text-primary" />
                    <span>{tutor.quote}</span>
                  </div>
                </div>
              ))}

              <div className="space-y-1 rounded-xl bg-muted/60 p-4">
                <div className="flex items-center gap-2 text-base">
                  <SparklesIcon className="size-4 text-primary" />
                  <span>{path.rationale.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {path.rationale.description}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card
            size="sm"
            className="flex-row items-center justify-between gap-3 px-3"
          >
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-card text-primary">
                <CalendarDaysIcon className="size-4" />
              </div>
              <div>
                <span className="block text-sm font-medium">
                  {path.weekly.title}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {path.weekly.detail}
                </span>
              </div>
            </div>
            <Button variant="link" size="sm">
              {path.weekly.action}
            </Button>
          </Card>
        </aside>
      </div>
    </>
  );
}

function ModuleCard({
  module,
}: {
  module: (typeof learningPath)["modules"][number];
}) {
  if (module.state === "scheduled") {
    return (
      <Card className="bg-muted/60">
        <CardContent className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <Badge variant="secondary" className="w-fit">
              {module.badge}
            </Badge>
            <h2 className="mt-1 text-lg font-semibold">{module.title}</h2>
            <p className="text-sm text-muted-foreground">
              {module.description}
            </p>
          </div>
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ClockIcon className="size-5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const isActive = module.state === "active";

  return (
    <Card
      className={`relative overflow-hidden ${isActive ? "" : "opacity-95"}`}
    >
      {isActive ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1.5 bg-primary"
        />
      ) : null}
      <CardContent className="flex flex-col gap-4 pl-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {module.badge}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {module.focus}
            </span>
          </div>
          <span
            className={`flex items-center gap-1 text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}
          >
            {isActive ? (
              <BadgeCheckIcon className="size-4" />
            ) : (
              <LockIcon className="size-4" />
            )}
            {isActive ? module.tutor : module.lockedNote}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-semibold">{module.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            {module.description}
          </p>
        </div>

        <div className="mt-1 flex flex-col gap-2">
          {module.items.map((item, index) => (
            <PathRow
              key={`${module.id}-${index}`}
              item={item}
              locked={module.state !== "active"}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PathRow({ item, locked }: { item: PathItem; locked: boolean }) {
  if (item.kind === "checkpoint") {
    return (
      <div className="flex flex-col items-start justify-between gap-3 rounded-lg bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
            <ListChecksIcon className="size-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-primary uppercase">
                Hito de verificación
              </span>
              <span className="text-xs text-muted-foreground">
                • {item.meta}
              </span>
            </div>
            <h3 className="text-base font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
        <Button variant={locked ? "ghost" : "secondary"} disabled={locked}>
          {item.action}
        </Button>
      </div>
    );
  }

  if (locked || item.status === "locked") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 p-3 text-muted-foreground">
        <span className="flex items-center gap-2 text-sm">
          <LockIcon className="size-4 shrink-0" />
          {item.title}
        </span>
        <span className="shrink-0 text-xs">Bloqueado</span>
      </div>
    );
  }

  if (item.status === "done") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg bg-muted p-4">
        <div className="flex items-center gap-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-primary">
            <CheckIcon className="size-4" />
          </div>
          <div>
            <h3 className="text-base font-medium">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0">
          Completada
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-lg bg-primary/5 p-4 ring-1 ring-primary/20 sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
          {item.code}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{item.title}</h3>
            <span className="size-2 rounded-full bg-primary animate-ping" />
          </div>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
      </div>
      <Button className="shrink-0 self-start sm:self-auto">
        Continuar Lección {item.code}
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
