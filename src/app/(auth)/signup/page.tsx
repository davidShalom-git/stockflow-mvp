import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account | StockFlow",
};

export default function SignupPage() {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm sm:p-9">
      <p className="text-sm font-semibold tracking-wide text-emerald-700">STOCKFLOW</p>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-zinc-950">Create your account</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Start an inventory workspace for your organization.
      </p>
      <div className="mt-7">
        <AuthForm mode="signup" />
      </div>
      <p className="mt-6 text-center text-sm text-zinc-600">
        Already have an account?{" "}
        <Link className="font-medium text-emerald-700 hover:text-emerald-800" href="/login">
          Log in
        </Link>
      </p>
    </section>
  );
}
