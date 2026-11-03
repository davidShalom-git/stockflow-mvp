import { notFound, redirect } from "next/navigation";
import { SettingsForm } from "@/components/settings/settings-form";
import { getCurrentUser } from "@/server/auth/session";
import { getOrganizationSettings } from "@/server/settings/service";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const settings = await getOrganizationSettings(user.organization.id);
  if (!settings) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm font-medium text-emerald-700">WORKSPACE</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Settings</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Manage your organization details and the default stock alert level.
        </p>
      </div>

      <section aria-labelledby="organization-settings-heading" className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 border-b border-zinc-100 pb-5">
          <h2 id="organization-settings-heading" className="font-semibold text-zinc-950">Organization settings</h2>
          <p className="mt-1 text-sm text-zinc-500">These settings apply to your organization’s workspace.</p>
        </div>
        <SettingsForm
          initialName={settings.name}
          initialThreshold={settings.defaultLowStockThreshold}
        />
      </section>
    </div>
  );
}
