import { z } from "zod";

const settingsFields = {
  organizationName: z.string().trim().min(1).max(120),
  defaultLowStockThreshold: z.number().int().min(0).max(2_147_483_647),
};

export const updateSettingsSchema = z
  .object(settingsFields)
  .partial()
  .strict()
  .refine((settings) => Object.keys(settings).length > 0, "Provide at least one setting to update.");

export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
