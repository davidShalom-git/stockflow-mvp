import { z } from "zod";

type JsonParseResult<T> = { ok: true; data: T } | { ok: false; response: Response };

export function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function parseJsonBody<T>(request: Request, schema: z.ZodType<T>): Promise<JsonParseResult<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      ok: false,
      response: jsonResponse({ error: "Request body must be valid JSON.", code: "INVALID_JSON" }, 400),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      response: jsonResponse({
        error: "Request validation failed.",
        code: "VALIDATION_ERROR",
        details: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      }, 400),
    };
  }

  return { ok: true, data: parsed.data };
}
