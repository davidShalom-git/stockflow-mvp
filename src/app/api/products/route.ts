import { getCurrentUser } from "@/server/auth/session";
import { parseProductJson, productErrorResponse, productJson } from "@/server/products/http";
import { createProductSchema, productSearchSchema } from "@/server/products/schemas";
import { createProduct, listProducts } from "@/server/products/service";

export const runtime = "nodejs";

export async function GET(request: Request): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) return productJson({ error: "Authentication required.", code: "UNAUTHENTICATED" }, 401);
    const parsedSearch = productSearchSchema.safeParse(new URL(request.url).searchParams.get("search") ?? "");
    if (!parsedSearch.success) return productJson({ error: "Search must be at most 100 characters.", code: "VALIDATION_ERROR" }, 400);
    const products = await listProducts(user.organization.id, parsedSearch.data || undefined);
    return productJson({ products });
  } catch (error) {
    return productErrorResponse(error, "list");
  }
}

export async function POST(request: Request): Promise<Response> {
  const parsed = await parseProductJson(request, createProductSchema);
  if (!parsed.ok) return parsed.response;
  try {
    const user = await getCurrentUser();
    if (!user) return productJson({ error: "Authentication required.", code: "UNAUTHENTICATED" }, 401);
    return productJson({ product: await createProduct(user.organization.id, parsed.data) }, 201);
  } catch (error) {
    return productErrorResponse(error, "create");
  }
}
