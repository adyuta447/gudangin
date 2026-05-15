import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Check, X } from 'lucide-react';

interface ProductOption { id: number; name: string; stock: number; }
interface TxRecord {
    id: number; productId: number; productName: string; userName: string;
    quantity: number; type: 'IN' | 'OUT'; timestamp: string; note: string | null;
}
interface Filters { type: string; date_from: string; date_to: string; product_id: string; }
interface Props { products: ProductOption[]; transactions: TxRecord[]; isAdmin: boolean; filters: Filters; }

export default function Transactions({ products, transactions, isAdmin, filters }: Props) {
    const [showFilters, setShowFilters] = useState(
        !!filters.type || !!filters.date_from || !!filters.date_to || !!filters.product_id
    );

    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        product_id: '',
        quantity: '',
        type: 'IN' as 'IN' | 'OUT',
        note: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/transactions', {
            preserveScroll: true,
            onSuccess: () => reset('product_id', 'quantity', 'note'),
        });
    };

    const applyFilter = (key: string, value: string) => {
        router.get('/transactions', { ...filters, [key]: value } as any, {
            preserveState: true, preserveScroll: true,
        });
    };

    const clearFilters = () => {
        router.get('/transactions', {}, { preserveState: true, preserveScroll: true });
        setShowFilters(false);
    };

    const hasActiveFilters = !!filters.type || !!filters.date_from || !!filters.date_to || !!filters.product_id;

    const totalIn = transactions.filter(t => t.type === 'IN').reduce((s, t) => s + t.quantity, 0);
    const totalOut = transactions.filter(t => t.type === 'OUT').reduce((s, t) => s + t.quantity, 0);

    const selectedProduct = products.find(p => p.id.toString() === data.product_id);

    return (
        <>
            <Head title="Transactions" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-[1440px] px-8 py-10 lg:px-14">
                    <header className="mb-12 flex items-end justify-between">
                        <div>
                            <p className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-gd-muted">
                                {isAdmin ? 'Admin' : 'Staff'} - Stock Movement
                            </p>
                            <h1 className="font-serif text-[3.25rem] font-semibold leading-none tracking-tight text-gd-ink">
                                Transactions
                                <span className="ml-3 font-sans text-xl font-normal text-gd-muted-soft">
                                    {transactions.length}
                                </span>
                            </h1>
                        </div>
                    </header>
                    <section className="mb-10 grid grid-cols-3 divide-x divide-gd-hairline rounded-2xl border border-gd-hairline bg-gd-surface-card">
                        <StatBlock label="Ditampilkan" value={transactions.length.toString()} note="transaksi" />
                        <StatBlock label="Total Masuk" value={totalIn.toLocaleString()} note="unit stok IN" accent="teal" />
                        <StatBlock label="Total Keluar" value={totalOut.toLocaleString()} note="unit stok OUT" accent="coral" />
                    </section>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                        {/* ─── LEFT: FORM ─── */}
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card">

                            {/* Form header */}
                            <div className="border-b border-gd-hairline px-8 py-6">
                                <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-gd-muted">Input</p>
                                <h2 className="mt-1 font-serif text-2xl font-semibold text-gd-ink">Transaksi Baru</h2>
                            </div>

                            <div className="p-8">
                                {/* Type toggle */}
                                <div className="mb-7">
                                    <p className="mb-3 font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Tipe Transaksi</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'IN')}
                                            className={[
                                                'rounded-2xl py-3.5 font-sans text-sm font-semibold transition-colors',
                                                data.type === 'IN'
                                                    ? 'bg-gd-surface-dark text-gd-on-dark'
                                                    : 'border border-gd-hairline text-gd-muted hover:border-gd-ink hover:text-gd-ink',
                                            ].join(' ')}
                                        >
                                            ↓ Stok Masuk
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'OUT')}
                                            className={[
                                                'rounded-2xl py-3.5 font-sans text-sm font-semibold transition-colors',
                                                data.type === 'OUT'
                                                    ? 'bg-gd-coral text-gd-canvas'
                                                    : 'border border-gd-hairline text-gd-muted hover:border-gd-coral hover:text-gd-coral',
                                            ].join(' ')}
                                        >
                                            ↑ Stok Keluar
                                        </button>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Product select */}
                                    <div>
                                        <label className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">
                                            Produk
                                        </label>
                                        <select
                                            value={data.product_id}
                                            onChange={(e) => setData('product_id', e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Pilih produk…</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} (Stok: {p.stock})
                                                </option>
                                            ))}
                                        </select>
                                        {errors.product_id && (
                                            <p className="mt-1 font-sans text-xs text-gd-coral">{errors.product_id}</p>
                                        )}
                                        {/* Stock preview */}
                                        {selectedProduct && (
                                            <div className="mt-2 flex items-center justify-between rounded-xl border border-gd-hairline px-4 py-2.5">
                                                <span className="font-sans text-xs text-gd-muted">Stok saat ini</span>
                                                <span className={`font-sans text-sm font-bold ${
                                                    selectedProduct.stock <= 10 ? 'text-gd-coral' : 'text-gd-ink'
                                                }`}>{selectedProduct.stock} unit</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">
                                            Quantity
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                            placeholder="0"
                                            className="input-field text-right font-sans text-2xl font-bold text-gd-ink placeholder:text-gd-muted-soft"
                                        />
                                        {errors.quantity && (
                                            <p className="mt-1 font-sans text-xs text-gd-coral">{errors.quantity}</p>
                                        )}
                                    </div>

                                    {/* Note */}
                                    <div>
                                        <label className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">
                                            Catatan <span className="normal-case tracking-normal text-gd-muted-soft">(opsional)</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.note}
                                            onChange={(e) => setData('note', e.target.value)}
                                            placeholder="Tambahkan catatan…"
                                            className="input-field"
                                        />
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={!data.product_id || !data.quantity || processing}
                                        className={[
                                            'w-full rounded-2xl py-4 font-sans text-sm font-semibold transition-colors',
                                            'disabled:cursor-not-allowed disabled:opacity-40',
                                            recentlySuccessful
                                                ? 'bg-gd-teal text-white'
                                                : data.type === 'OUT'
                                                    ? 'bg-gd-coral text-gd-canvas hover:bg-gd-coral-active'
                                                    : 'bg-gd-surface-dark text-gd-on-dark hover:bg-gd-surface-dark-elevated',
                                        ].join(' ')}
                                    >
                                        {recentlySuccessful ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <Check className="h-4 w-4" /> Tersimpan
                                            </span>
                                        ) : processing ? 'Menyimpan…' : (
                                            `Simpan ${data.type === 'IN' ? 'Stok Masuk' : 'Stok Keluar'}`
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Flow strip */}
                            <div className="border-t border-gd-hairline px-8 py-5">
                                <p className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.15em] text-gd-muted">Flow</p>
                                <div className="flex flex-wrap items-center gap-1.5 font-sans text-xs text-gd-muted">
                                    {['Submit', '→', 'Update stock', '→', 'Simpan log', '→', 'Analytics update'].map((s, i) => (
                                        s === '→'
                                            ? <span key={i} className="text-gd-hairline">→</span>
                                            : <span key={i} className={`rounded font-medium ${
                                                s === 'Submit' ? 'text-gd-coral' :
                                                s === 'Analytics update' ? 'text-gd-teal' : 'text-gd-muted'
                                            }`}>{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card">
                            <div className="flex items-center justify-between border-b border-gd-hairline px-8 py-6">
                                <div>
                                    <p className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-gd-muted">Log</p>
                                    <h2 className="mt-1 font-serif text-2xl font-semibold text-gd-ink">Riwayat</h2>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="flex items-center gap-1 font-sans text-xs text-gd-coral transition-colors hover:text-gd-coral-active"
                                        >
                                            <X className="h-3 w-3" /> Reset
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={[
                                            'rounded-2xl border px-4 py-1.5 font-sans text-xs font-medium transition-colors',
                                            showFilters
                                                ? 'border-gd-ink text-gd-ink'
                                                : 'border-gd-hairline text-gd-muted hover:border-gd-ink hover:text-gd-ink',
                                        ].join(' ')}
                                    >
                                        Filter {hasActiveFilters && '·'}
                                    </button>
                                </div>
                            </div>
                            {showFilters && (
                                <div className="grid grid-cols-2 gap-4 border-b border-gd-hairline px-8 py-5">
                                    <div>
                                        <label className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Tipe</label>
                                        <select
                                            value={filters.type}
                                            onChange={(e) => applyFilter('type', e.target.value)}
                                            className="input-field text-xs"
                                        >
                                            <option value="">Semua</option>
                                            <option value="IN">Masuk</option>
                                            <option value="OUT">Keluar</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Produk</label>
                                        <select
                                            value={filters.product_id}
                                            onChange={(e) => applyFilter('product_id', e.target.value)}
                                            className="input-field text-xs"
                                        >
                                            <option value="">Semua</option>
                                            {products.map((p) => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Dari</label>
                                        <input
                                            type="date"
                                            value={filters.date_from}
                                            onChange={(e) => applyFilter('date_from', e.target.value)}
                                            className="input-field text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Sampai</label>
                                        <input
                                            type="date"
                                            value={filters.date_to}
                                            onChange={(e) => applyFilter('date_to', e.target.value)}
                                            className="input-field text-xs"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Transaction list */}
                            <div className="max-h-[580px] overflow-y-auto divide-y divide-gd-hairline/60">
                                {transactions.map((tx) => {
                                    const dt = new Date(tx.timestamp);
                                    const time = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                    const date = dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                                    const isIn = tx.type === 'IN';
                                    return (
                                        <div key={tx.id} className="flex items-center gap-5 px-8 py-4 transition-colors hover:bg-gd-surface-soft/50">
                                            {/* Direction icon — no background */}
                                            {isIn
                                                ? <ArrowDownRight className="h-4 w-4 flex-shrink-0 text-gd-teal" />
                                                : <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-gd-coral" />
                                            }

                                            {/* Product + meta */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-sans text-sm font-semibold text-gd-ink truncate">
                                                    {tx.productName}
                                                </p>
                                                <p className="mt-0.5 font-sans text-xs text-gd-muted">
                                                    {isIn ? '+' : '−'}{tx.quantity} unit
                                                    {isAdmin && (
                                                        <> · <span className="text-gd-muted-soft">{tx.userName}</span></>
                                                    )}
                                                    {tx.note && (
                                                        <> · <span className="italic text-gd-muted-soft">{tx.note}</span></>
                                                    )}
                                                </p>
                                            </div>

                                            {/* Quantity badge */}
                                            <span className={`flex-shrink-0 font-sans text-sm font-bold tabular-nums ${isIn ? 'text-gd-teal' : 'text-gd-coral'}`}>
                                                {isIn ? '+' : '−'}{tx.quantity}
                                            </span>

                                            {/* Timestamp */}
                                            <div className="flex-shrink-0 text-right">
                                                <p className="font-sans text-xs text-gd-muted-soft">{date}</p>
                                                <p className="font-sans text-xs text-gd-muted-soft">{time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {transactions.length === 0 && (
                                    <div className="flex h-48 flex-col items-center justify-center">
                                        <p className="font-sans text-sm font-medium text-gd-muted-soft">Belum ada transaksi</p>
                                        {hasActiveFilters && (
                                            <button onClick={clearFilters}
                                                className="mt-2 font-sans text-xs text-gd-coral hover:text-gd-coral-active transition-colors">
                                                Reset filter
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function StatBlock({ label, value, note, accent }: {
    label: string; value: string; note: string; accent?: 'amber' | 'coral' | 'teal';
}) {
    const valueColor = accent === 'coral' ? 'text-gd-coral' : accent === 'amber' ? 'text-gd-amber' : accent === 'teal' ? 'text-gd-teal' : 'text-gd-ink';
    return (
        <div className="flex flex-col justify-between p-7">
            <span className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-gd-muted">{label}</span>
            <div>
                <p className={`mt-3 font-sans text-4xl font-bold tracking-tight ${valueColor}`}>{value}</p>
                <p className="mt-1 font-sans text-xs text-gd-muted-soft">{note}</p>
            </div>
        </div>
    );
}

Transactions.layout = {
    breadcrumbs: [{ title: 'Transactions', href: '/transactions' }],
};
