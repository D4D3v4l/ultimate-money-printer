import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight">About</h1>
      <p className="text-muted-foreground">
        Example route to verify file-based routing works.
      </p>
      <Link to="/" className="text-sm font-medium underline underline-offset-4">
        Back home
      </Link>
    </main>
  )
}