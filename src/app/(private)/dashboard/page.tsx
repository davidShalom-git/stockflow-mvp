export default function DashboardPage() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-9">
      <p className="text-sm font-medium tracking-wide text-emerald-700">WORKSPACE</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">You’re signed in</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600">
        Your organization workspace is ready. You can safely sign out from this page.
      </p>
    </section>
  );
}
