import { Head } from '@inertiajs/react';
import {
    Package, TrendingDown, TrendingUp, AlertTriangle, XCircle,
    Activity, BarChart3, PieChart as PieChartIcon, TableProperties,
    ShieldCheck, CalendarClock, ArrowUpRight, ArrowDownRight, Clock,
} from 'lucide-react';
import { UsageTrendChart } from '@/components/charts/usage-trend-chart';
import { StockHealthChart } from '@/components/charts/stock-health-chart';
import { CategoryBarChart } from '@/components/charts/category-bar-chart';

interface DailyUsage { date: string; quantity: number; }
interface StockHealth { type: string; percentage: number; color: string; }
interface CategoryStock { category: string; totalStock: number; }
interface CriticalProduct { id: number; name: string; stock: number; daysLeft: number; velocity: number; minStock: number; }
interface RestockRec { id: number; name: string; stock: number; velocity: number; daysLeft: number; minStock: number; optimalOrder: number; urgency: 'critical' | 'warning' | 'moderate'; estimatedDepletion: string; }
interface RecentTx { id: number; productName: string; userName: string; quantity: number; type: 'IN' | 'OUT'; timestamp: string; }

interface Props {
    metrics: {
        totalProducts: number; totalStock: number;
        lowStockCount: number; deadStockCount: number;
        productsAddedToday: number; stockDelta: number;
    };
    restockMetrics: { avgUsage: string; minDaysLeft: number; restockNeed: number; };
    usageTrend: DailyUsage[];
    avgTrend: number;
    stockHealth: StockHealth[];
    criticalProducts: CriticalProduct[];
    categoryDistribution: CategoryStock[];
    restockRecommendations: RestockRec[];
    recentTransactions: RecentTx[];
}

export default function Dashboard({
    metrics, restockMetrics, usageTrend, avgTrend,
    stockHealth, criticalProducts, categoryDistribution,
    restockRecommendations, recentTransactions,
}: Props) {
    const stockIndicator = metrics.stockDelta >= 0 ? `+${metrics.stockDelta}` : `${metrics.stockDelta}`;
    const stockType = metrics.stockDelta >= 0 ? 'positive' : 'negative';

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
                    <header className="mb-10">
                        <h1 className="font-serif text-4xl font-semibold tracking-tight text-gd-ink">
                            Inventory Overview
                        </h1>
                        <p className="mt-2 font-sans text-base text-gd-muted">
                            Insight & analytics dashboard — data terakhir hari ini
                        </p>
                    </header>

                    {/* ─── TOP METRICS ─── */}
                    <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <MetricCard label="Total Produk" value={metrics.totalProducts.toLocaleString()} indicator={`+${metrics.productsAddedToday}`} indicatorType="positive" icon={Package} />
                        <MetricCard label="Total Stok" value={metrics.totalStock.toLocaleString()} indicator={stockIndicator} indicatorType={stockType} icon={TrendingUp} />
                        <MetricCard label="Low Stock" value={metrics.lowStockCount.toString()} indicator="warning" indicatorType="amber" icon={AlertTriangle} />
                        <MetricCard label="Dead Stock" value={metrics.deadStockCount.toString()} indicator="critical" indicatorType="coral" icon={XCircle} />
                    </section>

                    {/* ─── RESTOCK METRICS PANEL ─── */}
                    <section className="mb-8">
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-soft p-6" style={{ borderLeft: '4px solid #cc785c' }}>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <RestockMetric label="Avg Usage" value={restockMetrics.avgUsage} />
                                <RestockMetric label="Min Days Left" value={restockMetrics.minDaysLeft.toString()} />
                                <RestockMetric label="Restock Need" value={restockMetrics.restockNeed.toString()} />
                            </div>
                        </div>
                    </section>

                    {/* ─── CHARTS ROW ─── */}
                    <section className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-gd-muted" />
                                <h3 className="font-serif text-lg font-semibold text-gd-ink">Usage Trend (30 Hari)</h3>
                            </div>
                            <UsageTrendChart data={usageTrend} average={avgTrend} />
                        </div>
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <PieChartIcon className="h-4 w-4 text-gd-muted" />
                                <h3 className="font-serif text-lg font-semibold text-gd-ink">Stock Health</h3>
                            </div>
                            <StockHealthChart data={stockHealth} />
                        </div>
                    </section>

                    {/* ─── RESTOCK RECOMMENDATIONS (DECISION OUTPUT) ─── */}
                    {restockRecommendations.length > 0 && (
                        <section className="mb-8">
                            <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                                <div className="mb-5 flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-gd-coral" />
                                    <h3 className="font-serif text-lg font-semibold text-gd-ink">Rekomendasi Restock</h3>
                                    <span className="ml-auto rounded-full bg-gd-coral/10 px-3 py-1 font-sans text-xs font-medium text-gd-coral">
                                        {restockRecommendations.length} produk
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gd-hairline">
                                                <th className="px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Produk</th>
                                                <th className="px-4 py-3 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Stok</th>
                                                <th className="px-4 py-3 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Velocity</th>
                                                <th className="px-4 py-3 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Sisa Hari</th>
                                                <th className="px-4 py-3 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Estimasi Habis</th>
                                                <th className="px-4 py-3 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Order Optimal</th>
                                                <th className="px-4 py-3 text-center font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Urgensi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {restockRecommendations.map((rec) => (
                                                <tr key={rec.id} className="border-b border-gd-hairline/50 transition-colors hover:bg-gd-surface-soft/50">
                                                    <td className="px-4 py-3.5 font-sans text-sm font-medium text-gd-ink">{rec.name}</td>
                                                    <td className="px-4 py-3.5 text-right font-sans text-sm font-bold text-gd-ink">{rec.stock}</td>
                                                    <td className="px-4 py-3.5 text-right font-sans text-sm text-gd-body">{rec.velocity}/day</td>
                                                    <td className="px-4 py-3.5 text-right">
                                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 font-sans text-sm font-bold ${
                                                            rec.daysLeft <= 3 ? 'bg-gd-coral/10 text-gd-coral' :
                                                            rec.daysLeft <= 7 ? 'bg-gd-amber/10 text-gd-amber' : 'text-gd-ink'
                                                        }`}>{rec.daysLeft}</span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right font-sans text-sm text-gd-body">
                                                        <span className="flex items-center justify-end gap-1">
                                                            <CalendarClock className="h-3 w-3" />
                                                            {rec.estimatedDepletion}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right font-sans text-sm font-bold text-gd-teal">{rec.optimalOrder} unit</td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <span className={`inline-flex rounded-full px-3 py-1 font-sans text-xs font-bold uppercase ${
                                                            rec.urgency === 'critical' ? 'bg-gd-coral/15 text-gd-coral' :
                                                            rec.urgency === 'warning' ? 'bg-gd-amber/15 text-gd-amber' :
                                                            'bg-gd-teal/15 text-gd-teal'
                                                        }`}>{rec.urgency}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ─── CRITICAL + RECENT TRANSACTIONS ─── */}
                    <section className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {/* Critical Products */}
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <TableProperties className="h-4 w-4 text-gd-muted" />
                                <h3 className="font-serif text-lg font-semibold text-gd-ink">Critical Products</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gd-hairline">
                                            <th className="px-3 py-2 text-left font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Produk</th>
                                            <th className="px-3 py-2 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Stok</th>
                                            <th className="px-3 py-2 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Sisa</th>
                                            <th className="px-3 py-2 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Velocity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {criticalProducts.map((p) => (
                                            <tr key={p.id} className="border-b border-gd-hairline/50 transition-colors hover:bg-gd-surface-soft/50">
                                                <td className="px-3 py-3 font-sans text-sm font-medium text-gd-ink">{p.name}</td>
                                                <td className="px-3 py-3 text-right font-sans text-sm font-bold text-gd-ink">{p.stock}</td>
                                                <td className="px-3 py-3 text-right">
                                                    <span className={`inline-flex rounded-full px-2 py-0.5 font-sans text-sm font-bold ${
                                                        p.daysLeft <= 3 ? 'bg-gd-coral/10 text-gd-coral' :
                                                        p.daysLeft <= 7 ? 'bg-gd-amber/10 text-gd-amber' : 'text-gd-ink'
                                                    }`}>{p.daysLeft}</span>
                                                </td>
                                                <td className="px-3 py-3 text-right font-sans text-sm text-gd-body">{p.velocity}/d</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gd-muted" />
                                <h3 className="font-serif text-lg font-semibold text-gd-ink">Aktivitas Terbaru</h3>
                            </div>
                            <div className="space-y-0">
                                {recentTransactions.map((tx) => {
                                    const time = new Date(tx.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                    const isIn = tx.type === 'IN';
                                    return (
                                        <div key={tx.id} className="flex items-center gap-4 border-b border-gd-hairline/50 py-3 last:border-b-0">
                                            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isIn ? 'bg-gd-teal/10 text-gd-teal' : 'bg-gd-coral/10 text-gd-coral'}`}>
                                                {isIn ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-sans text-sm text-gd-ink truncate">
                                                    <span className="font-medium">{tx.productName}</span>{' '}
                                                    <span className="text-gd-muted">{isIn ? 'masuk' : 'keluar'}</span>{' '}
                                                    <span className="font-bold">{tx.quantity}</span>
                                                </p>
                                                <p className="font-sans text-xs text-gd-muted-soft">oleh {tx.userName}</p>
                                            </div>
                                            <span className="flex-shrink-0 font-sans text-xs text-gd-muted-soft">{time}</span>
                                        </div>
                                    );
                                })}
                                {recentTransactions.length === 0 && (
                                    <p className="py-6 text-center font-sans text-sm text-gd-muted-soft">Belum ada transaksi</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* ─── CATEGORY DISTRIBUTION ─── */}
                    <section className="mb-8">
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <BarChart3 className="h-4 w-4 text-gd-muted" />
                                <h3 className="font-serif text-lg font-semibold text-gd-ink">Category Distribution</h3>
                            </div>
                            <CategoryBarChart data={categoryDistribution} />
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function MetricCard({ label, value, indicator, indicatorType, icon: Icon }: {
    label: string; value: string; indicator: string;
    indicatorType: 'positive' | 'negative' | 'amber' | 'coral';
    icon: React.ComponentType<{ className?: string }>;
}) {
    const styles = { positive: 'text-gd-teal', negative: 'text-gd-coral', amber: 'text-gd-amber', coral: 'text-gd-coral' };
    const icons = {
        positive: <TrendingUp className="h-3.5 w-3.5" />, negative: <TrendingDown className="h-3.5 w-3.5" />,
        amber: <AlertTriangle className="h-3.5 w-3.5" />, coral: <XCircle className="h-3.5 w-3.5" />,
    };
    return (
        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-5 transition-all duration-200 hover:border-gd-coral/30">
            <div className="mb-3 flex items-center justify-between">
                <span className="font-sans text-sm text-gd-muted">{label}</span>
                <Icon className="h-4 w-4 text-gd-muted-soft" />
            </div>
            <div className="flex items-end justify-between">
                <span className="font-sans text-3xl font-bold tracking-tight text-gd-ink">{value}</span>
                <span className={`flex items-center gap-1 font-sans text-sm font-medium ${styles[indicatorType]}`}>
                    {icons[indicatorType]}{indicator}
                </span>
            </div>
        </div>
    );
}

function RestockMetric({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-center">
            <p className="font-sans text-sm text-gd-muted">{label}</p>
            <p className="mt-1 font-sans text-3xl font-bold tracking-tight text-gd-ink">{value}</p>
        </div>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
