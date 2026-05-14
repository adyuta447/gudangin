import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { ArrowRightLeft, PackagePlus, PackageMinus, Check, ArrowUpRight, ArrowDownRight, Filter, X } from 'lucide-react';

interface ProductOption { id: number; name: string; stock: number; }
interface TxRecord { id: number; productId: number; productName: string; userName: string; quantity: number; type: 'IN' | 'OUT'; timestamp: string; note: string | null; }
interface Filters { type: string; date_from: string; date_to: string; product_id: string; }
interface Props { products: ProductOption[]; transactions: TxRecord[]; isAdmin: boolean; filters: Filters; }

export default function Transactions({ products, transactions, isAdmin, filters }: Props) {
    const [showFilters, setShowFilters] = useState(!!filters.type || !!filters.date_from || !!filters.date_to || !!filters.product_id);

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
        const newFilters = { ...filters, [key]: value };
        router.get('/transactions', newFilters as any, { preserveState: true, preserveScroll: true });
    };

    const clearFilters = () => {
        router.get('/transactions', {}, { preserveState: true, preserveScroll: true });
        setShowFilters(false);
    };

    const hasActiveFilters = !!filters.type || !!filters.date_from || !!filters.date_to || !!filters.product_id;

    return (
        <>
            <Head title="Transactions" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
                    <header className="mb-10">
                        <h1 className="font-serif text-4xl font-semibold tracking-tight text-gd-ink">Transactions</h1>
                        <p className="mt-2 font-sans text-base text-gd-muted">Catat transaksi stok masuk & keluar</p>
                    </header>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                        {/* Form */}
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                            <div className="mb-6 flex items-center gap-2">
                                <ArrowRightLeft className="h-4 w-4 text-gd-muted" />
                                <h3 className="font-serif text-lg font-semibold text-gd-ink">Transaksi Baru</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="mb-2 block font-sans text-sm text-gd-muted">Tipe Transaksi</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => setData('type', 'IN')}
                                            className={`flex items-center justify-center gap-2 rounded-2xl py-3 font-sans text-sm font-semibold transition-all ${data.type === 'IN' ? 'bg-gd-teal text-white' : 'border border-gd-hairline bg-transparent text-gd-muted hover:border-gd-teal'}`}>
                                            <PackagePlus className="h-4 w-4" /> Stok Masuk
                                        </button>
                                        <button type="button" onClick={() => setData('type', 'OUT')}
                                            className={`flex items-center justify-center gap-2 rounded-2xl py-3 font-sans text-sm font-semibold transition-all ${data.type === 'OUT' ? 'bg-gd-coral text-white' : 'border border-gd-hairline bg-transparent text-gd-muted hover:border-gd-coral'}`}>
                                            <PackageMinus className="h-4 w-4" /> Stok Keluar
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block font-sans text-sm text-gd-muted">Produk</label>
                                    <select value={data.product_id} onChange={(e) => setData('product_id', e.target.value)}
                                        className="w-full rounded-2xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink focus:border-gd-coral focus:outline-none">
                                        <option value="">Pilih produk...</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                                        ))}
                                    </select>
                                    {errors.product_id && <p className="mt-1 font-sans text-xs text-gd-coral">{errors.product_id}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block font-sans text-sm text-gd-muted">Quantity</label>
                                    <input type="number" min="1" value={data.quantity} onChange={(e) => setData('quantity', e.target.value)}
                                        placeholder="Masukkan jumlah..."
                                        className="w-full rounded-2xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink placeholder:text-gd-muted-soft focus:border-gd-coral focus:outline-none" />
                                    {errors.quantity && <p className="mt-1 font-sans text-xs text-gd-coral">{errors.quantity}</p>}
                                </div>

                                <div>
                                    <label className="mb-2 block font-sans text-sm text-gd-muted">Catatan (opsional)</label>
                                    <input type="text" value={data.note} onChange={(e) => setData('note', e.target.value)}
                                        placeholder="Tambahkan catatan..."
                                        className="w-full rounded-2xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink placeholder:text-gd-muted-soft focus:border-gd-coral focus:outline-none" />
                                </div>

                                <button type="submit" disabled={!data.product_id || !data.quantity || processing}
                                    className="w-full rounded-2xl bg-gd-coral py-3 font-sans text-sm font-semibold text-gd-canvas transition-all hover:bg-gd-coral-active disabled:cursor-not-allowed disabled:opacity-40">
                                    {recentlySuccessful ? (
                                        <span className="flex items-center justify-center gap-2"><Check className="h-4 w-4" /> Tersimpan!</span>
                                    ) : processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                                </button>
                            </form>

                            <div className="mt-6 rounded-xl bg-gd-surface-soft p-4">
                                <p className="mb-2 font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Flow</p>
                                <div className="flex items-center gap-2 font-sans text-xs text-gd-body">
                                    <span className="rounded-full bg-gd-coral/10 px-2 py-0.5 font-medium text-gd-coral">Submit</span>
                                    <span>→</span><span>Update stock</span><span>→</span><span>Simpan transaksi</span><span>→</span>
                                    <span className="rounded-full bg-gd-teal/10 px-2 py-0.5 font-medium text-gd-teal">Dashboard update</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                            <div className="mb-5 flex items-center justify-between">
                                <h3 className="font-serif text-lg font-semibold text-gd-ink">Riwayat Transaksi</h3>
                                <div className="flex items-center gap-2">
                                    {hasActiveFilters && (
                                        <button onClick={clearFilters}
                                            className="flex items-center gap-1 rounded-lg bg-gd-coral/10 px-2 py-1 font-sans text-xs font-medium text-gd-coral transition-colors hover:bg-gd-coral/20">
                                            <X className="h-3 w-3" /> Reset
                                        </button>
                                    )}
                                    <button onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-sans text-xs font-medium transition-colors ${showFilters ? 'bg-gd-coral/10 text-gd-coral' : 'text-gd-muted hover:bg-gd-surface-soft'}`}>
                                        <Filter className="h-3.5 w-3.5" /> Filter
                                    </button>
                                </div>
                            </div>

                            {/* Filter panel */}
                            {showFilters && (
                                <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl bg-gd-surface-soft p-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block font-sans text-xs text-gd-muted">Tipe</label>
                                        <select value={filters.type} onChange={(e) => applyFilter('type', e.target.value)}
                                            className="w-full rounded-lg border border-gd-hairline bg-gd-canvas px-3 py-1.5 font-sans text-xs text-gd-ink focus:border-gd-coral focus:outline-none">
                                            <option value="">Semua</option>
                                            <option value="IN">Masuk</option>
                                            <option value="OUT">Keluar</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block font-sans text-xs text-gd-muted">Produk</label>
                                        <select value={filters.product_id} onChange={(e) => applyFilter('product_id', e.target.value)}
                                            className="w-full rounded-lg border border-gd-hairline bg-gd-canvas px-3 py-1.5 font-sans text-xs text-gd-ink focus:border-gd-coral focus:outline-none">
                                            <option value="">Semua</option>
                                            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block font-sans text-xs text-gd-muted">Dari Tanggal</label>
                                        <input type="date" value={filters.date_from} onChange={(e) => applyFilter('date_from', e.target.value)}
                                            className="w-full rounded-lg border border-gd-hairline bg-gd-canvas px-3 py-1.5 font-sans text-xs text-gd-ink focus:border-gd-coral focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="mb-1 block font-sans text-xs text-gd-muted">Sampai Tanggal</label>
                                        <input type="date" value={filters.date_to} onChange={(e) => applyFilter('date_to', e.target.value)}
                                            className="w-full rounded-lg border border-gd-hairline bg-gd-canvas px-3 py-1.5 font-sans text-xs text-gd-ink focus:border-gd-coral focus:outline-none" />
                                    </div>
                                </div>
                            )}

                            <div className="max-h-[500px] space-y-0 overflow-y-auto">
                                {transactions.map((tx) => {
                                    const dt = new Date(tx.timestamp);
                                    const time = dt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
                                    const date = dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                                    const isIn = tx.type === 'IN';
                                    return (
                                        <div key={tx.id} className="flex items-center gap-4 border-b border-gd-hairline/50 py-3 last:border-b-0">
                                            <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${isIn ? 'bg-gd-teal/10 text-gd-teal' : 'bg-gd-coral/10 text-gd-coral'}`}>
                                                {isIn ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-sans text-sm font-medium text-gd-ink truncate">{tx.productName}</p>
                                                <p className="font-sans text-xs text-gd-muted">
                                                    {isIn ? '+' : '-'}{tx.quantity} unit
                                                    {isAdmin && <> · <span className="text-gd-muted-soft">{tx.userName}</span></>}
                                                    {tx.note && <> · <span className="italic">{tx.note}</span></>}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0 text-right">
                                                <p className="font-sans text-xs text-gd-muted-soft">{date}</p>
                                                <p className="font-sans text-xs text-gd-muted-soft">{time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {transactions.length === 0 && (
                                    <p className="py-8 text-center font-sans text-sm text-gd-muted-soft">Belum ada transaksi</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Transactions.layout = {
    breadcrumbs: [{ title: 'Transactions', href: '/transactions' }],
};
