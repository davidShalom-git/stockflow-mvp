import { authErrorResponse, authJson } from "@/server/auth/http";
import { getCurrentUser } from "@/server/auth/session";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return authJson({ error: "Authentication required.", code: "UNAUTHENTICATED" }, 401);
    }
    return authJson({ user });
  } catch (error) {
    return authErrorResponse(error, "me");
  }
}
