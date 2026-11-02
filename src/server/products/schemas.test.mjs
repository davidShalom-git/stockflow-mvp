import test from "node:test";
import assert from "node:assert/strict";
import { createProductSchema, updateProductSchema } from "./schemas.ts";

test("SKU input is trimmed and normalized to uppercase", () => {
  const result = createProductSchema.parse({ name: " Widget ", sku: " abc-1 " });
  assert.equal(result.name, "Widget");
  assert.equal(result.sku, "ABC-1");
});

test("client cannot assign organization ownership", () => {
  const result = createProductSchema.safeParse({ name: "Widget", sku: "W-1", organizationId: "other-org" });
  assert.equal(result.success, false);
});

test("updates require at least one recognized field", () => {
  assert.equal(updateProductSchema.safeParse({}).success, false);
  assert.equal(updateProductSchema.safeParse({ quantityOnHand: 12 }).success, true);
});

test("prices retain decimal text and reject values outside database precision", () => {
  assert.equal(createProductSchema.parse({ name: "Widget", sku: "W-1", costPrice: "12.30" }).costPrice, "12.30");
  assert.equal(createProductSchema.safeParse({ name: "Widget", sku: "W-1", costPrice: "12345678901.00" }).success, false);
});
