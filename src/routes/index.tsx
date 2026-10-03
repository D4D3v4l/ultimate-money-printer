import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight">ultimate-money-printer</h1>
      <p className="text-muted-foreground">
        Vite + React + TypeScript + Tailwind CSS v4 + shadcn/ui + TanStack Router
      </p>
      <Link
        to="/about"
        className="text-sm font-medium underline underline-offset-4"
      >
        About
      </Link>
    </main>
  )
}