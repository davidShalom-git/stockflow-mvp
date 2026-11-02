import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log in | StockFlow",
};

export default function LoginPage() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-9">
      <p className="text-sm font-semibold tracking-wide text-emerald-700">STOCKFLOW</p>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950">Welcome back</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">Log in to manage your organization’s inventory.</p>
      <div className="mt-7">
        <AuthForm mode="login" />
      </div>
      <p className="mt-6 text-center text-sm text-zinc-600">
        New to StockFlow?{" "}
        <Link className="font-medium text-emerald-700 hover:text-emerald-800" href="/signup">
          Create an account
        </Link>
      </p>
    </section>
  );
}
