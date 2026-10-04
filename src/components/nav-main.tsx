import { Link, useRouterState } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export type NavMainItem = {
  title: string;
  url: "/" | "/diagnostic" | "/results" | "/learning-path";
  icon?: React.ReactNode;
};

export function NavMain({ items }: { items: NavMainItem[] }) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname === item.url}
                className="h-10! rounded-xl px-2.5! text-foreground/70 data-active:bg-primary/10 data-active:font-semibold data-active:text-primary dark:text-muted-foreground"
                render={<Link to={item.url} />}
              >
                {item.icon}
                <span className="font-medium">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
