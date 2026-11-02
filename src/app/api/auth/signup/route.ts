import { authErrorResponse, authJson, parseJson } from "@/server/auth/http";
import { signupSchema } from "@/server/auth/schemas";
import { registerUser } from "@/server/auth/service";
import { setSessionCookie } from "@/server/auth/session";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  const parsed = await parseJson(request, signupSchema);
  if (!parsed.ok) return parsed.response;

  try {
    const result = await registerUser(parsed.data);
    await setSessionCookie(result.token, result.expiresAt);
    return authJson({ user: result.user }, 201);
  } catch (error) {
    return authErrorResponse(error, "signup");
  }
}
