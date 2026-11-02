import { getCurrentUser } from "@/server/auth/session";
import { parseProductJson, productErrorResponse, productJson } from "@/server/products/http";
import { updateProductSchema } from "@/server/products/schemas";
import { deleteProduct, findProduct, updateProduct } from "@/server/products/service";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) return productJson({ error: "Authentication required.", code: "UNAUTHENTICATED" }, 401);
    const { id } = await params;
    const product = await findProduct(user.organization.id, id);
    return product ? productJson({ product }) : productJson({ error: "Product not found.", code: "NOT_FOUND" }, 404);
  } catch (error) {
    return productErrorResponse(error, "read");
  }
}

export async function PATCH(request: Request, { params }: RouteContext): Promise<Response> {
  const parsed = await parseProductJson(request, updateProductSchema);
  if (!parsed.ok) return parsed.response;
  try {
    const user = await getCurrentUser();
    if (!user) return productJson({ error: "Authentication required.", code: "UNAUTHENTICATED" }, 401);
    const { id } = await params;
    const product = await updateProduct(user.organization.id, id, parsed.data);
    return product ? productJson({ product }) : productJson({ error: "Product not found.", code: "NOT_FOUND" }, 404);
  } catch (error) {
    return productErrorResponse(error, "update");
  }
}

export async function DELETE(_request: Request, { params }: RouteContext): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) return productJson({ error: "Authentication required.", code: "UNAUTHENTICATED" }, 401);
    const { id } = await params;
    const deleted = await deleteProduct(user.organization.id, id);
    return deleted ? productJson({ success: true }) : productJson({ error: "Product not found.", code: "NOT_FOUND" }, 404);
  } catch (error) {
    return productErrorResponse(error, "delete");
  }
}
