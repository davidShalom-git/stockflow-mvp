import { z } from "zod";
import { EmailAlreadyRegisteredError, InvalidCredentialsError } from "./service";

type JsonParseResult<T> = { ok: true; data: T } | { ok: false; response: Response };

export function authJson(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function parseJson<T>(request: Request, schema: z.ZodType<T>): Promise<JsonParseResult<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: authJson({ error: "Request body must be valid JSON.", code: "INVALID_JSON" }, 400),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: authJson(
        {
          error: "Request validation failed.",
          code: "VALIDATION_ERROR",
          details: parsed.error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
        400,
      ),
    };
  }

  return { ok: true, data: parsed.data };
}

export function authErrorResponse(error: unknown, operation: string): Response {
  if (error instanceof EmailAlreadyRegisteredError) {
    return authJson({ error: error.message, code: "EMAIL_ALREADY_REGISTERED" }, 409);
  }
  if (error instanceof InvalidCredentialsError) {
    return authJson({ error: error.message, code: "INVALID_CREDENTIALS" }, 401);
  }

  // Log only the error class and Prisma code; never log bodies, passwords, or connection strings.
  const errorCode =
    typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
  console.error(
    `[auth.${operation}]`,
    error instanceof Error ? error.name : "UnknownError",
    `code=${errorCode}`,
  );
  return authJson({ error: "Authentication request failed.", code: "INTERNAL_ERROR" }, 500);
}
