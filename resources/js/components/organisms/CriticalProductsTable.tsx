export interface CriticalProduct {
    id: number;
    name: string;
    stock: number;
    daysLeft: number;
    velocity: number;
    minStock: number;
}

interface CriticalProductsTableProps {
    products: CriticalProduct[];
}

export function CriticalProductsTable({
    products,
}: CriticalProductsTableProps) {
    return (
        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card">
            <div className="border-b border-gd-hairline px-8 py-6">
                <h2 className="font-serif text-2xl font-semibold text-gd-ink">
                    Critical Products
                </h2>
                <p className="mt-0.5 font-sans text-xs text-gd-muted">
                    Produk dengan sisa stok paling kritis
                </p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gd-hairline">
                            <th className="px-8 py-3 text-left font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                Produk
                            </th>
                            <th className="px-5 py-3 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                Stok
                            </th>
                            <th className="px-5 py-3 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                Sisa
                            </th>
                            <th className="px-8 py-3 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                Velocity
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p, i) => (
                            <tr
                                key={p.id}
                                className={`border-b border-gd-hairline/60 transition-colors hover:bg-gd-surface-soft/60 ${i === products.length - 1 ? 'border-b-0' : ''}`}
                            >
                                <td className="px-8 py-3.5 font-sans text-sm font-semibold text-gd-ink">
                                    {p.name}
                                </td>
                                <td className="px-5 py-3.5 text-right font-sans text-sm font-bold text-gd-ink">
                                    {p.stock}
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <span
                                        className={`font-sans text-sm font-bold ${
                                            p.daysLeft <= 3
                                                ? 'text-gd-coral'
                                                : p.daysLeft <= 7
                                                  ? 'text-gd-amber'
                                                  : 'text-gd-ink'
                                        }`}
                                    >
                                        {p.daysLeft}d
                                    </span>
                                </td>
                                <td className="px-8 py-3.5 text-right font-sans text-sm text-gd-muted">
                                    {p.velocity}/day
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
