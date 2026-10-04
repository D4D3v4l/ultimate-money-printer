import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link, useRouterState } from "@tanstack/react-router";
import { Fragment } from "react";

/** Rutas de primer nivel de la plataforma. */
type KnownPath = "/" | "/diagnostic" | "/results" | "/learning-path" | "/misiones";

const pathLabels: Record<KnownPath, string> = {
  "/": "Mi Portal",
  "/diagnostic": "Diagnóstico",
  "/results": "Resultados y Brechas",
  "/learning-path": "Ruta de Aprendizaje",
  "/misiones": "Misiones",
};

/**
 * Convierte el pathname en migas: un item por segmento.
 * `/diagnostic/review/1` → ["Diagnóstico", "review", "1"].
 * Solo los segmentos que corresponden a rutas reales son navegables; el resto
 * se muestra como texto plano para no enlazar a rutas inexistentes.
 */
function getCrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [{ label: pathLabels["/"], to: "/" as KnownPath, known: true }];
  }

  return segments.map((segment, index) => {
    const to = `/${segments.slice(0, index + 1).join("/")}`;
    const known = to in pathLabels;

    return {
      label: known ? pathLabels[to as KnownPath] : segment,
      to: to as KnownPath,
      known,
    };
  });
}

export function SiteHeader() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const crumbs = getCrumbs(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;

              return (
                <Fragment key={crumb.to}>
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-medium">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : crumb.known ? (
                      <BreadcrumbLink
                        render={<Link to={crumb.to} />}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                  </BreadcrumbItem>
                  {isLast ? null : <BreadcrumbSeparator />}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
