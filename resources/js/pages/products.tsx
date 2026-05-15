import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';
import { MiniTrendChart } from '@/components/charts/mini-trend-chart';

interface Product {
    id: number; name: string; sku: string; categoryId: number; category: string;
    stock: number; velocity: number; daysLeft: number; minStock: number;
}
interface Category { id: number; name: string; }
interface DailyUsage { date: string; quantity: number; }
interface Props { products: Product[]; categories: Category[]; isAdmin: boolean; }

export default function Products({ products, categories, isAdmin }: Props) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()),
    );

    const lowCount = products.filter(p => p.stock <= p.minStock && p.velocity > 0).length;
    const deadCount = products.filter(p => p.velocity <= 0).length;

    return (
        <>
            <Head title="Products" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-[1440px] px-8 py-10 lg:px-14">

                    {/* ─── MASTHEAD ─── */}
                    <header className="mb-12 flex items-end justify-between">
                        <div>
                            <p className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.2em] text-gd-muted">
                                Admin - Product Management
                            </p>
                            <h1 className="font-serif text-[3.25rem] font-semibold leading-none tracking-tight text-gd-ink">
                                Products
                                <span className="ml-3 font-sans text-xl font-normal text-gd-muted-soft">
                                    {products.length}
                                </span>
                            </h1>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={() => { setEditProduct(null); setShowForm(true); }}
                                className="rounded-2xl bg-gd-coral px-6 py-3 font-sans text-sm font-semibold text-gd-canvas transition-colors hover:bg-gd-coral-active"
                            >
                                + Tambah Produk
                            </button>
                        )}
                    </header>

                    {/* ─── STAT STRIP ─── */}
                    <section className="mb-10 grid grid-cols-3 divide-x divide-gd-hairline rounded-2xl border border-gd-hairline bg-gd-surface-card">
                        <StatBlock label="Total Produk" value={products.length.toString()} note="terdaftar" />
                        <StatBlock label="Low Stock" value={lowCount.toString()} note="di bawah minimum" accent={lowCount > 0 ? 'amber' : undefined} />
                        <StatBlock label="Dead Stock" value={deadCount.toString()} note="tidak bergerak" accent={deadCount > 0 ? 'coral' : undefined} />
                    </section>

                    {/* ─── MAIN LAYOUT: TABLE + DETAIL ─── */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">

                        {/* ─── TABLE ─── */}
                        <div className="xl:col-span-3">
                            {/* Search */}
                            <div className="mb-4 flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gd-muted-soft" />
                                    <input
                                        type="text"
                                        placeholder="Cari produk, SKU, atau kategori…"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-2xl border border-gd-hairline bg-gd-surface-card py-3 pl-11 pr-4 font-sans text-sm text-gd-ink placeholder:text-gd-muted-soft focus:border-gd-coral focus:outline-none"
                                    />
                                </div>
                                {search && (
                                    <button onClick={() => setSearch('')}
                                        className="font-sans text-xs text-gd-muted hover:text-gd-coral transition-colors">
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Table */}
                            <div className="overflow-hidden rounded-2xl border border-gd-hairline bg-gd-surface-card">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gd-hairline">
                                            <th className="px-6 py-4 text-left font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Produk</th>
                                            <th className="px-5 py-4 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Stok</th>
                                            <th className="px-5 py-4 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Velocity</th>
                                            <th className="px-5 py-4 text-right font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Sisa Hari</th>
                                            {isAdmin && <th className="w-16 px-4 py-4" />}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((p, i) => {
                                            const isLow = p.stock <= p.minStock;
                                            const isSelected = selected?.id === p.id;
                                            const isLast = i === filtered.length - 1;
                                            return (
                                                <tr
                                                    key={p.id}
                                                    onClick={() => setSelected(p)}
                                                    className={[
                                                        'cursor-pointer transition-colors',
                                                        !isLast ? 'border-b border-gd-hairline/60' : '',
                                                        isSelected
                                                            ? 'bg-gd-surface-soft'
                                                            : 'hover:bg-gd-surface-soft/60',
                                                    ].join(' ')}
                                                >
                                                    <td className="px-6 py-4">
                                                        <p className="font-sans text-sm font-semibold text-gd-ink">{p.name}</p>
                                                        <p className="mt-0.5 font-sans text-xs text-gd-muted-soft">{p.category} · {p.sku}</p>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className={`font-sans text-sm font-bold ${isLow ? 'text-gd-coral' : 'text-gd-ink'}`}>
                                                            {p.stock}
                                                        </span>
                                                        {isLow && (
                                                            <span className="ml-1 font-sans text-xs text-gd-coral">↓</span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-right font-sans text-sm text-gd-muted">
                                                        {p.velocity}/day
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span className={`font-sans text-sm font-bold ${
                                                            p.daysLeft <= 3 ? 'text-gd-coral' :
                                                            p.daysLeft <= 7 ? 'text-gd-amber' : 'text-gd-ink'
                                                        }`}>
                                                            {p.daysLeft >= 999 ? '∞' : `${p.daysLeft}d`}
                                                        </span>
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                                            <div className="flex items-center justify-end gap-1">
                                                                <button
                                                                    onClick={() => { setEditProduct(p); setShowForm(true); }}
                                                                    className="p-1.5 text-gd-muted-soft transition-colors hover:text-gd-ink"
                                                                >
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => { if (confirm('Hapus produk ini?')) router.delete(`/products/${p.id}`); }}
                                                                    className="p-1.5 text-gd-muted-soft transition-colors hover:text-gd-coral"
                                                                >
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                        {filtered.length === 0 && (
                                            <tr>
                                                <td colSpan={isAdmin ? 5 : 4} className="px-6 py-12 text-center font-sans text-sm text-gd-muted-soft">
                                                    Tidak ada produk ditemukan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Result count */}
                            {search && (
                                <p className="mt-3 px-1 font-sans text-xs text-gd-muted-soft">
                                    {filtered.length} dari {products.length} produk
                                </p>
                            )}
                        </div>

                        {/* ─── DETAIL PANEL ─── */}
                        <div className="xl:col-span-2">
                            {selected
                                ? <ProductDetail product={selected} />
                                : (
                                    <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gd-hairline">
                                        <p className="font-sans text-sm font-medium text-gd-muted-soft">Pilih produk</p>
                                        <p className="mt-1 font-sans text-xs text-gd-muted-soft">untuk melihat detail & trend</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── PRODUCT FORM MODAL ─── */}
            {showForm && (
                <ProductFormModal
                    product={editProduct}
                    categories={categories}
                    onClose={() => { setShowForm(false); setEditProduct(null); }}
                />
            )}
        </>
    );
}

/* ─── Stat strip block ─── */
function StatBlock({ label, value, note, accent }: {
    label: string; value: string; note: string; accent?: 'amber' | 'coral';
}) {
    const valueColor = accent === 'coral' ? 'text-gd-coral' : accent === 'amber' ? 'text-gd-amber' : 'text-gd-ink';
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

/* ─── Product detail panel ─── */
function ProductDetail({ product }: { product: Product }) {
    const [trend, setTrend] = useState<DailyUsage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`/products/${product.id}/usage-trend`)
            .then(res => res.json())
            .then(data => { setTrend(data); setLoading(false); })
            .catch(() => { setTrend([]); setLoading(false); });
    }, [product.id]);

    const isLow = product.stock <= product.minStock;
    const stockPct = Math.min(100, Math.round((product.stock / Math.max(product.minStock * 2, 1)) * 100));

    return (
        <div className="space-y-4">
            {/* Identity card */}
            <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-7">
                <p className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-gd-muted">{product.category}</p>
                <h2 className="mt-2 font-serif text-2xl font-semibold text-gd-ink">{product.name}</h2>
                <p className="mt-0.5 font-sans text-xs text-gd-muted-soft">{product.sku}</p>

                {/* Stock bar */}
                <div className="mt-6">
                    <div className="mb-2 flex items-baseline justify-between">
                        <span className="font-sans text-xs text-gd-muted">Stok</span>
                        <span className={`font-sans text-xs font-semibold ${isLow ? 'text-gd-coral' : 'text-gd-muted'}`}>
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
                    <p className={`mt-1.5 font-sans text-3xl font-bold tracking-tight ${isLow ? 'text-gd-coral' : 'text-gd-ink'}`}>
                        {product.stock}
                        <span className="ml-1.5 font-sans text-sm font-normal text-gd-muted-soft">unit</span>
                    </p>
                </div>

                {/* KPI row */}
                <div className="mt-6 grid grid-cols-2 divide-x divide-gd-hairline border-t border-gd-hairline pt-5">
                    <div className="pr-5">
                        <p className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Velocity</p>
                        <p className="mt-1.5 font-sans text-2xl font-bold text-gd-ink">{product.velocity}
                            <span className="ml-1 font-sans text-xs font-normal text-gd-muted-soft">/day</span>
                        </p>
                    </div>
                    <div className="pl-5">
                        <p className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">Sisa Hari</p>
                        <p className={`mt-1.5 font-sans text-2xl font-bold ${
                            product.daysLeft <= 3 ? 'text-gd-coral' :
                            product.daysLeft <= 7 ? 'text-gd-amber' : 'text-gd-ink'
                        }`}>
                            {product.daysLeft >= 999 ? '∞' : product.daysLeft}
                            <span className="ml-1 font-sans text-xs font-normal text-gd-muted-soft">hari</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Trend card */}
            <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-7">
                <div className="mb-5 flex items-baseline justify-between">
                    <h3 className="font-serif text-lg font-semibold text-gd-ink">Trend Usage</h3>
                    <span className="font-sans text-xs font-medium uppercase tracking-widest text-gd-muted">7 hari</span>
                </div>
                {loading ? (
                    <div className="flex h-24 items-center justify-center">
                        <p className="font-sans text-xs text-gd-muted-soft">Memuat…</p>
                    </div>
                ) : trend.length > 0 ? (
                    <MiniTrendChart data={trend} />
                ) : (
                    <div className="flex h-24 items-center justify-center border-t border-gd-hairline">
                        <p className="font-sans text-xs text-gd-muted-soft">Belum ada data transaksi</p>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Product form modal ─── */
function ProductFormModal({ product, categories, onClose }: {
    product: Product | null; categories: Category[]; onClose: () => void;
}) {
    const isEdit = !!product;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: product?.name ?? '',
        sku: product?.sku ?? '',
        category_id: product?.categoryId?.toString() ?? '',
        stock: product?.stock?.toString() ?? '0',
        min_stock: product?.minStock?.toString() ?? '10',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/products/${product.id}`, { onSuccess: onClose });
        } else {
            post('/products', { onSuccess: () => { reset(); onClose(); } });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gd-ink/50 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-gd-hairline bg-gd-surface-card p-8">
                {/* Modal header */}
                <div className="mb-7 flex items-start justify-between">
                    <div>
                        <p className="font-sans text-xs font-medium uppercase tracking-[0.15em] text-gd-muted">
                            {isEdit ? 'Edit' : 'Tambah Baru'}
                        </p>
                        <h2 className="mt-1 font-serif text-2xl font-semibold text-gd-ink">
                            {isEdit ? product.name : 'Produk Baru'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-1 text-gd-muted-soft transition-colors hover:text-gd-ink">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Field label="Nama Produk" error={errors.name}>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama produk…"
                            className="input-field" />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="SKU" error={errors.sku}>
                            <input type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)}
                                placeholder="SKU-001"
                                className="input-field" />
                        </Field>
                        <Field label="Kategori" error={errors.category_id}>
                            <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}
                                className="input-field">
                                <option value="">Pilih…</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </Field>
                    </div>

                    {!isEdit && (
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Stok Awal" error={errors.stock}>
                                <input type="number" min="0" value={data.stock} onChange={(e) => setData('stock', e.target.value)}
                                    className="input-field" />
                            </Field>
                            <Field label="Min Stock" error={errors.min_stock}>
                                <input type="number" min="0" value={data.min_stock} onChange={(e) => setData('min_stock', e.target.value)}
                                    className="input-field" />
                            </Field>
                        </div>
                    )}

                    {isEdit && (
                        <Field label="Min Stock" error={errors.min_stock}>
                            <input type="number" min="0" value={data.min_stock} onChange={(e) => setData('min_stock', e.target.value)}
                                className="input-field" />
                        </Field>
                    )}

                    <div className="flex items-center gap-3 border-t border-gd-hairline pt-5">
                        <button type="button" onClick={onClose}
                            className="flex-1 rounded-2xl border border-gd-hairline py-3 font-sans text-sm font-semibold text-gd-muted transition-colors hover:border-gd-ink hover:text-gd-ink">
                            Batal
                        </button>
                        <button type="submit" disabled={processing}
                            className="flex-1 rounded-2xl bg-gd-coral py-3 font-sans text-sm font-semibold text-gd-canvas transition-colors hover:bg-gd-coral-active disabled:opacity-40">
                            {processing ? 'Menyimpan…' : isEdit ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="mb-1.5 block font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">{label}</label>
            {children}
            {error && <p className="mt-1 font-sans text-xs text-gd-coral">{error}</p>}
        </div>
    );
}

Products.layout = {
    breadcrumbs: [{ title: 'Products', href: '/products' }],
};
