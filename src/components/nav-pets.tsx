import { usePetFriendship } from "@/components/pet-friendship";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { mascots } from "@/lib/mock-data";
import { HeartIcon, SparklesIcon } from "lucide-react";

/**
 * Widget "Amistad Mascotas" del prototipo, adaptado al lenguaje visual del
 * proyecto (superficies neutras + acento `primary`). El nivel vive en el
 * contexto `PetFriendship`, así que sube al completar misiones. Al colapsar la
 * sidebar solo quedan los emojis, para no perder la referencia de las mascotas.
 */
export function NavPets() {
  const { levels } = usePetFriendship();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[0.65rem] font-semibold tracking-widest uppercase">
        <HeartIcon className="size-3.5" />
        Amistad mascotas
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-2">
          {mascots.map((mascot) => (
            <SidebarMenuItem key={mascot.id}>
              <div className="flex w-full items-center gap-3 rounded-xl bg-muted/70 p-2.5 ring-1 ring-foreground/5 transition-colors hover:bg-muted group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar text-base leading-none ring-1 ring-foreground/5"
                >
                  {mascot.emoji}
                </span>
                <span className="flex min-w-0 flex-1 flex-col group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium">
                    {mascot.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {mascot.role}
                  </span>
                </span>
                <span className="shrink-0 rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-xs font-semibold tabular-nums text-primary group-data-[collapsible=icon]:hidden">
                  Nv. {levels[mascot.name] ?? mascot.level}
                </span>
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <p className="mt-2 flex items-start gap-1.5 px-2 text-xs leading-snug text-muted-foreground group-data-[collapsible=icon]:hidden">
          <SparklesIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
          Sube de nivel con tus mascotas al completar lecciones.
        </p>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}