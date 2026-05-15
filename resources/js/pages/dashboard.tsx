import { Head } from '@inertiajs/react';
import { CategoryBarChart } from '@/components/charts/category-bar-chart';
import { StockHealthChart } from '@/components/charts/stock-health-chart';
import { UsageTrendChart } from '@/components/charts/usage-trend-chart';
import { IntelBlock } from '@/components/molecules/IntelBlock';
import { MetricBlock } from '@/components/molecules/MetricBlock';
import {
    CriticalProductsTable
    
} from '@/components/organisms/CriticalProductsTable';
import type {CriticalProduct} from '@/components/organisms/CriticalProductsTable';
import {
    RecentActivityList
    
} from '@/components/organisms/RecentActivityList';
import type {RecentTx} from '@/components/organisms/RecentActivityList';
import {
    RestockTable
    
} from '@/components/organisms/RestockTable';
import type {RestockRec} from '@/components/organisms/RestockTable';
import type { DailyUsage, StockHealth, CategoryStock } from '@/types/gudangin';

interface Props {
    metrics: {
        totalProducts: number;
        totalStock: number;
        lowStockCount: number;
        deadStockCount: number;
        productsAddedToday: number;
        stockDelta: number;
    };
    restockMetrics: {
        avgUsage: string;
        minDaysLeft: number;
        restockNeed: number;
    };
    usageTrend: DailyUsage[];
    avgTrend: number;
    stockHealth: StockHealth[];
    criticalProducts: CriticalProduct[];
    categoryDistribution: CategoryStock[];
    restockRecommendations: RestockRec[];
    recentTransactions: RecentTx[];
}

export default function Dashboard({
    metrics,
    restockMetrics,
    usageTrend,
    avgTrend,
    stockHealth,
    criticalProducts,
    categoryDistribution,
    restockRecommendations,
    recentTransactions,
}: Props) {
    const stockIndicator =
        metrics.stockDelta >= 0
            ? `+${metrics.stockDelta}`
            : `${metrics.stockDelta}`;
    const today = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-360 px-8 py-10 lg:px-14">
                    <header className="mb-14 flex items-end justify-between pb-8">
                        <div>
                            <p className="mb-2 font-sans text-xs font-medium tracking-[0.2em] text-gd-muted uppercase">
                                Admin <br /> Inventory Intelligence
                            </p>
                            <h1 className="font-serif text-[3.25rem] leading-none font-semibold tracking-tight text-gd-ink">
                                Inventory
                                <span className="ml-3 text-gd-coral italic">
                                    Overview
                                </span>
                            </h1>
                        </div>
                        <p className="font-sans text-sm text-gd-muted-soft">
                            {today}
                        </p>
                    </header>
                    <section className="mb-14 grid grid-cols-4 divide-x divide-gd-hairline rounded-2xl border border-gd-hairline bg-gd-surface-card">
                        <MetricBlock
                            label="Total Produk"
                            value={metrics.totalProducts.toLocaleString()}
                            sub={`+${metrics.productsAddedToday} hari ini`}
                            subColor="text-gd-teal"
                        />
                        <MetricBlock
                            label="Total Stok"
                            value={metrics.totalStock.toLocaleString()}
                            sub={stockIndicator + ' vs kemarin'}
                            subColor={
                                metrics.stockDelta >= 0
                                    ? 'text-gd-teal'
                                    : 'text-gd-coral'
                            }
                        />
                        <MetricBlock
                            label="Low Stock"
                            value={metrics.lowStockCount.toString()}
                            sub="produk hampir habis"
                            subColor={
                                metrics.lowStockCount > 0
                                    ? 'text-gd-amber'
                                    : 'text-gd-muted'
                            }
                        />
                        <MetricBlock
                            label="Dead Stock"
                            value={metrics.deadStockCount.toString()}
                            sub="tidak bergerak"
                            subColor={
                                metrics.deadStockCount > 0
                                    ? 'text-gd-coral'
                                    : 'text-gd-muted'
                            }
                        />
                    </section>

                    {/* ─── RESTOCK INTELLIGENCE STRIP ─── */}
                    <section className="mb-14 grid grid-cols-3 divide-x divide-gd-ink/10 rounded-2xl border border-gd-ink bg-gd-surface-dark px-0 py-0">
                        <IntelBlock
                            label="Avg Usage"
                            value={restockMetrics.avgUsage}
                            note="rata-rata harian"
                        />
                        <IntelBlock
                            label="Min Days Left"
                            value={restockMetrics.minDaysLeft.toString()}
                            note="produk paling kritis"
                            highlight
                        />
                        <IntelBlock
                            label="Restock Need"
                            value={
                                restockMetrics.restockNeed.toString() + ' unit'
                            }
                            note="total kuantitas butuh restock"
                        />
                    </section>

                    {/* ─── CHARTS ─── */}
                    <section className="mb-14 grid grid-cols-1 gap-6 xl:grid-cols-5">
                        {/* Usage Trend — wider */}
                        <div className="col-span-3 rounded-2xl border border-gd-hairline bg-gd-surface-card p-8">
                            <div className="mb-6 flex items-baseline justify-between">
                                <h2 className="font-serif text-2xl font-semibold text-gd-ink">
                                    Usage Trend
                                </h2>
                                <span className="font-sans text-xs font-medium tracking-widest text-gd-muted uppercase">
                                    30 hari
                                </span>
                            </div>
                            <UsageTrendChart
                                data={usageTrend}
                                average={avgTrend}
                            />
                        </div>

                        {/* Stock Health — narrower */}
                        <div className="col-span-2 rounded-2xl border border-gd-hairline bg-gd-surface-card p-8">
                            <div className="mb-6 flex items-baseline justify-between">
                                <h2 className="font-serif text-2xl font-semibold text-gd-ink">
                                    Stock Health
                                </h2>
                                <span className="font-sans text-xs font-medium tracking-widest text-gd-muted uppercase">
                                    distribusi
                                </span>
                            </div>
                            <StockHealthChart data={stockHealth} />
                        </div>
                    </section>

                    {/* ─── RESTOCK RECOMMENDATIONS (DECISION TABLE) ─── */}
                    {restockRecommendations.length > 0 && (
                        <RestockTable
                            recommendations={restockRecommendations}
                        />
                    )}
                    <section className="mb-14 grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <CriticalProductsTable products={criticalProducts} />
                        <RecentActivityList transactions={recentTransactions} />
                    </section>
                    <section className="mb-8 rounded-2xl border border-gd-hairline bg-gd-surface-card">
                        <div className="border-b border-gd-hairline px-8 py-6">
                            <h2 className="font-serif text-2xl font-semibold text-gd-ink">
                                Category Distribution
                            </h2>
                            <p className="mt-0.5 font-sans text-xs text-gd-muted">
                                Total stok per kategori produk
                            </p>
                        </div>
                        <div className="p-8">
                            <CategoryBarChart data={categoryDistribution} />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
