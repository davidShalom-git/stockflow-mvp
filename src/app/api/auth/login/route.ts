import { authErrorResponse, authJson, parseJson } from "@/server/auth/http";
import { loginSchema } from "@/server/auth/schemas";
import { loginUser } from "@/server/auth/service";
import { setSessionCookie } from "@/server/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const parsed = await parseJson(request, loginSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const result = await loginUser(parsed.data);
    await setSessionCookie(result.token, result.expiresAt);
    return authJson({ user: result.user });
  } catch (error) {
    return authErrorResponse(error, "login");
  }
}
