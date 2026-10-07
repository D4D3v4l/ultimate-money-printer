import { ProgressBar } from "@/components/progress-bar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  learningPath,
  mascots,
  portal,
  routesSection,
  student,
  themeRoutes,
  topicSearch,
  type RouteIcon,
  type Story,
  type ThemeRoute,
} from "@/lib/mock-data";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  BlocksIcon,
  BookOpenCheckIcon,
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

/** Equivalencia entre el dato plano y el icono de lucide de cada ruta. */
const routeIcons: Record<RouteIcon, LucideIcon> = {
  fraction: PieChartIcon,
  reading: BookOpenCheckIcon,
  problems: BlocksIcon,
};

/**
 * Variante de `Badge` según el estado de la ruta.
 *
 * Una ruta nunca está "bloqueada": los temas son independientes y siempre se
 * puede abrir el que quieras. El bloqueo solo existe entre historias.
 */
const routeStatusVariants = {
  active: "default",
  completed: "secondary",
} as const;

type RouteStatus = keyof typeof routeStatusVariants;

/**
 * Estado de la ruta derivado de sus historias: completada si todas están
 * hechas y en curso en cualquier otro caso. No se guarda en los datos para que
 * ambos nunca se desincronicen.
 */
function getRouteStatus(route: ThemeRoute): RouteStatus {
  const done = route.stories.filter((story) => story.status === "done").length;

  return done === route.stories.length ? "completed" : "active";
}

/**
 * Vista de rutas por tema del prototipo: buscador de tema libre, paso
 * obligatorio del diagnóstico y el acordeón de rutas con sus historias.
 *
 * Se sirve tanto en `/` como en `/learning-path`: las dos rutas muestran la
 * misma vista, así que vive aquí en vez de duplicarse por ruta.
 */
export function LearningPaths() {
  const [topic, setTopic] = useState("");

  /** En `/learning-path` el enlace "ver ruta completa" apuntaría a sí mismo. */
  const isFullRoute = useRouterState({
    select: (state) => state.location.pathname === "/learning-path",
  });

  const allStories = themeRoutes.flatMap((route) => route.stories);
  const doneStories = allStories.filter(
    (story) => story.status === "done",
  ).length;
  const overallProgress = Math.round((doneStories / allStories.length) * 100);
  /**
   * Los acordeones abren cerrados: la lista de rutas se lee de un vistazo y
   * el alumno despliega solo la que le interesa. Base UI espera un array, así
   * que se deja vacío en lugar de omitir la prop.
   */
  const closedByDefault: string[] = [];

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
      {/* El prototipo abre con un saludo; aquí la vista arranca en el buscador,
          así que el h1 queda disponible para lectores de pantalla. */}
      <h1 className="sr-only">
        {routesSection.title} de {student.name}
      </h1>

      {/* Buscador de tema libre */}
      <TopicSearchForm
        topic={topic}
        onTopicChange={setTopic}
        onSubmit={handleTopicSubmit}
      />

      {/* Test de diagnóstico inicial */}
      <DiagnosticCallout />

      {/* Rutas por tema: un acordeón por ruta, con sus historias dentro */}
      <section className="flex flex-col gap-4">
        {/* Sin padding horizontal: el título, la descripción y el avance global
            comparten el mismo borde izquierdo que el acordeón. */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              {routesSection.title}
            </h2>
            {isFullRoute ? null : (
              <Button
                variant="outline"
                render={<Link to="/learning-path" />}
                className="shrink-0"
              >
                {routesSection.viewAllAction}
                <ArrowRightIcon />
              </Button>
            )}
          </div>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {routesSection.description}
          </p>
        </div>

        {/* Avance global: resume el conjunto de rutas, así que va antes del
            acordeón y no al final, donde parecía un pie de sección. */}
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

        <Accordion multiple defaultValue={closedByDefault} className="gap-2">
          {themeRoutes.map((route) => (
            <RouteItem key={route.id} route={route} />
          ))}
        </Accordion>
      </section>
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
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(topic);
      }}
    >
      <InputGroup className="h-10">
        <InputGroupAddon>
          <SparklesIcon />
        </InputGroupAddon>

        <InputGroupInput
          value={topic}
          onChange={(event) => onTopicChange(event.target.value)}
          placeholder={topicSearch.placeholder}
          aria-label={topicSearch.label}
          className="text-base"
        />

        {/*
          En móvil el input se queda con el ancho que hay, así que el botón
          se reduce al icono. Desde `md` vuelve a su ancho natural con el
          texto: el `sr-only` mantiene el nombre accesible en ambos tamaños.
        */}
        <InputGroupAddon align="inline-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <InputGroupButton
                  type="submit"
                  variant="secondary"
                  size="sm"
                  aria-label={topicSearch.action}
                />
              }
            >
              {/*
                Sin `data-icon`: el botón es cuadrado en móvil y ese atributo
                aplica `pl-2`, que descentra el icono. En `md` el `gap-1.5`
                base del `Button` ya separa icono y texto.
              */}
              <RocketIcon />
              <span className="sr-only md:not-sr-only">
                {topicSearch.action}
              </span>
            </TooltipTrigger>
            <TooltipContent>{topicSearch.action}</TooltipContent>
          </Tooltip>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

/** Tarjeta destacada que enlaza al paso obligatorio del diagnóstico. */
function DiagnosticCallout() {
  const diagnostic = portal.diagnostic;

  return (
    <Card className="gap-0 p-0">
      {/*
        En móvil el botón va bajo el texto, alineado a la izquierda. Desde
        `lg` pasa a una columna propia a la derecha, centrada en la altura
        gracias a `items-center` del contenedor.
      */}
      <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">
              {diagnostic.title}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">
              {diagnostic.metaLine}
            </p>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Descubre tus superpoderes en matemáticas y lectura junto al{" "}
            <strong className="font-medium text-foreground">
              {mascots[0].name}
            </strong>{" "}
            y al{" "}
            <strong className="font-medium text-foreground">
              {mascots[1].name}
            </strong>
            .
          </p>
        </div>
        <div className="lg:shrink-0">
          <Button
            size="lg"
            className="h-10 w-full px-4 lg:w-auto"
            render={<Link to="/diagnostic" />}
          >
            Lanzar Test
            <RocketIcon />
          </Button>
        </div>
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
            {route.subject} • {done}/{route.stories.length}{" "}
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

      <StoryAction story={story} />
    </li>
  );
}

/**
 * Acción de la historia según su estado. Toda historia jugable -en curso o ya
 * completada- lleva a su misión en `/misiones`; la búsqueda por `historia` hace
 * que se abra esa y no la primera. Las bloqueadas siguen sin enlace.
 */
function StoryAction({ story }: { story: Story }) {
  if (story.status === "locked") {
    return (
      <Button size="sm" disabled className="shrink-0 self-start sm:self-auto">
        <LockIcon data-icon="inline-start" />
        {routesSection.statusLabels.locked}
      </Button>
    );
  }

  if (story.status === "done") {
    return (
      <Button
        size="sm"
        variant="secondary"
        render={<Link to="/misiones" search={{ historia: story.id }} />}
        className="shrink-0 self-start sm:self-auto"
      >
        <CheckIcon data-icon="inline-start" />
        {routesSection.statusLabels.completed}
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      render={<Link to="/misiones" search={{ historia: story.id }} />}
      className="shrink-0 self-start sm:self-auto"
    >
      <PlayIcon data-icon="inline-start" />
      Jugar
    </Button>
  );
}
