import { usePetFriendship } from "@/components/pet-friendship";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LightbulbIcon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
} from "lucide-react";
import { useState } from "react";
import mooseArt from "@/assets/moose.svg";
import rabbitArt from "@/assets/rabbit.svg";

export const Route = createFileRoute("/_layout/misiones")({
  component: MisionesPage,
});

/* -------------------------------------------------------------------------- */
/* Misiones de prueba                                                         */
/* -------------------------------------------------------------------------- */

type Side = "left" | "right";

type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type QuestionBase = {
  id: string;
  story: string;
  hint: string;
  points: number;
  /** Objeto del centro del lienzo. */
  stageArt: "pizza" | "coins";
  /** Solo el lado del lienzo que ocupa cada personaje. */
  cast: { alce: Side; conejo: Side };
};

type WriteQuestion = QuestionBase & {
  /** Entrada de texto/número. */
  type: "write";
  correctAnswers: string[];
};

type MultipleQuestion = QuestionBase & {
  /** Opción múltiple. */
  type: "multiple";
  options: QuestionOption[];
};

type Question = WriteQuestion | MultipleQuestion;

type Mission = {
  id: string;
  title: string;
  rewardPet: string;
  questions: Question[];
};

const MOCK_MISSIONS: Mission[] = [
  {
    id: "mision-1",
    title: "Módulo 1: La Pizza del Alce",
    rewardPet: "Conejo",
    questions: [
      {
        id: "mision-1-q1",
        type: "write",
        points: 20,
        stageArt: "pizza",
        story:
          "El Alce recortó su pizza en 8 rebanadas iguales. Le dio 3 rebanadas al Conejo y él se comió 2. ¿Cuántas rebanadas quedan en la caja?",
        correctAnswers: ["3", "tres"],
        hint: "Resta 3 y luego 2 del total inicial de 8 rebanadas.",
        cast: { alce: "left", conejo: "right" },
      },
      {
        id: "mision-1-q2",
        type: "multiple",
        points: 20,
        stageArt: "pizza",
        story:
          "De las 3 rebanadas que quedaron, el Conejo se come 1 y el Alce se come 1. ¿Qué fracción de la caja original queda?",
        options: [
          { id: "q2-o1", text: "A) 1/8 (un octavo)", isCorrect: false },
          { id: "q2-o2", text: "B) 2/8 (dos octavos)", isCorrect: true },
          { id: "q2-o3", text: "C) 3/8 (tres octavos)", isCorrect: false },
          { id: "q2-o4", text: "D) 1/4 (un cuarto)", isCorrect: false },
        ],
        hint: "Quedan 1 rebanada de las 8 originales: 1 de 8.",
        cast: { alce: "left", conejo: "right" },
      },
    ],
  },
  {
    id: "mision-2",
    title: "Módulo 1: El Botín Pirata",
    rewardPet: "Alce",
    questions: [
      {
        id: "mision-2-q1",
        type: "multiple",
        points: 25,
        stageArt: "coins",
        story:
          "El Capitán Alce encontró 12 monedas de oro y quiere repartirlas en partes iguales entre el Conejo, el Alce y el Perro Tutor. ¿Cuántas le tocan a cada uno?",
        options: [
          { id: "q1-o1", text: "A) 3 monedas cada uno", isCorrect: false },
          { id: "q1-o2", text: "B) 4 monedas cada uno", isCorrect: true },
          { id: "q1-o3", text: "C) 6 monedas cada uno", isCorrect: false },
          { id: "q1-o4", text: "D) 2 monedas cada uno", isCorrect: false },
        ],
        hint: "Divide 12 monedas entre los 3 personajes.",
        cast: { alce: "left", conejo: "right" },
      },
      {
        id: "mision-2-q2",
        type: "write",
        points: 25,
        stageArt: "coins",
        story:
          "El Conejo gastó 2 monedas en un dulce. ¿Cuántas monedas le quedan de las 4 que le tocaron?",
        correctAnswers: ["2", "dos"],
        hint: "Resta 2 a las 4 monedas que le tocaron.",
        cast: { alce: "right", conejo: "left" },
      },
    ],
  },
];

const typeLabels: Record<Question["type"], string> = {
  write: "Entrada de texto",
  multiple: "Opción múltiple",
};

/**
 * Cada SVG trae 3 vistas del personaje (frontal, lateral y posterior) en
 * columnas iguales. Recortar un tercio con `translateX` - 1/3 del ancho de la
 * imagen equivale exactamente a un tercio del recuadro -, así se muestra una
 * sola vista sin deformar la imagen.
 *
 * Los personajes miran al frente, se dan la vuelta (vista posterior) si la
 * respuesta es incorrecta y el alce gira a un lado (vista lateral) cuando el
 * Profe Perro le da la pista.
 */
const POSE_X = {
  front: 0,
  side: -100 / 3,
  back: -200 / 3,
} as const;

/** Alto de la celda de cada personaje: el conejo es el 60% del alce. */
const CHARACTER_HEIGHT = {
  alce: "h-44 sm:h-56 lg:h-64",
  conejo: "h-[6.75rem] sm:h-[8.4rem] lg:h-[9.6rem]",
} as const;

const missionPoints = (mission: Mission) =>
  mission.questions.reduce((total, question) => total + question.points, 0);

/* -------------------------------------------------------------------------- */
/* Vista                                                                       */
/* -------------------------------------------------------------------------- */

type AnswerStatus = "idle" | "correct" | "incorrect";

function MisionesPage() {
  const [missionIndex, setMissionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<AnswerStatus>("idle");
  const [hintVisible, setHintVisible] = useState(false);
  const [clearedMissions, setClearedMissions] = useState<string[]>([]);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const { levels, levelUp } = usePetFriendship();
  const mission = MOCK_MISSIONS[missionIndex];
  const question = mission.questions[questionIndex];
  const isLastQuestion = questionIndex === mission.questions.length - 1;
  const isLastMission = missionIndex === MOCK_MISSIONS.length - 1;
  const missionCleared = clearedMissions.includes(mission.id);

  function resetQuestion(index: number) {
    setQuestionIndex(index);
    setAnswer("");
    setSelectedOption(null);
    setStatus("idle");
    setHintVisible(false);
  }

  function goToMission(index: number) {
    setMissionIndex(index);
    resetQuestion(0);
  }

  function resolveAnswer(isCorrect: boolean) {
    setStatus(isCorrect ? "correct" : "incorrect");
    if (!isCorrect) return;

    setEarnedPoints((points) => points + question.points);

    if (isLastQuestion && !clearedMissions.includes(mission.id)) {
      setClearedMissions((cleared) => [...cleared, mission.id]);
      levelUp(mission.rewardPet);
    }
  }

  function handleSubmitWrite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (question.type !== "write") return;

    resolveAnswer(
      question.correctAnswers.some(
        (expected) => expected.toLowerCase() === answer.trim().toLowerCase(),
      ),
    );
  }

  function handleSelectOption(option: QuestionOption) {
    setSelectedOption(option.id);
    resolveAnswer(option.isCorrect);
  }

  return (
    <Card className="gap-0 p-0">
      {/* Cabecera del escenario */}
      <div className="flex flex-col gap-3 border-b px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="shrink-0"
            render={<Link to="/learning-path" />}
          >
            <ArrowLeftIcon />
            Volver a las Rutas
          </Button>
          <Badge variant="outline" className="hidden sm:inline-flex">
            {typeLabels[question.type]}
          </Badge>
        </div>

        <h1 className="text-lg font-semibold tracking-tight md:text-xl">
          {mission.title}
        </h1>

        <div className="flex items-center gap-2">
          <Badge className="gap-1 bg-amber-100 text-amber-800 ring-1 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30">
            <StarIcon />
            {missionPoints(mission)} Pts
          </Badge>
          <Badge variant="secondary" className="font-mono tabular-nums">
            {earnedPoints} pts
          </Badge>
        </div>
      </div>

      <CardContent className="flex flex-col gap-5">
        {/* Pregunta */}
        <p className="rounded-xl border-l-4 border-primary bg-muted p-5 text-base leading-relaxed md:text-lg">
          {question.story}
        </p>

        {/* Lienzo del escenario */}
        <div className="relative min-h-[23rem] overflow-hidden rounded-2xl border-2 border-dashed bg-gradient-to-b from-sky-100/80 via-card to-emerald-50/60 md:min-h-[27rem]">
          <SceneSky />
          <SceneGround />

          <CanvasCharacter
            src={mooseArt}
            alt="Alce, el capitán de la misión"
            name="Alce"
            side={question.cast.alce}
            height={CHARACTER_HEIGHT.alce}
            mood={status}
            lookingAside={hintVisible}
          />
          <CenterArt kind={question.stageArt} mood={status} />
          <CanvasCharacter
            src={rabbitArt}
            alt="Conejo, tu compañero de ruta"
            name="Conejo"
            side={question.cast.conejo}
            height={CHARACTER_HEIGHT.conejo}
            mood={status}
          />

          <span className="absolute top-3 left-3 rounded-md bg-card/80 px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10">
            Pregunta {questionIndex + 1} / {mission.questions.length}
          </span>
          {status === "correct" ? (
            <span className="absolute top-3 right-3 flex items-center gap-1 rounded-md bg-card/80 px-2 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
              <TrophyIcon className="size-3.5" />+{question.points} pts
            </span>
          ) : null}
        </div>

        {/* Respuesta */}
        {question.type === "write" ? (
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmitWrite}>
            <Input
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder="Escribe tu respuesta (ej: 3, tres)"
              aria-label="Tu respuesta"
              className="h-12 rounded-xl text-base"
            />
            <Button type="submit" size="lg" className="h-12 shrink-0 rounded-xl">
              Enviar 🚀
            </Button>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const showAsCorrect = isSelected && option.isCorrect;
              const showAsWrong = isSelected && !option.isCorrect;

              return (
                <Button
                  key={option.id}
                  type="button"
                  variant="outline"
                  className={cn(
                    "h-auto justify-start rounded-xl border-2 px-4 py-4 text-left text-base font-semibold",
                    showAsCorrect && "border-primary bg-primary/5 text-primary",
                    showAsWrong && "border-destructive bg-destructive/5 text-destructive",
                    !showAsCorrect &&
                      !showAsWrong &&
                      "hover:border-primary hover:text-primary",
                  )}
                  onClick={() => handleSelectOption(option)}
                >
                  {option.text}
                </Button>
              );
            })}
          </div>
        )}

        {/* Retroalimentación */}
        {status === "correct" ? (
          <div className="flex flex-col gap-3 rounded-xl bg-primary/5 p-4 ring-1 ring-primary/20 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <SparklesIcon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-primary">
                  🎉 ¡Correcto! +{question.points} puntos
                </p>
                {missionCleared ? (
                  <p className="text-sm text-muted-foreground">
                    Misión completada: {mission.rewardPet} subió a Nv.{" "}
                    {levels[mission.rewardPet] ?? 1}.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Te falta{" "}
                    {mission.questions.length - questionIndex - 1} pregunta
                    {mission.questions.length - questionIndex - 1 === 1 ? "" : "s"}
                    .
                  </p>
                )}
              </div>
            </div>
            {isLastQuestion ? (
              isLastMission ? (
                <Button
                  variant="secondary"
                  className="shrink-0"
                  render={<Link to="/learning-path" />}
                >
                  Volver a las Rutas
                </Button>
              ) : (
                <Button
                  className="shrink-0"
                  onClick={() => goToMission(missionIndex + 1)}
                >
                  Siguiente misión
                  <ChevronRightIcon />
                </Button>
              )
            ) : (
              <Button
                className="shrink-0"
                onClick={() => resetQuestion(questionIndex + 1)}
              >
                Siguiente pregunta
                <ChevronRightIcon />
              </Button>
            )}
          </div>
        ) : null}

        {status === "incorrect" ? (
          <p className="rounded-xl bg-destructive/5 p-4 font-medium text-destructive ring-1 ring-destructive/20">
            💡 Inténtalo de nuevo. Puedes pedirle una pista al Profe Perro Tutor.
          </p>
        ) : null}

        {/* Profe Perro Tutor */}
        <div className="flex flex-col gap-4 rounded-xl border-2 border-dashed border-destructive/40 bg-destructive/5 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-card ring-1 ring-foreground/10">
              <TutorDogArt />
            </span>
            <div>
              <p className="font-semibold">Profe Perro Tutor</p>
              {hintVisible ? (
                <p className="text-sm text-muted-foreground">
                  <LightbulbIcon className="mr-1 inline size-3.5 text-primary" />
                  {question.hint}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  ¿Necesitas ayuda para resolver la lección?
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => setHintVisible((visible) => !visible)}
          >
            🔍 Pedir Pista
          </Button>
        </div>

        {/* Navegación de prueba */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/60 p-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={missionIndex === 0}
              onClick={() => goToMission(missionIndex - 1)}
            >
              <ChevronLeftIcon />
              Misión anterior
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isLastMission}
              onClick={() => goToMission(missionIndex + 1)}
            >
              Siguiente misión
              <ChevronRightIcon />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <ol className="flex items-center gap-1.5">
              {mission.questions.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-label={`Ir a la pregunta ${index + 1}`}
                    aria-current={index === questionIndex}
                    onClick={() => resetQuestion(index)}
                    className={cn(
                      "size-2.5 rounded-full ring-1 transition-colors",
                      index === questionIndex
                        ? "bg-primary ring-primary"
                        : "bg-card ring-foreground/20 hover:bg-muted",
                    )}
                  />
                </li>
              ))}
            </ol>
            {missionCleared ? (
              <span className="flex items-center gap-1 text-xs font-medium text-primary">
                <TrophyIcon className="size-3.5" />
                Misión superada
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                Misión {missionIndex + 1} de {MOCK_MISSIONS.length}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Piezas del lienzo                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Personaje del lienzo. Recorta una sola vista del SVG y la ancla al suelo:
 * mira al frente mientras se responde, se da la vuelta (vista posterior) si la
 * respuesta es incorrecta y gira a un lado (vista lateral) cuando le piden
 * pista al Profe Perro.
 */
function CanvasCharacter({
  src,
  alt,
  name,
  side,
  height,
  mood,
  lookingAside = false,
}: {
  src: string;
  alt: string;
  name: string;
  side: Side;
  height: string;
  mood: AnswerStatus;
  lookingAside?: boolean;
}) {
  const pose = mood === "incorrect" ? "back" : lookingAside ? "side" : "front";

  return (
    <figure
      className={cn(
        "absolute bottom-[24%] transition-transform duration-500 ease-out",
        side === "left" ? "left-[13%] sm:left-[19%]" : "right-[13%] sm:right-[19%]",
        mood === "correct" &&
          (side === "left" ? "translate-x-8" : "-translate-x-8"),
        lookingAside && "rotate-6",
      )}
    >
      <div
        className={cn(
          "relative",
          mood === "correct" && "animate-hop",
          mood === "incorrect" && "animate-shake",
        )}
      >
        <div className={cn("aspect-7/12 w-auto overflow-hidden", height)}>
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="h-full w-[300%] max-w-none drop-shadow-sm transition-transform duration-500"
            style={{ transform: `translateX(${POSE_X[pose]}%)` }}
          />
        </div>
        {/* Sombra en el suelo */}
        <span
          aria-hidden
          className="absolute -bottom-1 left-1/2 h-2.5 w-2/3 -translate-x-1/2 rounded-[100%] bg-foreground/15 blur-[2px]"
        />
      </div>
      <figcaption className="mt-3 text-center text-xs font-semibold text-muted-foreground">
        {name}
      </figcaption>
    </figure>
  );
}

/** Cielo del lienzo: sol, nubes y destellos. */
function SceneSky() {
  return (
    <>
      <span
        aria-hidden
        className="absolute top-5 right-8 size-9 rounded-full bg-amber-200/90 ring-8 ring-amber-100/70"
      />
      <CloudArt className="absolute top-8 left-10 h-6 w-20 text-white/90" />
      <CloudArt className="absolute top-16 left-1/3 h-4 w-14 text-white/70" />
      <SparklesIcon
        aria-hidden
        className="absolute top-6 left-1/2 size-4 animate-pulse text-amber-400"
      />
      <SparklesIcon
        aria-hidden
        className="absolute top-20 right-1/4 size-3 animate-pulse text-primary/40 [animation-delay:400ms]"
      />
    </>
  );
}

function CloudArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 34" className={className} aria-hidden>
      <path
        d="M22 32a11 11 0 0 1 1-21 15 15 0 0 1 28-3 10 10 0 0 1 10 24Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Suelo del lienzo: horizonte punteado, pradera y piedras. */
function SceneGround() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[24%] bg-gradient-to-t from-emerald-100/90 via-lime-50/70 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-[24%] border-t-2 border-dashed border-emerald-200/80"
      />
      <svg
        aria-hidden
        viewBox="0 0 40 20"
        className="absolute bottom-2 left-[22%] h-5 w-10 text-emerald-300"
      >
        <path
          d="M2 20c0-8 4-14 4-14s4 6 4 14M14 20c0-10 5-17 5-17s5 7 5 17M28 20c0-7 4-12 4-12s4 5 4 12"
          fill="currentColor"
        />
      </svg>
      <svg
        aria-hidden
        viewBox="0 0 40 20"
        className="absolute bottom-1 right-[18%] h-4 w-8 text-emerald-300/80"
      >
        <path
          d="M2 20c0-6 4-11 4-11s4 5 4 11M16 20c0-8 4-13 4-13s4 5 4 13M30 20c0-5 3-9 3-9s3 4 3 9"
          fill="currentColor"
        />
      </svg>
    </>
  );
}

/** Objeto central sobre un pedestal. */
function CenterArt({ kind, mood }: { kind: Question["stageArt"]; mood: AnswerStatus }) {
  return (
    <div className="absolute inset-x-0 top-[42%] flex -translate-y-1/2 justify-center">
      <div className="relative flex flex-col items-center">
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 ring-1 ring-primary/10",
            mood === "correct" && "animate-pop",
          )}
        />
        <div
          className={cn(
            "relative flex size-28 items-center justify-center rounded-full bg-card/85 shadow-sm ring-1 ring-foreground/10 backdrop-blur-sm",
            mood === "correct" && "animate-pop",
          )}
        >
          {kind === "pizza" ? <PizzaArt /> : <CoinsArt />}
        </div>
        <span
          aria-hidden
          className="mt-1 h-2.5 w-24 rounded-[100%] bg-foreground/15 blur-[2px]"
        />
      </div>
    </div>
  );
}

function PizzaArt() {
  return (
    <svg viewBox="0 0 100 100" className="size-20" aria-hidden>
      <circle cx="50" cy="50" r="45" fill="#E28743" stroke="#B3541E" strokeWidth="3" />
      <path d="M 50 50 L 50 5 A 45 45 0 0 1 89 27.5 Z" fill="#FFF5E6" stroke="#CBD5E1" strokeDasharray="2" />
      <path d="M 50 50 L 89 27.5 A 45 45 0 0 1 89 72.5 Z" fill="#FFF5E6" stroke="#CBD5E1" strokeDasharray="2" />
      <path d="M 50 50 L 89 72.5 A 45 45 0 0 1 50 95 Z" fill="#FFF5E6" stroke="#CBD5E1" strokeDasharray="2" />
      <path d="M 50 50 L 50 95 A 45 45 0 0 1 11 72.5 Z" fill="#FFD166" stroke="#B3541E" strokeWidth="1.5" />
      <path d="M 50 50 L 11 72.5 A 45 45 0 0 1 11 27.5 Z" fill="#FFD166" stroke="#B3541E" strokeWidth="1.5" />
      <path d="M 50 50 L 11 27.5 A 45 45 0 0 1 50 5 Z" fill="#FFD166" stroke="#B3541E" strokeWidth="1.5" />
    </svg>
  );
}

function CoinsArt() {
  return (
    <svg viewBox="0 0 120 100" className="size-20" aria-hidden>
      <g fill="#F5C542" stroke="#B8860B" strokeWidth="3">
        <circle cx="38" cy="62" r="24" />
        <circle cx="72" cy="58" r="24" />
        <circle cx="56" cy="36" r="24" />
      </g>
      <g fill="#E0A800">
        <circle cx="56" cy="36" r="7" />
        <circle cx="38" cy="62" r="7" />
        <circle cx="72" cy="58" r="7" />
      </g>
    </svg>
  );
}

function TutorDogArt() {
  return (
    <svg viewBox="0 0 48 48" className="size-9" aria-hidden>
      <ellipse cx="11" cy="18" rx="6" ry="11" fill="#8B5E34" />
      <ellipse cx="37" cy="18" rx="6" ry="11" fill="#8B5E34" />
      <circle cx="24" cy="22" r="14" fill="#A9713F" />
      <circle cx="18" cy="20" r="3" fill="#2D3436" />
      <circle cx="30" cy="20" r="3" fill="#2D3436" />
      <ellipse cx="24" cy="30" rx="4" ry="3" fill="#2D3436" />
      <path
        d="M 24 33 q 5 5 10 0"
        fill="none"
        stroke="#2D3436"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M 21 36 q 3 6 6 0 Z" fill="#FF8FA3" />
    </svg>
  );
}