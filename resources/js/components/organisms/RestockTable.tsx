import { UrgencyPill } from '@/components/atoms/UrgencyPill';

export interface RestockRec {
    id: number;
    name: string;
    stock: number;
    velocity: number;
    daysLeft: number;
    minStock: number;
    optimalOrder: number;
    urgency: 'critical' | 'warning' | 'moderate';
    estimatedDepletion: string;
}

interface RestockTableProps {
    recommendations: RestockRec[];
}

export function RestockTable({ recommendations }: RestockTableProps) {
    if (recommendations.length === 0) return null;

    return (
        <section className="mb-14">
            <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card">
                <div className="flex items-baseline justify-between border-b border-gd-hairline px-8 py-6">
                    <h2 className="font-serif text-2xl font-semibold text-gd-ink">
                        Rekomendasi Restock
                    </h2>
                    <span className="font-sans text-xs font-medium tracking-widest text-gd-coral uppercase">
                        {recommendations.length} produk perlu aksi
                    </span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gd-hairline">
                                <th className="px-8 py-4 text-left font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                    Produk
                                </th>
                                <th className="px-6 py-4 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                    Stok
                                </th>
                                <th className="px-6 py-4 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                    Velocity
                                </th>
                                <th className="px-6 py-4 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                    Sisa Hari
                                </th>
                                <th className="px-6 py-4 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                    Habis Estimasi
                                </th>
                                <th className="px-6 py-4 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                    Order Optimal
                                </th>
                                <th className="px-8 py-4 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                    Urgensi
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recommendations.map((rec, i) => (
                                <tr
                                    key={rec.id}
                                    className={`border-b border-gd-hairline/60 transition-colors hover:bg-gd-surface-soft/60 ${i === recommendations.length - 1 ? 'border-b-0' : ''}`}
                                >
                                    <td className="px-8 py-4">
                                        <span className="font-sans text-sm font-semibold text-gd-ink">
                                            {rec.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-sans text-sm font-bold text-gd-ink">
                                        {rec.stock}
                                    </td>
                                    <td className="px-6 py-4 text-right font-sans text-sm text-gd-muted">
                                        {rec.velocity}/day
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span
                                            className={`font-sans text-sm font-bold ${
                                                rec.daysLeft <= 3
                                                    ? 'text-gd-coral'
                                                    : rec.daysLeft <= 7
                                                      ? 'text-gd-amber'
                                                      : 'text-gd-ink'
                                            }`}
                                        >
                                            {rec.daysLeft}d
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-sans text-sm text-gd-muted">
                                        {rec.estimatedDepletion}
                                    </td>
                                    <td className="px-6 py-4 text-right font-sans text-sm font-bold text-gd-teal">
                                        {rec.optimalOrder}
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <UrgencyPill urgency={rec.urgency} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
