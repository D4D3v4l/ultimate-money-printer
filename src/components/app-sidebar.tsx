import { NavMain, type NavMainItem } from "@/components/nav-main";
import { NavPets } from "@/components/nav-pets";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { student } from "@/lib/mock-data";
import { ClipboardListIcon, LibraryIcon, MapIcon, RocketIcon } from "lucide-react";

const data: {
  user: { name: string; email: string; avatar: string };
  navMain: NavMainItem[];
} = {
  user: {
    name: student.name,
    email: student.grade,
    avatar: "",
  },
  navMain: [
    {
      title: "Rutas de Misiones",
      url: "/learning-path",
      icon: <MapIcon />,
    },
    {
      title: "Tareas del Profe",
      url: "/diagnostic",
      icon: <ClipboardListIcon />,
    },
    {
      title: "Mi Biblioteca",
      url: "/results",
      icon: <LibraryIcon />,
    },
  ],
};

/**
 * Sidebar del alumno: marca, los 3 tabs principales y el widget de
 * "Amistad Mascotas" sobre el perfil. Se colapsa a rail de iconos, igual que
 * el prototipo.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:h-10! data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link to="/" />}
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <RocketIcon className="size-4" />
              </span>
              <span className="text-base font-semibold">AprendeAventura</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavPets />
        <SidebarSeparator className="mx-2 w-auto" />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}