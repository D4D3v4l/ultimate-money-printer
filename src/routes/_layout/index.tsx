import { ProgressBar } from "@/components/progress-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Input } from "@/components/ui/input";
import {
  learningPath,
  portal,
  routesSection,
  themeRoutes,
  topicSearch,
  tutors,
  type RouteIcon,
  type Story,
  type ThemeRoute,
} from "@/lib/mock-data";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  BlocksIcon,
  BookOpenCheckIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  LockIcon,
  PieChartIcon,
  PlayIcon,
  RocketIcon,
  SparklesIcon,
  StarIcon,
  type LucideIcon,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/")({
  component: MissionMap,
});

/** Equivalencia entre el dato plano y el icono de lucide de cada ruta. */
const routeIcons: Record<RouteIcon, LucideIcon> = {
  fraction: PieChartIcon,
  reading: BookOpenCheckIcon,
  problems: BlocksIcon,
};

/** Variante de `Badge` según el estado derivado de la ruta. */
const routeStatusVariants = {
  active: "default",
  completed: "secondary",
  locked: "outline",
} as const;

type RouteStatus = keyof typeof routeStatusVariants;

/**
 * Estado de la ruta derivado de sus historias: completada si todas están
 * hechas, en curso si hay algo empezado y bloqueada si ninguna se ha abierto.
 * No se guarda en los datos para que ambos nunca se desincronicen.
 */
function getRouteStatus(route: ThemeRoute): RouteStatus {
  const done = route.stories.filter((story) => story.status === "done").length;

  if (done === route.stories.length) {
    return "completed";
  }

  const started =
    done > 0 || route.stories.some((story) => story.status === "current");

  return started ? "active" : "locked";
}

function MissionMap() {
  const [topic, setTopic] = useState("");

  const allStories = themeRoutes.flatMap((route) => route.stories);
  const doneStories = allStories.filter(
    (story) => story.status === "done",
  ).length;
  const overallProgress = Math.round((doneStories / allStories.length) * 100);
  /** Las rutas en curso se abren por defecto para no esconder el siguiente paso. */
  const openRouteIds = themeRoutes
    .filter((route) => getRouteStatus(route) === "active")
    .map((route) => route.id);

  /** Valida el tema y confirma la misión; la historia se generará en el juego. */
  function handleTopicSubmit(value: string) {
    const cleanTopic = value.trim();

    if (!cleanTopic) {
      toast.error(topicSearch.emptyError);
      return;
    }

    toast.success(topicSearch.created, {
      description: cleanTopic,
    });
    setTopic("");
  }

  return (
    <>
      {/* Buscador de tema libre */}
      <Card
        size="sm"
        className="gap-0 p-3 md:flex-row md:items-center md:gap-3"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
          <SparklesIcon className="size-4" />
        </div>
        <TopicSearchForm
          topic={topic}
          onTopicChange={setTopic}
          onSubmit={handleTopicSubmit}
        />
      </Card>

      {/* Test de diagnóstico inicial */}
      <DiagnosticCallout />

      {/* Rutas por tema: un acordeón por ruta, con sus historias dentro */}
      <Card className="gap-0 p-0">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                {routesSection.eyebrow}
              </span>
              <CardTitle className="mt-1 text-xl md:text-2xl">
                {routesSection.title}
              </CardTitle>
            </div>
            <Button
              variant="outline"
              render={<Link to="/learning-path" />}
              className="shrink-0"
            >
              {routesSection.viewAllAction}
              <ArrowRightIcon />
            </Button>
          </div>
          <CardDescription className="max-w-3xl text-sm">
            {routesSection.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Accordion multiple defaultValue={openRouteIds} className="gap-2">
            {themeRoutes.map((route) => (
              <RouteItem key={route.id} route={route} />
            ))}
          </Accordion>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {doneStories} de {allStories.length} {routesSection.storiesUnit}
              </span>
              <span className="font-medium text-foreground">
                {overallProgress}% completado
              </span>
            </div>
            <ProgressBar
              value={overallProgress}
              size="lg"
              label={learningPath.progress.label}
            />
          </div>

          {/* Tutores que acompañan las rutas */}
          <div className="flex flex-col gap-2 rounded-xl bg-muted/60 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <AvatarGroup>
                {tutors.map((tutor) => (
                  <Avatar key={tutor.id} className="size-8">
                    <AvatarFallback className="text-[0.65rem] font-semibold">
                      {tutor.initials}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </AvatarGroup>
              <div>
                <span className="block text-sm font-medium">
                  Tus tutores guía
                </span>
                <span className="block text-xs text-muted-foreground">
                  {tutors.map((tutor) => tutor.name).join(" y ")} te acompañan
                  tema por tema.
                </span>
              </div>
            </div>
            <span className="flex w-fit items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-xs text-muted-foreground ring-1 ring-foreground/10">
              <CalendarDaysIcon className="size-4 text-primary" />
              {learningPath.weekly.detail}
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/**
 * Alta de misión por tema libre. Por ahora sólo confirma el envío: la
 * generación de la historia vivirá en la pantalla de juego.
 */
function TopicSearchForm({
  topic,
  onTopicChange,
  onSubmit,
}: {
  topic: string;
  onTopicChange: (value: string) => void;
  onSubmit: (value: string) => void;
}) {
  return (
    <form
      className="flex flex-1 flex-col gap-2 md:flex-row md:items-center md:gap-2"
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(topic);
      }}
    >
      <Input
        value={topic}
        onChange={(event) => onTopicChange(event.target.value)}
        placeholder={topicSearch.placeholder}
        aria-label={topicSearch.label}
        className="md:h-10 md:text-base"
      />
      <Button type="submit" size="lg" className="h-10 shrink-0 px-4 md:w-auto">
        {topicSearch.action}
      </Button>
    </form>
  );
}

/** Tarjeta destacada que enlaza al paso obligatorio del diagnóstico. */
function DiagnosticCallout() {
  const diagnostic = portal.diagnostic;

  return (
    <Card className="gap-0 p-0 lg:flex-row lg:items-stretch lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 p-4 lg:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="uppercase">
            {diagnostic.recommendation}
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
          Descubre tus superpoderes en {tutors[0].specialty.toLowerCase()} y{" "}
          {tutors[1].specialty.toLowerCase()}, acompañado de{" "}
          <strong className="font-medium text-foreground">
            {tutors[0].name}
          </strong>{" "}
          y{" "}
          <strong className="font-medium text-foreground">
            {tutors[1].name}
          </strong>
          .
        </p>
        <div>
          <Button
            size="lg"
            className="h-10 px-4"
            render={<Link to="/diagnostic" />}
          >
            Lanzar Test
            <RocketIcon />
          </Button>
        </div>
      </div>

      <div className="flex w-full flex-col justify-center gap-2 border-t bg-muted/60 p-4 lg:w-64 lg:shrink-0 lg:border-t-0 lg:border-l">
        {diagnostic.meta.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-2"
          >
            <span className="text-xs text-muted-foreground">{item.label}</span>
            <span
              className={
                item.pending
                  ? "text-xs font-semibold text-primary"
                  : "text-xs font-semibold"
              }
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Encabezado del acordeón: tema, materia, tutor y avance de la ruta. */
function RouteItem({ route }: { route: ThemeRoute }) {
  const Icon = routeIcons[route.icon];
  const status = getRouteStatus(route);
  const done = route.stories.filter((story) => story.status === "done").length;

  return (
    <AccordionItem value={route.id} className="rounded-lg border">
      <AccordionTrigger className="items-center gap-3 px-2.5 py-3 hover:no-underline">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
          <Icon className="size-4" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate">{route.theme}</span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {route.subject} • {route.tutor} • {done}/{route.stories.length}{" "}
            {routesSection.storiesUnit}
          </span>
        </span>
        <Badge variant={routeStatusVariants[status]}>
          {routesSection.statusLabels[status]}
        </Badge>
      </AccordionTrigger>

      <AccordionContent className="px-2.5">
        <p className="mb-4 text-muted-foreground">{route.summary}</p>
        <ul className="flex flex-col gap-2">
          {route.stories.map((story) => (
            <StoryRow key={story.id} story={story} />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

/** Una historia: qué hay que hacer, cuánto pesa y si ya está resuelta. */
function StoryRow({ story }: { story: Story }) {
  const statusIcon =
    story.status === "done" ? (
      <CheckIcon className="size-4" />
    ) : story.status === "current" ? (
      <PlayIcon className="size-4" />
    ) : (
      <LockIcon className="size-4" />
    );

  return (
    <li className="flex flex-col items-start gap-3 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground ring-1 ring-foreground/10">
          {statusIcon}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-sm font-medium">{story.title}</span>
          <span className="text-xs text-muted-foreground">
            {story.description}
          </span>
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              {story.duration}
            </span>
            <span aria-hidden="true">•</span>
            <span className="flex items-center gap-1">
              <StarIcon className="size-3" />+{story.points} pts
            </span>
          </span>
        </div>
      </div>

      <StoryAction status={story.status} />
    </li>
  );
}

/** Acción de la historia según su estado. */
function StoryAction({ status }: { status: Story["status"] }) {
  if (status === "done") {
    return (
      <Badge variant="secondary" className="shrink-0 self-start sm:self-auto">
        {routesSection.statusLabels.completed}
      </Badge>
    );
  }

  if (status === "locked") {
    return (
      <Button size="sm" disabled className="shrink-0 self-start sm:self-auto">
        <LockIcon data-icon="inline-start" />
        {routesSection.statusLabels.locked}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      render={<Link to="/diagnostic" />}
      className="shrink-0 self-start sm:self-auto"
    >
      <PlayIcon data-icon="inline-start" />
      Jugar
    </Button>
  );
}
