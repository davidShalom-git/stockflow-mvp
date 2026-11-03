import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/server/auth/session";

export default async function PrivateLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-6">
            <Link className="text-sm font-semibold tracking-wide text-emerald-700" href="/dashboard">
              STOCKFLOW
            </Link>
            <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm">
              <Link className="text-zinc-600 transition hover:text-zinc-950" href="/dashboard">Dashboard</Link>
              <Link className="text-zinc-600 transition hover:text-zinc-950" href="/settings">Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-zinc-900">{user.organization.name}</p>
              <p className="text-xs text-zinc-500">{user.email}</p>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
