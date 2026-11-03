import test from "node:test";
import assert from "node:assert/strict";
import { summarizeDashboard } from "./metrics.ts";

const product = (id, quantityOnHand, lowStockThreshold = null) => ({
  id,
  name: `Product ${id}`,
  sku: `SKU-${id}`,
  quantityOnHand,
  lowStockThreshold,
  createdAt: new Date(`2026-01-0${id}T00:00:00.000Z`),
});

test("dashboard totals use the organization default unless a product overrides it", () => {
  const result = summarizeDashboard(
    [product("1", 2), product("2", 5, 4), product("3", 0, 1), product("4", 20)],
    5,
  );

  assert.equal(result.totalProducts, 4);
  assert.equal(result.totalUnits, 27);
  assert.equal(result.lowStockCount, 1);
  assert.equal(result.outOfStockCount, 1);
  assert.deepEqual(result.attentionProducts.map(({ id }) => id), ["3", "1"]);
});

test("empty inventory has zero metrics and empty lists", () => {
  assert.deepEqual(summarizeDashboard([], 5), {
    totalProducts: 0,
    totalUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    recentProducts: [],
    attentionProducts: [],
  });
});

test("attention and recent product previews are limited to five", () => {
  const products = Array.from({ length: 8 }, (_, index) => product(String(index + 1), 0));
  const result = summarizeDashboard(products, 5);

  assert.equal(result.attentionProducts.length, 5);
  assert.equal(result.recentProducts.length, 5);
});
