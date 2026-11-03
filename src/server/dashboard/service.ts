import "server-only";

import { prisma } from "@/lib/prisma";
import { summarizeDashboard } from "./metrics";

export async function getDashboardData(organizationId: string) {
  const [organization, products] = await Promise.all([
    prisma.organization.findUnique({
      where: { id: organizationId },
      select: { defaultLowStockThreshold: true },
    }),
    prisma.product.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        sku: true,
        quantityOnHand: true,
        lowStockThreshold: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    }),
  ]);

  const defaultThreshold = organization?.defaultLowStockThreshold ?? 5;
  return summarizeDashboard(products, defaultThreshold);
}
