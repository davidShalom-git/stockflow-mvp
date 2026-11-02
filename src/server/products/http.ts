import { z } from "zod";
import { isDuplicateSkuError } from "./service";

export function productJson(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function parseProductJson<T>(request: Request, schema: z.ZodType<T>) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { ok: false as const, response: productJson({ error: "Request body must be valid JSON.", code: "INVALID_JSON" }, 400) };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false as const,
      response: productJson({
        error: "Request validation failed.",
        code: "VALIDATION_ERROR",
        details: parsed.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message })),
      }, 400),
    };
  }
  return { ok: true as const, data: parsed.data };
}

export function productErrorResponse(error: unknown, operation: string): Response {
  if (isDuplicateSkuError(error)) {
    return productJson({ error: "A product with this SKU already exists in this organization.", code: "SKU_ALREADY_EXISTS" }, 409);
  }
  const errorCode = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
  console.error(`[products.${operation}]`, error instanceof Error ? error.name : "UnknownError", `code=${errorCode}`);
  return productJson({ error: "Product request failed.", code: "INTERNAL_ERROR" }, 500);
}
