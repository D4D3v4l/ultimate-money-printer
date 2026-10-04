import { LearningPaths } from "@/components/learning-paths";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_layout/learning-path")({
  component: LearningPaths,
});