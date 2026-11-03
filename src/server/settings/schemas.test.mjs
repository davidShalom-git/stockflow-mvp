import test from "node:test";
import assert from "node:assert/strict";
import { updateSettingsSchema } from "./schemas.ts";

test("organization names are trimmed and bounded", () => {
  assert.deepEqual(updateSettingsSchema.parse({ organizationName: "  Cedar Supply  " }), {
    organizationName: "Cedar Supply",
  });
  assert.equal(updateSettingsSchema.safeParse({ organizationName: "  " }).success, false);
});

test("default threshold accepts nonnegative integers only", () => {
  assert.equal(updateSettingsSchema.parse({ defaultLowStockThreshold: 0 }).defaultLowStockThreshold, 0);
  assert.equal(updateSettingsSchema.safeParse({ defaultLowStockThreshold: -1 }).success, false);
  assert.equal(updateSettingsSchema.safeParse({ defaultLowStockThreshold: 1.5 }).success, false);
});

test("unknown fields and empty updates are rejected", () => {
  assert.equal(updateSettingsSchema.safeParse({}).success, false);
  assert.equal(updateSettingsSchema.safeParse({ organizationId: "another-org" }).success, false);
});
