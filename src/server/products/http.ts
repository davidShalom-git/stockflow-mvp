import { isDuplicateSkuError } from "./service";
import { jsonResponse, parseJsonBody } from "@/server/http/json";

export const productJson = jsonResponse;
export const parseProductJson = parseJsonBody;

export function productErrorResponse(error: unknown, operation: string): Response {
  if (isDuplicateSkuError(error)) {
    return productJson({ error: "A product with this SKU already exists in this organization.", code: "SKU_ALREADY_EXISTS" }, 409);
  }
  const errorCode = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "unknown";
  console.error(`[products.${operation}]`, error instanceof Error ? error.name : "UnknownError", `code=${errorCode}`);
  return productJson({ error: "Product request failed.", code: "INTERNAL_ERROR" }, 500);
}
