import { FractionFigure } from "@/components/fraction-figure";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ProgressBar } from "@/components/progress-bar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { diagnosticQuestions, type DiagnosticOption } from "@/lib/mock-data";
import { Link, createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  TimerIcon,
} from "lucide-react";
import { cn } from "cn";

export const Route = createFileRoute("/_layout/diagnostic")({
  component: Diagnostic,
});

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function Diagnostic() {
  const total = diagnosticQuestions.length;
  const [index, setIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const question = diagnosticQuestions[index];
  const selected = answers[question.id];
  const isLast = index === total - 1;
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round(((index + 1) / total) * 100);

  return (
    <>
      {/* Estado del examen */}
      <Card size="sm" className="gap-3">
        <CardHeader className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="uppercase">
              Pregunta {index + 1} de {total}
            </Badge>
            <span className="text-base font-medium">{question.block}</span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
            <TimerIcon className="size-4" />
            Tiempo transcurrido: {formatElapsed(elapsed)}
          </span>
        </CardHeader>
        <CardContent>
          <ProgressBar value={progress} label="Progreso del examen" />
        </CardContent>
      </Card>

      {/* Reactivo */}
      <Card className="gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Ítem N.º {question.id}
            </span>
            <Badge variant="secondary">
              Valor: {question.points}{" "}
              {question.points === 1 ? "punto" : "puntos"}
            </Badge>
          </div>
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            {question.prompt}
          </h1>
          <p className="text-sm text-muted-foreground">{question.hint}</p>
        </div>

        {question.passage ? (
          <blockquote className="rounded-xl border-l-2 border-primary bg-muted/60 p-4 text-sm leading-relaxed md:text-base">
            {question.passage}
          </blockquote>
        ) : null}

        {question.figure ? <FractionFigure figure={question.figure} /> : null}

        <RadioGroup
          value={selected ?? null}
          onValueChange={(value) =>
            setAnswers((current) => ({
              ...current,
              [question.id]: value as string,
            }))
          }
          aria-label="Opciones de respuesta"
        >
          {question.options.map((option) => (
            <AnswerOption
              key={option.key}
              questionId={question.id}
              option={option}
              checked={selected === option.key}
            />
          ))}
        </RadioGroup>
      </Card>

      {/* Controles */}
      <Card size="sm">
        <CardContent className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            size="lg"
            className="h-10"
            disabled={index === 0}
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
          >
            <ArrowLeftIcon />
            Anterior
          </Button>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 tabular-nums">
              {answeredCount}/{total} respondidas
            </span>
            <span className="flex items-center gap-1.5">
              {selected ? (
                <CheckCircleIcon className="size-4 text-primary" />
              ) : (
                <ClockIcon className="size-4" />
              )}
              {selected ? "Guardado automático" : "Sin respuesta aún"}
            </span>
          </div>

          {isLast ? (
            <Button size="lg" className="h-10" render={<Link to="/results" />}>
              Finalizar diagnóstico
              <ArrowRightIcon />
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-10"
              onClick={() =>
                setIndex((value) => Math.min(total - 1, value + 1))
              }
            >
              Siguiente pregunta
              <ArrowRightIcon />
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function AnswerOption({
  questionId,
  option,
  checked,
}: {
  questionId: number;
  option: DiagnosticOption;
  checked: boolean;
}) {
  const id = `question-${questionId}-${option.key}`;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center justify-between gap-4 rounded-xl border bg-card p-4 transition-colors",
        checked
          ? "border-primary bg-muted/60 ring-1 ring-primary"
          : "border-border hover:bg-muted/50",
      )}
    >
      <span className="flex items-center gap-4">
        <span
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            checked
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-foreground",
          )}
        >
          {option.key}
        </span>
        <span className="flex flex-col">
          <span className="text-base font-semibold">{option.label}</span>
          <span className="text-sm text-muted-foreground">
            {option.description}
          </span>
        </span>
      </span>
      <RadioGroupItem id={id} value={option.key} />
    </label>
  );
}
