"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type SettingsFormProps = {
  initialName: string;
  initialThreshold: number;
};

type SettingsResponse = {
  error?: string;
  settings?: {
    name: string;
    defaultLowStockThreshold: number;
  };
};

const fieldClassName =
  "mt-2 block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15";

export function SettingsForm({ initialName, initialThreshold }: SettingsFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [threshold, setThreshold] = useState(String(initialThreshold));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setIsSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationName: name, defaultLowStockThreshold: Number(threshold) }),
      });
      const result = (await response.json()) as SettingsResponse;

      if (!response.ok || !result.settings) {
        setError(result.error ?? "We couldn’t save your settings. Please try again.");
        return;
      }

      setName(result.settings.name);
      setThreshold(String(result.settings.defaultLowStockThreshold));
      setMessage("Your settings have been saved.");
      router.refresh();
    } catch {
      setError("We couldn’t reach StockFlow. Check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="organizationName">
          Organization name
        </label>
        <input
          autoComplete="organization"
          className={fieldClassName}
          id="organizationName"
          maxLength={120}
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
        <p className="mt-2 text-xs text-zinc-500">Shown in your workspace header.</p>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800" htmlFor="defaultLowStockThreshold">
          Default low-stock threshold
        </label>
        <input
          className={fieldClassName}
          id="defaultLowStockThreshold"
          max={2_147_483_647}
          min={0}
          onChange={(event) => setThreshold(event.target.value)}
          required
          step={1}
          type="number"
          value={threshold}
        />
        <p className="mt-2 text-xs text-zinc-500">
          Products without their own threshold use this quantity. Set to 0 to turn off default low-stock alerts.
        </p>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
          {message}
        </p>
      )}

      <button
        className="flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSaving}
        type="submit"
      >
        {isSaving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
