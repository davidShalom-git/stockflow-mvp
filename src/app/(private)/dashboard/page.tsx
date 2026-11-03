import { redirect } from "next/navigation";
import { getCurrentUser } from "@/server/auth/session";
import { getDashboardData } from "@/server/dashboard/service";

const numberFormatter = new Intl.NumberFormat("en-US");

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const dashboard = await getDashboardData(user.organization.id);
  const metrics = [
    {
      label: "Total products",
      value: dashboard.totalProducts,
      description: "Products in your catalog",
      color: "text-zinc-950",
    },
    {
      label: "Units in stock",
      value: dashboard.totalUnits,
      description: "Across all products",
      color: "text-zinc-950",
    },
    {
      label: "Low stock",
      value: dashboard.lowStockCount,
      description: "At or below their threshold",
      color: "text-amber-700",
    },
    {
      label: "Out of stock",
      value: dashboard.outOfStockCount,
      description: "Products with zero units",
      color: "text-rose-700",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-emerald-700">OVERVIEW</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Inventory dashboard</h1>
        <p className="mt-2 text-sm text-zinc-600">A quick view of what you have in stock and what needs attention.</p>
      </div>

      <section aria-label="Inventory summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-medium text-zinc-600">{metric.label}</h2>
            <p className={`mt-3 text-3xl font-semibold tracking-tight ${metric.color}`}>
              {numberFormatter.format(metric.value)}
            </p>
            <p className="mt-2 text-xs text-zinc-500">{metric.description}</p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section aria-labelledby="recent-products-heading" className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
            <h2 id="recent-products-heading" className="font-semibold text-zinc-950">Recently added products</h2>
            <p className="mt-1 text-sm text-zinc-500">The latest five products added to your catalog.</p>
          </div>
          {dashboard.recentProducts.length === 0 ? (
            <p className="px-5 py-8 text-sm text-zinc-600 sm:px-6">Products you add will appear here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium sm:px-6">Product</th>
                    <th scope="col" className="px-5 py-3 font-medium">SKU</th>
                    <th scope="col" className="px-5 py-3 text-right font-medium sm:px-6">On hand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {dashboard.recentProducts.map((product) => (
                    <tr key={product.id}>
                      <th scope="row" className="px-5 py-4 font-medium text-zinc-900 sm:px-6">{product.name}</th>
                      <td className="px-5 py-4 font-mono text-xs text-zinc-500">{product.sku}</td>
                      <td className="px-5 py-4 text-right tabular-nums text-zinc-700 sm:px-6">
                        {numberFormatter.format(product.quantityOnHand)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-labelledby="attention-heading" className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-5 py-4 sm:px-6">
            <h2 id="attention-heading" className="font-semibold text-zinc-950">Stock to review</h2>
            <p className="mt-1 text-sm text-zinc-500">Products at or below their stock threshold.</p>
          </div>
          {dashboard.attentionProducts.length === 0 ? (
            <p className="px-5 py-8 text-sm text-zinc-600 sm:px-6">No products need stock attention right now.</p>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {dashboard.attentionProducts.map((product) => {
                const outOfStock = product.quantityOnHand === 0;
                return (
                  <li key={product.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">{product.name}</p>
                      <p className="mt-1 font-mono text-xs text-zinc-500">{product.sku}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${outOfStock ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800"}`}>
                        {outOfStock ? "Out of stock" : "Low stock"}
                      </span>
                      <p className="mt-1 text-xs tabular-nums text-zinc-500">
                        {numberFormatter.format(product.quantityOnHand)} on hand
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
