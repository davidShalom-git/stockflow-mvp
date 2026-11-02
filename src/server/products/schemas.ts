import { z } from "zod";

const skuSchema = z
  .string()
  .trim()
  .min(1)
  .max(64)
  .transform((sku) => sku.toUpperCase());

const priceSchema = z
  .union([z.string(), z.number().finite()])
  .transform(String)
  .refine((price) => /^-?\d{1,10}(?:\.\d{1,2})?$/.test(price), {
    message: "Price must fit the database's 10 whole digit and 2 decimal place limit.",
  });

const productFields = {
  name: z.string().trim().min(1).max(160),
  sku: skuSchema,
  description: z.string().nullable().optional(),
  quantityOnHand: z.number().int().optional(),
  costPrice: priceSchema.nullable().optional(),
  sellingPrice: priceSchema.nullable().optional(),
  lowStockThreshold: z.number().int().nullable().optional(),
};

export const createProductSchema = z.object(productFields).strict().required({ name: true, sku: true });

export const updateProductSchema = z
  .object(productFields)
  .partial()
  .strict()
  .refine((fields) => Object.keys(fields).length > 0, "Provide at least one field to update.");

export const productSearchSchema = z.string().trim().max(100);

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
