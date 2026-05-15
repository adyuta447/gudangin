import { Head } from '@inertiajs/react';
import {
    TrendingDown, TrendingUp, AlertTriangle, XCircle,
    ArrowUpRight, ArrowDownRight, MoveUpRight,
} from 'lucide-react';
import { UsageTrendChart } from '@/components/charts/usage-trend-chart';
import { StockHealthChart } from '@/components/charts/stock-health-chart';
import { CategoryBarChart } from '@/components/charts/category-bar-chart';

interface DailyUsage { date: string; quantity: number; }
interface StockHealth { type: string; percentage: number; color: string; }
interface CategoryStock { category: string; totalStock: number; }
interface CriticalProduct { id: number; name: string; stock: number; daysLeft: number; velocity: number; minStock: number; }
interface RestockRec {
    id: number; name: string; stock: number; velocity: number;
    daysLeft: number; minStock: number; optimalOrder: number;
    urgency: 'critical' | 'warning' | 'moderate'; estimatedDepletion: string;
}
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
    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-[1440px] px-8 py-10 lg:px-14">
                    <header className="mb-14 flex items-end justify-between pb-8">
                        <div>
                            <p className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-gd-muted">
                                Admin - Inventory Intelligence
                            </p>
                            <h1 className="font-serif text-[3.25rem] font-semibold leading-none tracking-tight text-gd-ink">
                                Inventory
                                <span className="ml-3 italic text-gd-coral">Overview</span>
                            </h1>
                        </div>
                        <p className="font-sans text-sm text-gd-muted-soft">{today}</p>
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
                            subColor={metrics.stockDelta >= 0 ? 'text-gd-teal' : 'text-gd-coral'}
                        />
                        <MetricBlock
                            label="Low Stock"
                            value={metrics.lowStockCount.toString()}
                            sub="produk hampir habis"
                            subColor={metrics.lowStockCount > 0 ? 'text-gd-amber' : 'text-gd-muted'}
                        />
                        <MetricBlock
                            label="Dead Stock"
                            value={metrics.deadStockCount.toString()}
                            sub="tidak bergerak"
                            subColor={metrics.deadStockCount > 0 ? 'text-gd-coral' : 'text-gd-muted'}
                        />
                    </section>

                    {/* ─── RESTOCK INTELLIGENCE STRIP ─── */}
                    <section className="mb-14 grid grid-cols-3 divide-x divide-gd-ink/10 rounded-2xl border border-gd-ink bg-gd-surface-dark px-0 py-0">
                        <IntelBlock label="Avg Usage" value={restockMetrics.avgUsage} note="rata-rata harian" />
                        <IntelBlock label="Min Days Left" value={restockMetrics.minDaysLeft.toString()} note="produk paling kritis" highlight />
                        <IntelBlock label="Restock Need" value={restockMetrics.restockNeed.toString() + ' unit'} note="total kuantitas butuh restock" />
                    </section>

                    {/* ─── CHARTS ─── */}
                    <section className="mb-14 grid grid-cols-1 gap-6 xl:grid-cols-5">
                        {/* Usage Trend — wider */}
                        <div className="col-span-3 rounded-2xl border border-gd-hairline bg-gd-surface-card p-8">
                            <div className="mb-6 flex items-baseline justify-between">
                                <h2 className="font-serif text-2xl font-semibold text-gd-ink">Usage Trend</h2>
                                <span className="font-sans text-xs font-medium uppercase tracking-widest text-gd-muted">30 hari</span>
                            </div>
                            <UsageTrendChart data={usageTrend} average={avgTrend} />
                        </div>

                        {/* Stock Health — narrower */}
                        <div className="col-span-2 rounded-2xl border border-gd-hairline bg-gd-surface-card p-8">
                            <div className="mb-6 flex items-baseline justify-between">
                                <h2 className="font-serif text-2xl font-semibold text-gd-ink">Stock Health</h2>
                                <span className="font-sans text-xs font-medium uppercase tracking-widest text-gd-muted">distribusi</span>
                            </div>
                            <StockHealthChart data={stockHealth} />
                        </div>
                    </section>

                    {/* ─── RESTOCK RECOMMENDATIONS (DECISION TABLE) ─── */}
                    {restockRecommendations.length > 0 && (
                        <section className="mb-14">
                            <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card">
                                {/* Table header row */}
                                <div className="flex items-baseline justify-between border-b border-gd-hairline px-8 py-6">
                                    <h2 className="font-serif text-2xl font-semibold text-gd-ink">Rekomendasi Restock</h2>
                                    <span className="font-sans text-xs font-medium uppercase tracking-widest text-gd-coral">
                                        {restockRecommendations.length} produk perlu aksi
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gd-hairline">
                                                <th className="px-8 py-4 text-left font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Produk</th>
                                                <th className="px-6 py-4 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Stok</th>
                                                <th className="px-6 py-4 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Velocity</th>
                                                <th className="px-6 py-4 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Sisa Hari</th>
                                                <th className="px-6 py-4 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Habis Estimasi</th>
                                                <th className="px-6 py-4 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Order Optimal</th>
                                                <th className="px-8 py-4 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Urgensi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {restockRecommendations.map((rec, i) => (
                                                <tr key={rec.id}
                                                    className={`border-b border-gd-hairline/60 transition-colors hover:bg-gd-surface-soft/60 ${i === restockRecommendations.length - 1 ? 'border-b-0' : ''}`}>
                                                    <td className="px-8 py-4">
                                                        <span className="font-sans text-sm font-semibold text-gd-ink">{rec.name}</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-sans text-sm font-bold text-gd-ink">{rec.stock}</td>
                                                    <td className="px-6 py-4 text-right font-sans text-sm text-gd-muted">{rec.velocity}/day</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`font-sans text-sm font-bold ${
                                                            rec.daysLeft <= 3 ? 'text-gd-coral' :
                                                            rec.daysLeft <= 7 ? 'text-gd-amber' : 'text-gd-ink'
                                                        }`}>{rec.daysLeft}d</span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-sans text-sm text-gd-muted">{rec.estimatedDepletion}</td>
                                                    <td className="px-6 py-4 text-right font-sans text-sm font-bold text-gd-teal">{rec.optimalOrder}</td>
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
                    )}
                    <section className="mb-14 grid grid-cols-1 gap-6 xl:grid-cols-2">
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card">
                            <div className="border-b border-gd-hairline px-8 py-6">
                                <h2 className="font-serif text-2xl font-semibold text-gd-ink">Critical Products</h2>
                                <p className="mt-0.5 font-sans text-xs text-gd-muted">Produk dengan sisa stok paling kritis</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gd-hairline">
                                            <th className="px-8 py-3 text-left font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Produk</th>
                                            <th className="px-5 py-3 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Stok</th>
                                            <th className="px-5 py-3 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Sisa</th>
                                            <th className="px-8 py-3 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Velocity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {criticalProducts.map((p, i) => (
                                            <tr key={p.id}
                                                className={`border-b border-gd-hairline/60 transition-colors hover:bg-gd-surface-soft/60 ${i === criticalProducts.length - 1 ? 'border-b-0' : ''}`}>
                                                <td className="px-8 py-3.5 font-sans text-sm font-semibold text-gd-ink">{p.name}</td>
                                                <td className="px-5 py-3.5 text-right font-sans text-sm font-bold text-gd-ink">{p.stock}</td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <span className={`font-sans text-sm font-bold ${
                                                        p.daysLeft <= 3 ? 'text-gd-coral' :
                                                        p.daysLeft <= 7 ? 'text-gd-amber' : 'text-gd-ink'
                                                    }`}>{p.daysLeft}d</span>
                                                </td>
                                                <td className="px-8 py-3.5 text-right font-sans text-sm text-gd-muted">{p.velocity}/day</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card">
                            <div className="border-b border-gd-hairline px-8 py-6">
                                <h2 className="font-serif text-2xl font-semibold text-gd-ink">Aktivitas Terbaru</h2>
                                <p className="mt-0.5 font-sans text-xs text-gd-muted">Semua transaksi oleh seluruh staff</p>
                            </div>
                            <div className="divide-y divide-gd-hairline/60">
                                {recentTransactions.map((tx) => {
                                    const dt = new Date(tx.timestamp);
                                    const time = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                    const date = dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                                    const isIn = tx.type === 'IN';
                                    return (
                                        <div key={tx.id} className="flex items-center gap-5 px-8 py-4 transition-colors hover:bg-gd-surface-soft/60">
                                            {isIn
                                                ? <ArrowDownRight className="h-4 w-4 flex-shrink-0 text-gd-teal" />
                                                : <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-gd-coral" />
                                            }
                                            <div className="flex-1 min-w-0">
                                                <p className="font-sans text-sm font-semibold text-gd-ink truncate">{tx.productName}</p>
                                                <p className="font-sans text-xs text-gd-muted">
                                                    {isIn ? '+' : '−'}{tx.quantity} unit · {tx.userName}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="font-sans text-xs font-medium text-gd-muted-soft">{date}</p>
                                                <p className="font-sans text-xs text-gd-muted-soft">{time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {recentTransactions.length === 0 && (
                                    <p className="px-8 py-8 font-sans text-sm text-gd-muted-soft">Belum ada transaksi</p>
                                )}
                            </div>
                        </div>
                    </section>
                    <section className="mb-8 rounded-2xl border border-gd-hairline bg-gd-surface-card">
                        <div className="border-b border-gd-hairline px-8 py-6">
                            <h2 className="font-serif text-2xl font-semibold text-gd-ink">Category Distribution</h2>
                            <p className="mt-0.5 font-sans text-xs text-gd-muted">Total stok per kategori produk</p>
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

function MetricBlock({ label, value, sub, subColor }: {
    label: string; value: string; sub: string; subColor: string;
}) {
    return (
        <div className="flex flex-col justify-between p-8">
            <span className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-gd-muted">{label}</span>
            <div>
                <p className="mt-4 font-sans text-5xl font-bold tracking-tight text-gd-ink">{value}</p>
                <p className={`mt-2 font-sans text-sm ${subColor}`}>{sub}</p>
            </div>
        </div>
    );
}

function IntelBlock({ label, value, note, highlight }: {
    label: string; value: string; note: string; highlight?: boolean;
}) {
    return (
        <div className={`flex flex-col justify-between px-10 py-8 ${highlight ? 'bg-gd-coral/10' : ''}`}>
            <span className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-gd-on-dark-soft">{label}</span>
            <div>
                <p className={`mt-4 font-sans text-4xl font-bold tracking-tight ${highlight ? 'text-gd-coral' : 'text-gd-on-dark'}`}>
                    {value}
                </p>
                <p className="mt-2 font-sans text-xs text-gd-on-dark-soft">{note}</p>
            </div>
        </div>
    );
}

function UrgencyPill({ urgency }: { urgency: 'critical' | 'warning' | 'moderate' }) {
    const map = {
        critical: 'text-gd-coral',
        warning: 'text-gd-amber',
        moderate: 'text-gd-teal',
    };
    const label = { critical: 'Critical', warning: 'Warning', moderate: 'Moderate' };
    return (
        <span className={`font-sans text-xs font-bold uppercase tracking-wider ${map[urgency]}`}>
            {label[urgency]}
        </span>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/dashboard' }],
};
