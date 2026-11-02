import { authErrorResponse, authJson } from "@/server/auth/http";
import { clearSessionCookie, readSessionToken } from "@/server/auth/session";
import { revokeSession } from "@/server/auth/service";

export const runtime = "nodejs";

export async function POST(): Promise<Response> {
  try {
    const token = await readSessionToken();
    if (token) await revokeSession(token);
    await clearSessionCookie();
    return authJson({ success: true });
  } catch (error) {
    return authErrorResponse(error, "logout");
  }
}
