import { getCurrentUser } from "@/server/auth/session";
import { jsonResponse, parseJsonBody } from "@/server/http/json";
import { updateSettingsSchema } from "@/server/settings/schemas";
import { getOrganizationSettings, updateOrganizationSettings } from "@/server/settings/service";

export const runtime = "nodejs";

function settingsErrorResponse(error: unknown, operation: "read" | "update"): Response {
  const errorCode = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
  console.error(`[settings.${operation}]`, error instanceof Error ? error.name : "UnknownError", `code=${errorCode}`);
  return jsonResponse({ error: "Settings request failed.", code: "INTERNAL_ERROR" }, 500);
}

export async function GET(): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) return jsonResponse({ error: "Authentication required.", code: "UNAUTHENTICATED" }, 401);
    const settings = await getOrganizationSettings(user.organization.id);
    return settings
      ? jsonResponse({ settings })
      : jsonResponse({ error: "Organization not found.", code: "NOT_FOUND" }, 404);
  } catch (error) {
    return settingsErrorResponse(error, "read");
  }
}

export async function PATCH(request: Request): Promise<Response> {
  const parsed = await parseJsonBody(request, updateSettingsSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const user = await getCurrentUser();
    if (!user) return jsonResponse({ error: "Authentication required.", code: "UNAUTHENTICATED" }, 401);
    const settings = await updateOrganizationSettings(user.organization.id, parsed.data);
    return settings
      ? jsonResponse({ settings })
      : jsonResponse({ error: "Organization not found.", code: "NOT_FOUND" }, 404);
  } catch (error) {
    return settingsErrorResponse(error, "update");
  }
}
