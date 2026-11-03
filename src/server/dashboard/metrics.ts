export type DashboardProduct = {
  id: string;
  name: string;
  sku: string;
  quantityOnHand: number;
  lowStockThreshold: number | null;
  createdAt: Date;
};

export function summarizeDashboard(products: DashboardProduct[], defaultThreshold: number) {
  const effectiveThreshold = (threshold: number | null) => threshold ?? defaultThreshold;
  const lowStockProducts = products.filter(
    (product) =>
      product.quantityOnHand > 0 &&
      product.quantityOnHand <= effectiveThreshold(product.lowStockThreshold),
  );
  const attentionProducts = products
    .filter(
      (product) =>
        product.quantityOnHand === 0 ||
        (product.quantityOnHand > 0 &&
          product.quantityOnHand <= effectiveThreshold(product.lowStockThreshold)),
    )
    .sort(
      (left, right) =>
        left.quantityOnHand - right.quantityOnHand ||
        right.createdAt.getTime() - left.createdAt.getTime(),
    )
    .slice(0, 5);

  return {
    totalProducts: products.length,
    totalUnits: products.reduce((total, product) => total + product.quantityOnHand, 0),
    lowStockCount: lowStockProducts.length,
    outOfStockCount: products.filter((product) => product.quantityOnHand === 0).length,
    recentProducts: products.slice(0, 5),
    attentionProducts,
  };
}
