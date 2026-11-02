"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

type AuthResponse = {
  error?: string;
};

const fieldClassName =
  "mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isSignup = mode === "signup";
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const body: Record<string, string> = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
    if (isSignup) body.organizationName = String(formData.get("organizationName") ?? "");

    try {
      const response = await fetch(isSignup ? "/api/auth/signup" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setError(result.error ?? "We couldn’t sign you in. Please try again.");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("We couldn’t reach StockFlow. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {isSignup && (
        <div>
          <label className="text-sm font-medium text-zinc-800" htmlFor="organizationName">
            Organization name
          </label>
          <input
            autoComplete="organization"
            className={fieldClassName}
            id="organizationName"
            maxLength={120}
            name="organizationName"
            placeholder="My Store"
            required
          />
        </div>
      )}

      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="email">
          Email
        </label>
        <input
          autoComplete="email"
          className={fieldClassName}
          id="email"
          maxLength={254}
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="password">
          Password
        </label>
        <input
          autoComplete={isSignup ? "new-password" : "current-password"}
          className={fieldClassName}
          id="password"
          maxLength={128}
          minLength={isSignup ? 8 : undefined}
          name="password"
          required
          type="password"
        />
        {isSignup && <p className="mt-2 text-xs text-zinc-500">Use at least 8 characters.</p>}
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}

      <button
        className="flex w-full items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Please wait…" : isSignup ? "Create account" : "Log in"}
      </button>

    </form>
  );
}
