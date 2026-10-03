import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  )
}

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-4xl font-semibold">404</p>
      <p className="text-muted-foreground">This page could not be found.</p>
    </main>
  )
}