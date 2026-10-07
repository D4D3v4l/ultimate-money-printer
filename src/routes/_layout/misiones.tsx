import { usePetFriendship } from "@/components/pet-friendship";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { themeRoutes } from "@/lib/mock-data";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
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
  /** La historia jugable se elige desde la vista de rutas. */
  validateSearch: (search: Record<string, unknown>) => ({
    historia: typeof search.historia === "string" ? search.historia : undefined,
  }),
  component: MisionesPage,
});

/* -------------------------------------------------------------------------- */
/* Misiones de las rutas                                                      */
/* -------------------------------------------------------------------------- */

type Side = "left" | "right";

/** Objeto que ocupa el centro del lienzo. */
type StageArt = "pizza" | "coins" | "tape" | "book" | "ticket";

type QuestionOption = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type QuestionBase = {
  id: string;
  story: string;
  hint: string;
  stageArt: StageArt;
  /** Solo el lado del lienzo que ocupa cada personaje. */
  cast: { alce: Side; conejo: Side };
};

type QuestionSpec =
  | (QuestionBase & {
      type: "write";
      correctAnswers: string[];
    })
  | (QuestionBase & {
      type: "multiple";
      options: QuestionOption[];
    });

/** Misión jugable: los puntos salen de la historia de la ruta. */
type Mission = {
  id: string;
  title: string;
  points: number;
  rewardPet: string;
  questions: (QuestionSpec & { points: number })[];
};

/**
 * Reto de cada historia de las rutas. La lista de historias vive en
 * `mock-data.ts`; aquí solo está el contenido jugable de cada una.
 */
const STORY_CHALLENGES: Record<
  string,
  { rewardPet: string; questions: QuestionSpec[] }
> = {
  "fracciones-1": {
    rewardPet: "Conejo",
    questions: [
      {
        id: "fracciones-1-q1",
        type: "multiple",
        stageArt: "pizza",
        story:
          "La abuela de Ana dividió el pastel en 6 porciones iguales. Ana se comió 3. ¿Qué fracción del pastel se llevó Ana?",
        hint: "Piensa en partes que tomó sobre el total de partes.",
        cast: { alce: "left", conejo: "right" },
        options: [
          {
            id: "f1q1-o1",
            text: "A) 3/6 (tres sextos)",
            isCorrect: true,
          },
          { id: "f1q1-o2", text: "B) 3/3 (el pastel entero)", isCorrect: false },
          { id: "f1q1-o3", text: "C) 6/3 (dos pasteles)", isCorrect: false },
          { id: "f1q1-o4", text: "D) 1/3 (un tercio)", isCorrect: false },
        ],
      },
      {
        id: "fracciones-1-q2",
        type: "write",
        stageArt: "pizza",
        story:
          "Las 3 porciones de Ana equivalen a la mitad del pastel. Escribe esa fracción equivalente.",
        hint: "Si partes 6 porciones en 2 grupos iguales, cada grupo tiene 3.",
        cast: { alce: "left", conejo: "right" },
        correctAnswers: ["1/2", "0.5", "1/ 2"],
      },
    ],
  },
  "fracciones-2": {
    rewardPet: "Alce",
    questions: [
      {
        id: "fracciones-2-q1",
        type: "multiple",
        stageArt: "coins",
        story:
          "El Capitán Alce encontró 12 monedas de oro y quiere repartirlas en partes iguales entre el Conejo, el Alce y el Perro Tutor. ¿Cuántas le tocan a cada uno?",
        hint: "Divide 12 monedas entre los 3 personajes.",
        cast: { alce: "left", conejo: "right" },
        options: [
          { id: "f2q1-o1", text: "A) 3 monedas cada uno", isCorrect: false },
          { id: "f2q1-o2", text: "B) 4 monedas cada uno", isCorrect: true },
          { id: "f2q1-o3", text: "C) 6 monedas cada uno", isCorrect: false },
          { id: "f2q1-o4", text: "D) 2 monedas cada uno", isCorrect: false },
        ],
      },
      {
        id: "fracciones-2-q2",
        type: "write",
        stageArt: "coins",
        story:
          "El Conejo gastó 2 de sus 4 monedas en un dulce. ¿Cuántas monedas le quedan?",
        hint: "Resta 2 a las 4 monedas que le tocaron.",
        cast: { alce: "left", conejo: "right" },
        correctAnswers: ["2", "dos"],
      },
    ],
  },
  "fracciones-3": {
    rewardPet: "Conejo",
    questions: [
      {
        id: "fracciones-3-q1",
        type: "multiple",
        stageArt: "tape",
        story:
          "Leo pintó 3 de las 4 partes de una cinta. ¿Qué fracción del total pintó?",
        hint: "Observa cuántas partes pintó sobre las 4 que tenía.",
        cast: { alce: "left", conejo: "right" },
        options: [
          { id: "f3q1-o1", text: "A) 3/4 (tres cuartos)", isCorrect: true },
          { id: "f3q1-o2", text: "B) 4/3 (más de toda la cinta)", isCorrect: false },
          { id: "f3q1-o3", text: "C) 1/4 (un cuarto)", isCorrect: false },
          { id: "f3q1-o4", text: "D) 1/3 (un tercio)", isCorrect: false },
        ],
      },
      {
        id: "fracciones-3-q2",
        type: "write",
        stageArt: "tape",
        story:
          "Compara 3/4 con la mitad de la cinta (1/2). ¿3/4 es más grande o más pequeño que 1/2? Escríbelo.",
        hint: "3/4 ocupa tres de cuatro partes; 1/2 ocupa dos de cuatro.",
        cast: { alce: "left", conejo: "right" },
        correctAnswers: ["más", "mas", "más grande", "mas grande", "mayor"],
      },
    ],
  },
  "inferencia-1": {
    rewardPet: "Alce",
    questions: [
      {
        id: "inferencia-1-q1",
        type: "multiple",
        stageArt: "book",
        story:
          "Aunque llovía, el grupo decidió jugar al aire libre: se pusieron impermeables, saltaron charcos y rieron durante una hora. ¿Qué nos dice esa decisión?",
        hint: "La elección del grupo revela su actitud ante la dificultad.",
        cast: { alce: "left", conejo: "right" },
        options: [
          {
            id: "i1q1-o1",
            text: "Que divertirse les importaba más que el mal tiempo",
            isCorrect: true,
          },
          {
            id: "i1q1-o2",
            text: "Que en realidad no estaba lloviendo",
            isCorrect: false,
          },
          {
            id: "i1q1-o3",
            text: "Que la profesora se lo había prohibido",
            isCorrect: false,
          },
          {
            id: "i1q1-o4",
            text: "Que tenían miedo de mojarse",
            isCorrect: false,
          },
        ],
      },
      {
        id: "inferencia-1-q2",
        type: "multiple",
        stageArt: "book",
        story:
          "El grupo siguió jugando hasta que el cielo se despejó. ¿Qué sugiere eso de su manera de reaccionar?",
        hint: "Fíjate en si el grupo siguió jugando a pesar de la dificultad.",
        cast: { alce: "left", conejo: "right" },
        options: [
          {
            id: "i1q2-o1",
            text: "Que aguantan hasta que las condiciones mejoran",
            isCorrect: true,
          },
          {
            id: "i1q2-o2",
            text: "Que solo juegan cuando el maestro lo permite",
            isCorrect: false,
          },
          {
            id: "i1q2-o3",
            text: "Que no les gusta la lluvia",
            isCorrect: false,
          },
          {
            id: "i1q2-o4",
            text: "Que cambiaron de juego al terminar la lluvia",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  "inferencia-2": {
    rewardPet: "Conejo",
    questions: [
      {
        id: "inferencia-2-q1",
        type: "multiple",
        stageArt: "book",
        story:
          "Don Tomás guardaba las herramientas del jardín en un cajón bajo, pero cada mañana las encontraba esparcidas por el patio. Un día, su nieta colgó las herramientas en un panel de la pared. Desde entonces, todo sigue en su lugar. ¿Por qué funcionó?",
        hint: "Fíjate en qué cambió exactamente y qué pasó después.",
        cast: { alce: "left", conejo: "right" },
        options: [
          {
            id: "i2q1-o1",
            text: "Que cambiar dónde se guardaba resolvió el problema",
            isCorrect: true,
          },
          {
            id: "i2q1-o2",
            text: "Que a Don Tomás le gustaba tener todo revuelto",
            isCorrect: false,
          },
          {
            id: "i2q1-o3",
            text: "Que la nieta quería que Don Tomás trabajara menos",
            isCorrect: false,
          },
          {
            id: "i2q1-o4",
            text: "Que las herramientas se habían perdido",
            isCorrect: false,
          },
        ],
      },
      {
        id: "inferencia-2-q2",
        type: "multiple",
        stageArt: "book",
        story:
          "La nieta notó algo que Don Tomás no veía. ¿Qué se puede inferir de eso?",
        hint: "Observa quién identificó el problema la primera vez.",
        cast: { alce: "left", conejo: "right" },
        options: [
          {
            id: "i2q2-o1",
            text: "Que Don Tomás no veía la causa del desorden",
            isCorrect: true,
          },
          {
            id: "i2q2-o2",
            text: "Que Don Tomás ya no podía trabajar",
            isCorrect: false,
          },
          {
            id: "i2q2-o3",
            text: "Que la nieta no entendía nada del jardín",
            isCorrect: false,
          },
          {
            id: "i2q2-o4",
            text: "Que el jardín estaba abandonado",
            isCorrect: false,
          },
        ],
      },
    ],
  },
  "inferencia-3": {
    rewardPet: "Alce",
    questions: [
      {
        id: "inferencia-3-q1",
        type: "multiple",
        stageArt: "book",
        story:
          "En el concurso de lectura cada participante debía leer un libro y escribir por qué lo recomendaba. Varios leyeron el mismo título, pero las reseñas fueron muy distintas. ¿Por qué?",
        hint: "La respuesta está en lo que hizo cada lector, no en el libro.",
        cast: { alce: "left", conejo: "right" },
        options: [
          {
            id: "i3q1-o1",
            text: "Porque su propósito y su experiencia de lectura fueron distintos",
            isCorrect: true,
          },
          {
            id: "i3q1-o2",
            text: "Porque algunos leyeron el libro equivocado",
            isCorrect: false,
          },
          {
            id: "i3q1-o3",
            text: "Porque nadie terminó el libro",
            isCorrect: false,
          },
          { id: "i3q1-o4", text: "Porque el libro tiene varias versiones", isCorrect: false },
        ],
      },
    ],
  },
  "problemas-1": {
    rewardPet: "Conejo",
    questions: [
      {
        id: "problemas-1-q1",
        type: "write",
        stageArt: "ticket",
        story:
          "La clase compró 8 cuadernos de 12 monedas cada uno y 6 lápices de 8 monedas cada uno. ¿Cuántas monedas gastaron en total?",
        hint: "Multiplica cada cantidad por su precio y suma los dos resultados.",
        cast: { alce: "left", conejo: "right" },
        correctAnswers: ["144", "144 monedas"],
      },
      {
        id: "problemas-1-q2",
        type: "multiple",
        stageArt: "ticket",
        story:
          "Si son 6 alumnos y pagan la cuenta por partes iguales, ¿cuánto paga cada uno?",
        hint: "Reparte el total de 144 monedas entre 6 alumnos.",
        cast: { alce: "left", conejo: "right" },
        options: [
          { id: "p1q2-o1", text: "A) 24 monedas cada uno", isCorrect: true },
          { id: "p1q2-o2", text: "B) 20 monedas cada uno", isCorrect: false },
          { id: "p1q2-o3", text: "C) 26 monedas cada uno", isCorrect: false },
          { id: "p1q2-o4", text: "D) 30 monedas cada uno", isCorrect: false },
        ],
      },
    ],
  },
  "problemas-2": {
    rewardPet: "Alce",
    questions: [
      {
        id: "problemas-2-q1",
        type: "write",
        stageArt: "ticket",
        story:
          "La cuenta del kiosco fue de 60 monedas y la pagan 4 amigos en partes iguales. ¿Cuánto paga cada amigo?",
        hint: "Reparte 60 monedas entre 4 amigos.",
        cast: { alce: "left", conejo: "right" },
        correctAnswers: ["15", "15 monedas", "quince"],
      },
      {
        id: "problemas-2-q2",
        type: "multiple",
        stageArt: "ticket",
        story:
          "Tras pagar, sobran 0 monedas. ¿Qué comprobas con ese resultado?",
        hint: "Si no sobra ni falta nada, el reparto está bien hecho.",
        cast: { alce: "left", conejo: "right" },
        options: [
          {
            id: "p2q2-o1",
            text: "Que la cuenta cuadra: 4 × 15 = 60",
            isCorrect: true,
          },
          {
            id: "p2q2-o2",
            text: "Que el kiosquero les regaló algo",
            isCorrect: false,
          },
          {
            id: "p2q2-o3",
            text: "Que alguien no pagó su parte",
            isCorrect: false,
          },
          { id: "p2q2-o4", text: "Que la cuenta estaba mal", isCorrect: false },
        ],
      },
    ],
  },
  "problemas-3": {
    rewardPet: "Conejo",
    questions: [
      {
        id: "problemas-3-q1",
        type: "multiple",
        stageArt: "ticket",
        story:
          "Tienes 50 monedas para la excursión. El zoo cuesta 60, el parque 35 y el cine 70. ¿Cuál puedes pagar?",
        hint: "Solo una opción cabe en el presupuesto sin pasarte.",
        cast: { alce: "left", conejo: "right" },
        options: [
          { id: "p3q1-o1", text: "A) El parque (35)", isCorrect: true },
          { id: "p3q1-o2", text: "B) El zoo (60)", isCorrect: false },
          { id: "p3q1-o3", text: "C) El cine (70)", isCorrect: false },
          {
            id: "p3q1-o4",
            text: "D) Zoo y parque juntos (95)",
            isCorrect: false,
          },
        ],
      },
      {
        id: "problemas-3-q2",
        type: "write",
        stageArt: "ticket",
        story:
          "Elegiste el parque y pagaste con las 50 monedas. ¿Cuánto te sobra?",
        hint: "Resta el costo del parque a las 50 monedas del presupuesto.",
        cast: { alce: "left", conejo: "right" },
        correctAnswers: ["15", "15 monedas", "quince"],
      },
    ],
  },
};

/**
 * Las misiones se derivan de las rutas: así el título, los puntos y la lista
 * jugable nunca se desincronizan con `themeRoutes`.
 */
const MISSIONS: Mission[] = themeRoutes.flatMap((route) =>
  route.stories.map((story) => {
    const challenge = STORY_CHALLENGES[story.id];
    const total = challenge.questions.length;
    const done = story.points;
    let assigned = 0;

    return {
      id: story.id,
      title: story.title,
      points: story.points,
      rewardPet: challenge.rewardPet,
      questions: challenge.questions.map((question, index) => {
        const isLast = index === total - 1;
        assigned += isLast ? done - assigned : Math.floor(done / total);

        return { ...question, points: assigned };
      }),
    };
  }),
);

/* -------------------------------------------------------------------------- */
/* Encuadre de los personajes                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Cada SVG trae 3 vistas del personaje (frontal, lateral y posterior) en
 * columnas iguales. Recortar un tercio con `translateX` - 1/3 del ancho de la
 * imagen equivale exactamente a un tercio del recuadro -, así se muestra una
 * sola vista sin deformar la imagen.
 *
 * Los personajes miran al frente, se dan la vuelta (vista posterior) si la
 * respuesta es incorrecta y el alce gira a un lado (vista lateral) cuando le
 * piden pista al Profe Perro.
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

const typeLabels: Record<QuestionSpec["type"], string> = {
  write: "Entrada de texto",
  multiple: "Opción múltiple",
};

/* -------------------------------------------------------------------------- */
/* Vista                                                                       */
/* -------------------------------------------------------------------------- */

type AnswerStatus = "idle" | "correct" | "incorrect";

function MisionesPage() {
  const { historia } = Route.useSearch();
  const navigate = useNavigate();
  const [cleared, setCleared] = useState<string[]>([]);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const { levelUp } = usePetFriendship();
  const missionIndex = Math.max(
    MISSIONS.findIndex((mission) => mission.id === historia),
    0,
  );
  const mission = MISSIONS[missionIndex];
  const isLastMission = missionIndex === MISSIONS.length - 1;
  const missionCleared = cleared.includes(mission.id);

  function goToMission(index: number) {
    navigate({
      to: "/misiones",
      search: { historia: MISSIONS[index].id },
    });
  }

  /** Los puntos solo se conceden la primera vez que se supera la misión. */
  function handleSolved(isCorrect: boolean, points: number, finished: boolean) {
    if (!isCorrect || cleared.includes(mission.id)) return;

    setEarnedPoints((total) => total + points);

    if (finished) {
      setCleared((list) => [...list, mission.id]);
      levelUp(mission.rewardPet);
    }
  }

  return (
    <div className="flex flex-col">
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
        </div>

        <h1 className="text-lg font-semibold tracking-tight md:text-xl">
          {mission.title}
        </h1>

        <div className="flex items-center gap-2">
          <Badge className="gap-1 bg-amber-100 text-amber-800 ring-1 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30">
            <StarIcon />
            {mission.points} Pts
          </Badge>
          <Badge variant="secondary" className="font-mono tabular-nums">
            {earnedPoints} pts
          </Badge>
        </div>
      </div>

      {/* El escenario se reinicia al cambiar de misión gracias a la `key`. */}
      <MissionStage
        key={mission.id}
        mission={mission}
        missionCleared={missionCleared}
        isLastMission={isLastMission}
        onAdvance={() =>
          isLastMission ? goToMission(0) : goToMission(missionIndex + 1)
        }
        onSolved={handleSolved}
      />

      {/* Navegación entre las misiones de las rutas */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 md:px-6">
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
            {MISSIONS.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-label={item.title}
                  aria-current={index === missionIndex}
                  onClick={() => goToMission(index)}
                  className={cn(
                    "size-2.5 rounded-full ring-1 transition-colors",
                    index === missionIndex
                      ? "bg-primary ring-primary"
                      : cleared.includes(item.id)
                        ? "bg-emerald-400 ring-emerald-500"
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
              Misión {missionIndex + 1} de {MISSIONS.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Escenario de una misión                                                    */
/* -------------------------------------------------------------------------- */

function MissionStage({
  mission,
  missionCleared,
  isLastMission,
  onAdvance,
  onSolved,
}: {
  mission: Mission;
  missionCleared: boolean;
  isLastMission: boolean;
  onAdvance: () => void;
  onSolved: (isCorrect: boolean, points: number, finished: boolean) => void;
}) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<AnswerStatus>("idle");
  const [hintVisible, setHintVisible] = useState(false);

  const { levels } = usePetFriendship();
  const question = mission.questions[questionIndex];
  const isLastQuestion = questionIndex === mission.questions.length - 1;

  function resolveAnswer(isCorrect: boolean) {
    setStatus(isCorrect ? "correct" : "incorrect");
    onSolved(isCorrect, question.points, isLastQuestion);
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
    <div className="flex flex-col gap-5 px-4 md:px-6">
      {/* Pregunta */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{typeLabels[question.type]}</Badge>
          <span className="text-xs font-medium text-muted-foreground">
            Pregunta {questionIndex + 1} de {mission.questions.length}
          </span>
        </div>
        <p className="rounded-xl border-l-4 border-primary bg-muted p-5 text-base leading-relaxed md:text-lg">
          {question.story}
        </p>
      </div>

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
                  showAsWrong &&
                    "border-destructive bg-destructive/5 text-destructive",
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
              {missionCleared || isLastQuestion ? (
                <p className="text-sm text-muted-foreground">
                  Misión completada: {mission.rewardPet} subió a Nv.{" "}
                  {levels[mission.rewardPet] ?? 1}.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Te falta{" "}
                  {mission.questions.length - questionIndex - 1} pregunta
                  {mission.questions.length - questionIndex - 1 === 1 ? "" : "s"}.
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
              <Button className="shrink-0" onClick={onAdvance}>
                Siguiente misión
                <ChevronRightIcon />
              </Button>
            )
          ) : (
            <Button
              className="shrink-0"
              onClick={() => {
                setQuestionIndex((index) => index + 1);
                setAnswer("");
                setSelectedOption(null);
                setStatus("idle");
                setHintVisible(false);
              }}
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
    </div>
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
        side === "left"
          ? "left-[13%] sm:left-[19%]"
          : "right-[13%] sm:right-[19%]",
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

/** Suelo del lienzo: horizonte punteado, pradera y pasto. */
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
function CenterArt({ kind, mood }: { kind: StageArt; mood: AnswerStatus }) {
  const arts: Record<StageArt, React.ReactNode> = {
    pizza: <PizzaArt />,
    coins: <CoinsArt />,
    tape: <TapeArt />,
    book: <BookArt />,
    ticket: <TicketArt />,
  };

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
          {arts[kind]}
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

/** Cinta dividida en 4 partes: 3 pintadas y 1 sin pintar. */
function TapeArt() {
  return (
    <svg viewBox="0 0 120 80" className="size-20" aria-hidden>
      <rect x="6" y="26" width="108" height="28" rx="6" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
      <path d="M33 26h27v28H33z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
      <path d="M60 26h27v28H60z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
      <path d="M87 26h27v28H87z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
      <path d="M6 40h108" stroke="#94A3B8" strokeWidth="2" strokeDasharray="4 4" />
    </svg>
  );
}

/** Libro abierto con una marcapáginas. */
function BookArt() {
  return (
    <svg viewBox="0 0 120 100" className="size-20" aria-hidden>
      <path
        d="M60 24c-10-8-24-10-36-8v56c12-2 26 0 36 8 10-8 24-10 36-8V16c-12-2-26 0-36 8Z"
        fill="#FFF7ED"
        stroke="#C2410C"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M60 24v56" stroke="#C2410C" strokeWidth="3" />
      <g stroke="#FDBA74" strokeWidth="3" strokeLinecap="round">
        <path d="M32 34h20M32 46h20M32 58h14M68 34h20M68 46h20M68 58h14" />
      </g>
      <path d="M78 16v20" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

/** Ticket de la excursión con su precio. */
function TicketArt() {
  return (
    <svg viewBox="0 0 120 100" className="size-20" aria-hidden>
      <path
        d="M14 30h92v14a8 8 0 0 0 0 16v14H14V60a8 8 0 0 0 0-16Z"
        fill="#FEF3C7"
        stroke="#B45309"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M74 30v44" stroke="#B45309" strokeWidth="3" strokeDasharray="5 5" />
      <circle cx="24" cy="52" r="5" fill="#B45309" opacity="0.35" />
      <g stroke="#92400E" strokeWidth="3" strokeLinecap="round">
        <path d="M34 44h30M34 56h22" />
      </g>
      <text
        x="96"
        y="58"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#92400E"
      >
        ★
      </text>
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