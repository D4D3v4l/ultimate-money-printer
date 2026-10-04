import { NavMain, type NavMainItem } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { student } from "@/lib/mock-data";
import {
  ChartNoAxesCombinedIcon,
  ClipboardListIcon,
  CommandIcon,
  CompassIcon,
  LayoutDashboardIcon,
} from "lucide-react";

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
      title: "Mi Portal",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Diagnóstico",
      url: "/diagnostic",
      icon: <ClipboardListIcon />,
    },
    {
      title: "Resultados y Brechas",
      url: "/results",
      icon: <ChartNoAxesCombinedIcon />,
    },
    {
      title: "Ruta de Aprendizaje",
      url: "/learning-path",
      icon: <CompassIcon />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="#" />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">AprendeAventura</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
