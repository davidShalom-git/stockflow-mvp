import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateProductInput, UpdateProductInput } from "./schemas";

const productSelect = {
  id: true,
  name: true,
  sku: true,
  description: true,
  quantityOnHand: true,
  costPrice: true,
  sellingPrice: true,
  lowStockThreshold: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductSelect;

export function serializeProduct(product: Prisma.ProductGetPayload<{ select: typeof productSelect }>) {
  return {
    ...product,
    costPrice: product.costPrice?.toString() ?? null,
    sellingPrice: product.sellingPrice?.toString() ?? null,
  };
}

export async function listProducts(organizationId: string, search?: string) {
  const products = await prisma.product.findMany({
    where: {
      organizationId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { sku: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: [{ name: "asc" }, { id: "asc" }],
    select: productSelect,
  });
  return products.map(serializeProduct);
}

export async function createProduct(organizationId: string, input: CreateProductInput) {
  const product = await prisma.product.create({
    data: { ...input, organizationId },
    select: productSelect,
  });
  return serializeProduct(product);
}

export async function findProduct(organizationId: string, id: string) {
  const product = await prisma.product.findFirst({
    where: { id, organizationId },
    select: productSelect,
  });
  return product ? serializeProduct(product) : null;
}

export async function updateProduct(organizationId: string, id: string, input: UpdateProductInput) {
  const result = await prisma.product.updateMany({
    where: { id, organizationId },
    data: input,
  });
  if (result.count === 0) return null;
  return findProduct(organizationId, id);
}

export async function deleteProduct(organizationId: string, id: string): Promise<boolean> {
  const result = await prisma.product.deleteMany({ where: { id, organizationId } });
  return result.count > 0;
}

export function isDuplicateSkuError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}
