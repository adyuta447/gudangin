import { useState, useEffect } from 'react';
import { MiniTrendChart } from '@/components/charts/mini-trend-chart';

interface DailyUsage {
    date: string;
    quantity: number;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    categoryId: number;
    category: string;
    stock: number;
    velocity: number;
    daysLeft: number;
    minStock: number;
}

interface ProductDetailProps {
    product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
    const [trend, setTrend] = useState<DailyUsage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isCancelled = false;

        async function loadData() {
            setLoading(true);
            try {
                const res = await fetch(`/products/${product.id}/usage-trend`);
                const data = await res.json();
                if (!isCancelled) {
                    setTrend(data);
                    setLoading(false);
                }
            } catch {
                if (!isCancelled) {
                    setTrend([]);
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            isCancelled = true;
        };
    }, [product.id]);

    const isLow = product.stock <= product.minStock;
    const stockPct = Math.min(
        100,
        Math.round((product.stock / Math.max(product.minStock * 2, 1)) * 100),
    );

    return (
        <div className="space-y-4">
            {/* Identity card */}
            <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-7">
                <p className="font-sans text-xs font-medium tracking-[0.15em] text-gd-muted uppercase">
                    {product.category}
                </p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-gd-ink">
                    {product.name}
                </h2>
                <p className="mt-0.5 font-sans text-xs text-gd-muted-soft">
                    {product.sku}
                </p>

                {/* Stock bar */}
                <div className="mt-6">
                    <div className="mb-2 flex items-baseline justify-between">
                        <span className="font-sans text-xs text-gd-muted">
                            Stok
                        </span>
                        <span
                            className={`font-sans text-xs font-semibold ${isLow ? 'text-gd-coral' : 'text-gd-muted'}`}
                        >
                            min {product.minStock}
                        </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gd-hairline">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${stockPct}%`,
                                backgroundColor: isLow ? '#cc785c' : '#5db8a6',
                            }}
                        />
                    </div>
                    <p
                        className={`mt-1.5 font-sans text-3xl font-bold tracking-tight ${isLow ? 'text-gd-coral' : 'text-gd-ink'}`}
                    >
                        {product.stock}
                        <span className="ml-1.5 font-sans text-sm font-normal text-gd-muted-soft">
                            unit
                        </span>
                    </p>
                </div>

                {/* KPI row */}
                <div className="mt-6 grid grid-cols-2 divide-x divide-gd-hairline border-t border-gd-hairline pt-5">
                    <div className="pr-5">
                        <p className="font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                            Velocity
                        </p>
                        <p className="mt-1.5 font-sans text-2xl font-bold text-gd-ink">
                            {product.velocity}
                            <span className="ml-1 font-sans text-xs font-normal text-gd-muted-soft">
                                /day
                            </span>
                        </p>
                    </div>
                    <div className="pl-5">
                        <p className="font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                            Sisa Hari
                        </p>
                        <p
                            className={`mt-1.5 font-sans text-2xl font-bold ${
                                product.daysLeft <= 3
                                    ? 'text-gd-coral'
                                    : product.daysLeft <= 7
                                      ? 'text-gd-amber'
                                      : 'text-gd-ink'
                            }`}
                        >
                            {product.daysLeft >= 999 ? '∞' : product.daysLeft}
                            <span className="ml-1 font-sans text-xs font-normal text-gd-muted-soft">
                                hari
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Trend card */}
            <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-7">
                <div className="mb-5 flex items-baseline justify-between">
                    <h3 className="font-serif text-lg font-semibold text-gd-ink">
                        Trend Usage
                    </h3>
                    <span className="font-sans text-xs font-medium tracking-widest text-gd-muted uppercase">
                        7 hari
                    </span>
                </div>
                {loading ? (
                    <div className="flex h-24 items-center justify-center">
                        <p className="font-sans text-xs text-gd-muted-soft">
                            Memuat…
                        </p>
                    </div>
                ) : trend.length > 0 ? (
                    <MiniTrendChart data={trend} />
                ) : (
                    <div className="flex h-24 items-center justify-center border-t border-gd-hairline">
                        <p className="font-sans text-xs text-gd-muted-soft">
                            Belum ada data transaksi
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
