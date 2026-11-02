export default function Home() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <section className="w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-medium tracking-wide text-emerald-700">STOCKFLOW MVP</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
          Project foundation is ready
        </h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          The application, styling system, and database client are configured. Authentication is the next development phase.
        </p>
      </section>
    </main>
  );
}
