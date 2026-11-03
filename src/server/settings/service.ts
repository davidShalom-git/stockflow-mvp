import "server-only";

import { prisma } from "@/lib/prisma";
import type { UpdateSettingsInput } from "./schemas";

const settingsSelect = {
  name: true,
  defaultLowStockThreshold: true,
} as const;

export function getOrganizationSettings(organizationId: string) {
  return prisma.organization.findUnique({
    where: { id: organizationId },
    select: settingsSelect,
  });
}

export async function updateOrganizationSettings(
  organizationId: string,
  input: UpdateSettingsInput,
) {
  const result = await prisma.organization.updateMany({
    where: { id: organizationId },
    data: {
      ...(input.organizationName === undefined ? {} : { name: input.organizationName }),
      ...(input.defaultLowStockThreshold === undefined
        ? {}
        : { defaultLowStockThreshold: input.defaultLowStockThreshold }),
    },
  });

  if (result.count === 0) return null;
  return getOrganizationSettings(organizationId);
}
