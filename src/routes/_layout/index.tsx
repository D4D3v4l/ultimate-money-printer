import { ProgressBar } from "@/components/progress-bar";
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
  missionMap,
  portal,
  student,
  topicSearch,
  tutors,
  type MissionIcon,
  type MissionNode,
} from "@/lib/mock-data";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  BlocksIcon,
  BookOpenCheckIcon,
  CalendarDaysIcon,
  ClockIcon,
  CompassIcon,
  LockIcon,
  PieChartIcon,
  RocketIcon,
  SparklesIcon,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useState, type FormEvent } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_layout/")({
  component: MissionMap,
});

/** Equivalencia entre el dato plano y el icono de lucide de cada nivel. */
const missionIcons: Record<MissionIcon, LucideIcon> = {
  fraction: PieChartIcon,
  reading: BookOpenCheckIcon,
  problems: BlocksIcon,
};

function MissionMap() {
  const [topic, setTopic] = useState("");

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
      {/* Saludo */}
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
            ¡Hola, {student.name}!
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Elige una misión de tu ruta o crea una aventura con cualquier tema
            que se te ocurra.
          </p>
        </div>
        <div className="flex w-fit items-center gap-2 self-start rounded-xl bg-card px-4 py-2 ring-1 ring-foreground/10 md:self-auto">
          <CompassIcon className="size-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Estado:{" "}
            <strong className="font-semibold text-foreground">
              {portal.phase}
            </strong>
          </span>
        </div>
      </section>

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

      {/* Mapa de rutas secuenciales */}
      <Card className="gap-0 p-0">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                {missionMap.eyebrow}
              </span>
              <CardTitle className="mt-1 text-xl md:text-2xl">
                {missionMap.title}
              </CardTitle>
            </div>
            <Button
              variant="outline"
              render={<Link to="/learning-path" />}
              className="shrink-0"
            >
              {missionMap.viewAllAction}
              <ArrowRightIcon />
            </Button>
          </div>
          <CardDescription className="max-w-3xl text-sm">
            {missionMap.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <ol className="flex flex-col items-stretch gap-4 rounded-xl bg-muted/60 p-4 md:p-6 sm:flex-row sm:items-center sm:gap-0">
            {missionMap.nodes.map((node, index) => (
              <Fragment key={node.id}>
                {index > 0 ? <PathConnector /> : null}
                <MissionStep node={node} />
              </Fragment>
            ))}
          </ol>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{missionMap.progressNote}</span>
              <span className="font-medium text-foreground">
                {learningPath.progress.value}% completado
              </span>
            </div>
            <ProgressBar
              value={learningPath.progress.value}
              size="lg"
              label={learningPath.progress.label}
            />
          </div>

          {/* Tutores que acompañan la ruta */}
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
                  nivel por nivel.
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
 * Alta de misión por tema libre. Hoy sólo confirma el envío: la generación de
 * la historia-connectada vivirá en la pantalla de juego.
 */
function TopicSearchForm({
  topic,
  onTopicChange,
  onSubmit,
}: {
  topic: string
  onTopicChange: (value: string) => void
  onSubmit: (value: string) => void
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
      <Button
        type="submit"
        size="lg"
        className="h-10 shrink-0 px-4 md:w-auto"
      >
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
          <div key={item.label} className="flex items-center justify-between gap-2">
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

/** Línea punteada que une dos niveles consecutivos del mapa. */
function PathConnector() {
  return (
    <li
      aria-hidden="true"
      className="hidden h-0 flex-1 list-none border-t-2 border-dashed border-border sm:block"
    />
  );
}

/** Nodo del mapa: circular si está activo, atenuado si sigue bloqueado. */
function MissionStep({ node }: { node: MissionNode }) {
  const Icon = missionIcons[node.icon];
  const isActive = node.state === "active";

  const contents = (
    <>
      <Icon className="size-5" />
      <span className="text-xs font-semibold tracking-wide uppercase">
        {node.label}
      </span>
    </>
  );

  return (
    <li className="flex flex-1 flex-col items-center gap-3 text-center">
      {isActive && node.to ? (
        <Button
          render={<Link to={node.to} />}
          aria-label={`${node.label}: ${node.title}`}
          className="size-20 rounded-full p-0 transition-transform hover:scale-105"
        >
          {contents}
        </Button>
      ) : (
        <span
          aria-disabled="true"
          className="flex size-20 cursor-not-allowed flex-col items-center justify-center gap-1 rounded-full bg-card text-muted-foreground ring-1 ring-foreground/10"
        >
          {contents}
        </span>
      )}

      <div className="flex flex-col gap-1">
        <span className="flex items-center justify-center gap-1.5 text-sm font-medium">
          {isActive ? null : <LockIcon className="size-3.5 shrink-0" />}
          {node.title}
        </span>
        <span className="text-xs text-muted-foreground">
          {isActive ? node.action : node.lockedNote}
        </span>
      </div>
    </li>
  );
}