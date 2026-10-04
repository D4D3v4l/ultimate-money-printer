/**
 * Genera copias sin fondo de los SVG de personajes.
 *
 * Los archivos originales de `willys/` traen un `<path>` blanco que cubre todo
 * el lienzo (el fondo con el que fueron exportados). Este script quita ese
 * path —y solo ese— para que el personaje se pueda integrar en cualquier
 * escena, además de eliminar el bloque `<metadata>` con el manifiesto C2PA,
 * cuya firma deja de ser válida en cuanto se modifica el contenido.
 *
 * Uso: npm run assets:svg
 */
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_DIR = "willys";
const OUTPUT_DIR = "src/assets";

/** Detecta el path que dibuja el fondo completo del viewBox. */
function findBackgroundPath(svg) {
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1];
  if (!viewBox) return null;

  const [, , width, height] = viewBox.split(/\s+/).map(Number);
  const pattern =
    /<path[^>]*fill="(?:white|#fff(?:fff)?)"[^>]*d="M0 0[^"]*?"\/>/g;

  for (const match of svg.matchAll(pattern)) {
    const path = match[0];
    const d = path.match(/ d="([^"]+)"/)?.[1] ?? "";
    const numbers = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map((value) =>
      Number(value[0]),
    );
    const maxX = Math.max(...numbers.filter((_, index) => index % 2 === 0));
    const maxY = Math.max(...numbers.filter((_, index) => index % 2 === 1));

    // El rectángulo puede venir escalado por un `transform`, así que las
    // coordenadas del `d` no coinciden 1:1 con el viewBox.
    const scale = path
      .match(/transform="scale\(\s*([\d.]+)[ ,]+([\d.]+)?\s*\)"/)
      ?.slice(1)
      .map((value) => Number(value ?? 1));
    const scaleX = scale?.[0] ?? 1;
    const scaleY = scale?.[1] ?? scaleX;

    const coversWidth = Math.abs(maxX * scaleX - width) / width < 0.01;
    const coversHeight = Math.abs(maxY * scaleY - height) / height < 0.01;

    if (coversWidth && coversHeight) {
      return path;
    }
  }

  return null;
}

const entries = (await readdir(SOURCE_DIR)).filter((name) =>
  name.toLowerCase().endsWith(".svg"),
);

if (entries.length === 0) {
  console.error(`No hay SVG en ${SOURCE_DIR}/`);
  process.exit(1);
}

await mkdir(OUTPUT_DIR, { recursive: true });

for (const entry of entries) {
  const source = await readFile(path.join(SOURCE_DIR, entry), "utf8");
  const background = findBackgroundPath(source);

  let cleaned = source.replace(background ?? "", "");
  cleaned = cleaned.replace(/<metadata>[\s\S]*?<\/metadata>/, "");

  await writeFile(path.join(OUTPUT_DIR, entry), cleaned, "utf8");

  console.log(
    `${entry}: ${background ? "fondo blanco eliminado" : "sin fondo que quitar"}`,
  );
}