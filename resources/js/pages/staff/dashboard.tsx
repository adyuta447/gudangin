import { Head, Link } from '@inertiajs/react';
import {
    ShoppingCart,
    PackagePlus,
    PackageMinus,
    ArrowRightLeft,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface TrendData {
    date: string;
    stok_masuk: number;
    stok_keluar: number;
}
interface RecentTx {
    id: number;
    productName: string;
    quantity: number;
    type: 'IN' | 'OUT';
    timestamp: string;
}
interface LowStockAlert {
    id: number;
    name: string;
    category: string;
    stock: number;
    minStock: number;
    daysLeft: number;
}

interface Props {
    dailyMetrics: {
        transaksiHariIni: number;
        barangMasuk: number;
        barangKeluar: number;
    };
    miniTrend: TrendData[];
    myTransactions: RecentTx[];
    lowStockAlerts: LowStockAlert[];
}

export default function StaffDashboard({
    dailyMetrics,
    miniTrend,
    myTransactions,
    lowStockAlerts,
}: Props) {
    return (
        <>
            <Head title="Staff Dashboard" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
                    <header className="mb-10">
                        <h1 className="font-serif text-4xl font-semibold tracking-tight text-gd-ink">
                            Operational Dashboard
                        </h1>
                        <p className="mt-2 font-sans text-base text-gd-muted">
                            Ringkasan operasional harian kamu
                        </p>
                    </header>

                    <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                        <DailyCard
                            label="Transaksi Hari Ini"
                            value={dailyMetrics.transaksiHariIni}
                            icon={ShoppingCart}
                        />
                        <DailyCard
                            label="Barang Masuk"
                            value={dailyMetrics.barangMasuk}
                            icon={PackagePlus}
                            accent="teal"
                        />
                        <DailyCard
                            label="Barang Keluar"
                            value={dailyMetrics.barangKeluar}
                            icon={PackageMinus}
                            accent="coral"
                        />
                    </section>

                    <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <Link
                            href="/transactions"
                            className="group flex items-center justify-center gap-3 rounded-2xl bg-gd-coral px-8 py-5 font-sans text-lg font-semibold text-gd-canvas transition-all duration-200 hover:bg-gd-coral-active"
                        >
                            <PackagePlus className="h-5 w-5 transition-transform group-hover:scale-110" />
                            Tambah Stok Masuk
                        </Link>
                        <Link
                            href="/transactions"
                            className="group flex items-center justify-center gap-3 rounded-2xl border-2 border-gd-coral bg-transparent px-8 py-5 font-sans text-lg font-semibold text-gd-coral transition-all duration-200 hover:bg-gd-coral hover:text-gd-canvas"
                        >
                            <PackageMinus className="h-5 w-5 transition-transform group-hover:scale-110" />
                            Tambah Stok Keluar
                        </Link>
                    </section>

                    {lowStockAlerts.length > 0 && (
                        <section className="mb-8">
                            <div className="rounded-2xl border border-gd-amber/40 bg-gd-amber/5 p-6">
                                <div className="mb-4 flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-gd-amber" />
                                    <h3 className="font-serif text-lg font-semibold text-gd-ink">
                                        ⚠ Stok Hampir Habis
                                    </h3>
                                    <span className="ml-auto rounded-full bg-gd-amber/15 px-3 py-1 font-sans text-xs font-bold text-gd-amber">
                                        {lowStockAlerts.length} produk
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {lowStockAlerts.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className="rounded-xl border border-gd-hairline bg-gd-surface-card p-4"
                                        >
                                            <p className="font-sans text-sm font-medium text-gd-ink">
                                                {alert.name}
                                            </p>
                                            <p className="font-sans text-xs text-gd-muted">
                                                {alert.category}
                                            </p>
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="font-sans text-lg font-bold text-gd-coral">
                                                    {alert.stock}{' '}
                                                    <span className="text-xs font-normal text-gd-muted">
                                                        / min {alert.minStock}
                                                    </span>
                                                </span>
                                                <span
                                                    className={`rounded-full px-2 py-0.5 font-sans text-xs font-bold ${
                                                        alert.daysLeft <= 3
                                                            ? 'bg-gd-coral/10 text-gd-coral'
                                                            : alert.daysLeft <=
                                                                7
                                                              ? 'bg-gd-amber/10 text-gd-amber'
                                                              : 'text-gd-ink'
                                                    }`}
                                                >
                                                    {alert.daysLeft}d left
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ─── TREND + ACTIVITY ─── */}
                    <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                        {/* 7-Day IN/OUT Trend */}
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <ArrowRightLeft className="h-4 w-4 text-gd-muted" />
                                <h3 className="font-serif text-lg font-semibold text-gd-ink">
                                    Trend 7 Hari
                                </h3>
                            </div>
                            <div style={{ width: '100%', height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={miniTrend}
                                        margin={{
                                            top: 5,
                                            right: 10,
                                            left: -10,
                                            bottom: 0,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e6dfd8"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            tick={{
                                                fontSize: 11,
                                                fill: '#8a857e',
                                            }}
                                            tickFormatter={(v) =>
                                                new Date(
                                                    v + 'T00:00:00',
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                })
                                            }
                                        />
                                        <YAxis
                                            tick={{
                                                fontSize: 11,
                                                fill: '#8a857e',
                                            }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background: '#efe9de',
                                                border: '1px solid #e6dfd8',
                                                borderRadius: 12,
                                                fontSize: 12,
                                            }}
                                            labelFormatter={(v) =>
                                                new Date(
                                                    v + 'T00:00:00',
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                })
                                            }
                                        />
                                        <Legend
                                            wrapperStyle={{ fontSize: 12 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="stok_masuk"
                                            name="Masuk"
                                            stackId="1"
                                            stroke="#5db8a6"
                                            fill="#5db8a6"
                                            fillOpacity={0.3}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="stok_keluar"
                                            name="Keluar"
                                            stackId="2"
                                            stroke="#cc785c"
                                            fill="#cc785c"
                                            fillOpacity={0.3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Activity Log */}
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                            <div className="mb-5 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gd-muted" />
                                <h3 className="font-serif text-lg font-semibold text-gd-ink">
                                    Riwayat Aktivitas Kamu
                                </h3>
                            </div>
                            <div className="max-h-[300px] space-y-0 overflow-y-auto">
                                {myTransactions.map((tx) => {
                                    const dt = new Date(tx.timestamp);
                                    const time = dt.toLocaleTimeString(
                                        'id-ID',
                                        { hour: '2-digit', minute: '2-digit' },
                                    );
                                    const date = dt.toLocaleDateString(
                                        'id-ID',
                                        { day: 'numeric', month: 'short' },
                                    );
                                    const isIn = tx.type === 'IN';
                                    return (
                                        <div
                                            key={tx.id}
                                            className="flex items-center gap-4 border-b border-gd-hairline/50 py-3 last:border-b-0"
                                        >
                                            <div
                                                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isIn ? 'bg-gd-teal/10 text-gd-teal' : 'bg-gd-coral/10 text-gd-coral'}`}
                                            >
                                                {isIn ? (
                                                    <ArrowDownRight className="h-4 w-4" />
                                                ) : (
                                                    <ArrowUpRight className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-sans text-sm text-gd-ink">
                                                    <span className="font-medium">
                                                        {tx.productName}
                                                    </span>{' '}
                                                    <span className="text-gd-muted">
                                                        {isIn
                                                            ? 'masuk'
                                                            : 'keluar'}
                                                    </span>{' '}
                                                    <span className="font-bold">
                                                        {tx.quantity}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="font-sans text-xs text-gd-muted-soft">
                                                    {date}
                                                </p>
                                                <p className="font-sans text-xs text-gd-muted-soft">
                                                    {time}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {myTransactions.length === 0 && (
                                    <p className="py-6 text-center font-sans text-sm text-gd-muted-soft">
                                        Belum ada riwayat transaksi
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}

function DailyCard({
    label,
    value,
    icon: Icon,
    accent,
}: {
    label: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    accent?: 'teal' | 'coral';
}) {
    const c =
        accent === 'teal'
            ? 'text-gd-teal'
            : accent === 'coral'
              ? 'text-gd-coral'
              : 'text-gd-ink';
    return (
        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-5 transition-all duration-200 hover:border-gd-coral/30">
            <div className="mb-3 flex items-center justify-between">
                <span className="font-sans text-sm text-gd-muted">{label}</span>
                <Icon className="h-4 w-4 text-gd-muted-soft" />
            </div>
            <span
                className={`font-sans text-3xl font-bold tracking-tight ${c}`}
            >
                {value}
            </span>
        </div>
    );
}

StaffDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/staff/dashboard' }],
};
