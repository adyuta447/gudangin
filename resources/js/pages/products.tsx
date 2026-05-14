import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Package, Search, TrendingUp, Clock, ChevronRight, Plus, Pencil, Trash2, X } from 'lucide-react';
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

    return (
        <>
            <Head title="Products" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
                    <header className="mb-10 flex items-start justify-between">
                        <div>
                            <h1 className="font-serif text-4xl font-semibold tracking-tight text-gd-ink">Products</h1>
                            <p className="mt-2 font-sans text-base text-gd-muted">{products.length} produk terdaftar</p>
                        </div>
                        {isAdmin && (
                            <button onClick={() => { setEditProduct(null); setShowForm(true); }}
                                className="flex items-center gap-2 rounded-2xl bg-gd-coral px-5 py-2.5 font-sans text-sm font-semibold text-gd-canvas transition-all hover:bg-gd-coral-active">
                                <Plus className="h-4 w-4" /> Tambah Produk
                            </button>
                        )}
                    </header>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                        <div className="xl:col-span-2">
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gd-muted" />
                                    <input type="text" placeholder="Cari produk, SKU, atau kategori..."
                                        value={search} onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-2xl border border-gd-hairline bg-gd-surface-card py-2.5 pl-10 pr-4 font-sans text-sm text-gd-ink placeholder:text-gd-muted-soft focus:border-gd-coral focus:outline-none" />
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-gd-hairline bg-gd-surface-card">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gd-hairline">
                                                <th className="px-4 py-3 text-left font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Produk</th>
                                                <th className="px-4 py-3 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Stock</th>
                                                <th className="px-4 py-3 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Velocity</th>
                                                <th className="px-4 py-3 text-right font-sans text-xs font-medium uppercase tracking-wider text-gd-muted">Days Left</th>
                                                {isAdmin && <th className="w-20 px-4 py-3"></th>}
                                                <th className="w-8 px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filtered.map((p) => (
                                                <tr key={p.id} onClick={() => setSelected(p)}
                                                    className={`cursor-pointer border-b border-gd-hairline/50 transition-colors hover:bg-gd-surface-soft/50 ${selected?.id === p.id ? 'bg-gd-surface-soft' : ''}`}>
                                                    <td className="px-4 py-3">
                                                        <div className="font-sans text-sm font-medium text-gd-ink">{p.name}</div>
                                                        <div className="font-sans text-xs text-gd-muted-soft">{p.category} · {p.sku}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={`font-sans text-sm font-bold ${p.stock <= p.minStock ? 'text-gd-coral' : 'text-gd-ink'}`}>{p.stock}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-sans text-sm text-gd-body">{p.velocity}/day</td>
                                                    <td className="px-4 py-3 text-right">
                                                        <span className={`inline-flex rounded-full px-2.5 py-0.5 font-sans text-sm font-bold ${
                                                            p.daysLeft <= 3 ? 'bg-gd-coral/10 text-gd-coral' :
                                                            p.daysLeft <= 7 ? 'bg-gd-amber/10 text-gd-amber' : 'text-gd-ink'
                                                        }`}>{p.daysLeft >= 999 ? '∞' : p.daysLeft}</span>
                                                    </td>
                                                    {isAdmin && (
                                                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                                            <div className="flex items-center gap-1">
                                                                <button onClick={() => { setEditProduct(p); setShowForm(true); }}
                                                                    className="rounded-lg p-1.5 text-gd-muted hover:bg-gd-surface-soft hover:text-gd-ink transition-colors">
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                </button>
                                                                <button onClick={() => { if (confirm('Hapus produk ini?')) router.delete(`/products/${p.id}`); }}
                                                                    className="rounded-lg p-1.5 text-gd-muted hover:bg-gd-coral/10 hover:text-gd-coral transition-colors">
                                                                    <Trash2 className="h-3.5 w-3.5" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    )}
                                                    <td className="px-4 py-3"><ChevronRight className="h-4 w-4 text-gd-muted-soft" /></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-1">
                            {selected ? <ProductDetail product={selected} /> : (
                                <div className="flex h-64 items-center justify-center rounded-2xl border border-gd-hairline bg-gd-surface-card">
                                    <p className="font-sans text-sm text-gd-muted-soft">Pilih produk untuk lihat detail</p>
                                </div>
                            )}
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

function ProductDetail({ product }: { product: Product }) {
    const [trend, setTrend] = useState<DailyUsage[]>([]);
    useEffect(() => {
        fetch(`/products/${product.id}/usage-trend`)
            .then(res => res.json()).then(data => setTrend(data)).catch(() => setTrend([]));
    }, [product.id]);

    return (
        <div className="space-y-5">
            <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                <h2 className="font-serif text-xl font-semibold text-gd-ink">{product.name}</h2>
                <p className="mt-1 font-sans text-sm text-gd-muted">{product.category} · {product.sku}</p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <Package className="mx-auto mb-1 h-4 w-4 text-gd-muted" />
                        <p className={`font-sans text-2xl font-bold ${product.stock <= product.minStock ? 'text-gd-coral' : 'text-gd-ink'}`}>{product.stock}</p>
                        <p className="font-sans text-xs text-gd-muted">Stock (min {product.minStock})</p>
                    </div>
                    <div className="text-center">
                        <TrendingUp className="mx-auto mb-1 h-4 w-4 text-gd-muted" />
                        <p className="font-sans text-2xl font-bold text-gd-ink">{product.velocity}/day</p>
                        <p className="font-sans text-xs text-gd-muted">Avg Usage</p>
                    </div>
                    <div className="text-center">
                        <Clock className="mx-auto mb-1 h-4 w-4 text-gd-muted" />
                        <p className={`font-sans text-2xl font-bold ${product.daysLeft <= 3 ? 'text-gd-coral' : product.daysLeft <= 7 ? 'text-gd-amber' : 'text-gd-ink'}`}>
                            {product.daysLeft >= 999 ? '∞' : product.daysLeft}
                        </p>
                        <p className="font-sans text-xs text-gd-muted">Days Left</p>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6">
                <h3 className="mb-3 font-serif text-lg font-semibold text-gd-ink">Trend Usage</h3>
                {trend.length > 0 ? <MiniTrendChart data={trend} /> : (
                    <p className="py-8 text-center font-sans text-sm text-gd-muted-soft">Belum ada data trend</p>
                )}
            </div>
        </div>
    );
}

function ProductFormModal({ product, categories, onClose }: { product: Product | null; categories: Category[]; onClose: () => void; }) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gd-ink/40 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-gd-hairline bg-gd-surface-card p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-serif text-xl font-semibold text-gd-ink">{isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gd-muted hover:bg-gd-surface-soft hover:text-gd-ink transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block font-sans text-sm text-gd-muted">Nama Produk</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink focus:border-gd-coral focus:outline-none" />
                        {errors.name && <p className="mt-1 text-xs text-gd-coral">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1 block font-sans text-sm text-gd-muted">SKU</label>
                            <input type="text" value={data.sku} onChange={(e) => setData('sku', e.target.value)}
                                className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink focus:border-gd-coral focus:outline-none" />
                            {errors.sku && <p className="mt-1 text-xs text-gd-coral">{errors.sku}</p>}
                        </div>
                        <div>
                            <label className="mb-1 block font-sans text-sm text-gd-muted">Kategori</label>
                            <select value={data.category_id} onChange={(e) => setData('category_id', e.target.value)}
                                className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink focus:border-gd-coral focus:outline-none">
                                <option value="">Pilih...</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            {errors.category_id && <p className="mt-1 text-xs text-gd-coral">{errors.category_id}</p>}
                        </div>
                    </div>
                    {!isEdit && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block font-sans text-sm text-gd-muted">Stok Awal</label>
                                <input type="number" min="0" value={data.stock} onChange={(e) => setData('stock', e.target.value)}
                                    className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink focus:border-gd-coral focus:outline-none" />
                                {errors.stock && <p className="mt-1 text-xs text-gd-coral">{errors.stock}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block font-sans text-sm text-gd-muted">Min Stock</label>
                                <input type="number" min="0" value={data.min_stock} onChange={(e) => setData('min_stock', e.target.value)}
                                    className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink focus:border-gd-coral focus:outline-none" />
                                {errors.min_stock && <p className="mt-1 text-xs text-gd-coral">{errors.min_stock}</p>}
                            </div>
                        </div>
                    )}
                    {isEdit && (
                        <div>
                            <label className="mb-1 block font-sans text-sm text-gd-muted">Min Stock</label>
                            <input type="number" min="0" value={data.min_stock} onChange={(e) => setData('min_stock', e.target.value)}
                                className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink focus:border-gd-coral focus:outline-none" />
                            {errors.min_stock && <p className="mt-1 text-xs text-gd-coral">{errors.min_stock}</p>}
                        </div>
                    )}
                    <button type="submit" disabled={processing}
                        className="w-full rounded-xl bg-gd-coral py-3 font-sans text-sm font-semibold text-gd-canvas transition-all hover:bg-gd-coral-active disabled:opacity-40">
                        {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
                    </button>
                </form>
            </div>
        </div>
    );
}

Products.layout = {
    breadcrumbs: [{ title: 'Products', href: '/products' }],
};
