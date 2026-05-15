import { Head, router } from '@inertiajs/react';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Field } from '@/components/atoms/Field';
import { StatBlock } from '@/components/molecules/StatBlock';
import { ProductDetail } from '@/components/organisms/ProductDetail';
import { ProductFormModal } from '@/components/organisms/ProductFormModal';

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
interface Category {
    id: number;
    name: string;
}
interface Props {
    products: Product[];
    categories: Category[];
    isAdmin: boolean;
}

export default function Products({ products, categories, isAdmin }: Props) {
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);

    const filtered = products.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.category.toLowerCase().includes(search.toLowerCase()) ||
            p.sku.toLowerCase().includes(search.toLowerCase()),
    );

    const lowCount = products.filter(
        (p) => p.stock <= p.minStock && p.velocity > 0,
    ).length;
    const deadCount = products.filter((p) => p.velocity <= 0).length;

    return (
        <>
            <Head title="Products" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-360 px-8 py-10 lg:px-14">
                    <header className="mb-12 flex items-end justify-between">
                        <div>
                            <p className="mb-2 font-sans text-xs font-medium tracking-[0.2em] text-gd-muted uppercase">
                                Admin - Product Management
                            </p>
                            <h1 className="font-serif text-[3.25rem] leading-none font-semibold tracking-tight text-gd-ink">
                                Products
                                <span className="ml-3 font-sans text-xl font-normal text-gd-muted-soft">
                                    {products.length}
                                </span>
                            </h1>
                        </div>
                        {isAdmin && (
                            <button
                                onClick={() => {
                                    setEditProduct(null);
                                    setShowForm(true);
                                }}
                                className="rounded-2xl bg-gd-coral px-6 py-3 font-sans text-sm font-semibold text-gd-canvas transition-colors hover:bg-gd-coral-active"
                            >
                                + Tambah Produk
                            </button>
                        )}
                    </header>
                    <section className="mb-10 grid grid-cols-3 divide-x divide-gd-hairline rounded-2xl border border-gd-hairline bg-gd-surface-card">
                        <StatBlock
                            label="Total Produk"
                            value={products.length.toString()}
                            note="terdaftar"
                        />
                        <StatBlock
                            label="Low Stock"
                            value={lowCount.toString()}
                            note="di bawah minimum"
                            accent={lowCount > 0 ? 'amber' : undefined}
                        />
                        <StatBlock
                            label="Dead Stock"
                            value={deadCount.toString()}
                            note="tidak bergerak"
                            accent={deadCount > 0 ? 'coral' : undefined}
                        />
                    </section>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                        <div className="xl:col-span-3">
                            {/* Search */}
                            <div className="mb-4 flex items-center gap-3">
                                <div className="relative flex-1">
                                    <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gd-muted-soft" />
                                    <input
                                        type="text"
                                        placeholder="Cari produk, SKU, atau kategori…"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="w-full rounded-2xl border border-gd-hairline bg-gd-surface-card py-3 pr-4 pl-11 font-sans text-sm text-gd-ink placeholder:text-gd-muted-soft focus:border-gd-coral focus:outline-none"
                                    />
                                </div>
                                {search && (
                                    <button
                                        onClick={() => setSearch('')}
                                        className="font-sans text-xs text-gd-muted transition-colors hover:text-gd-coral"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="overflow-hidden rounded-2xl border border-gd-hairline bg-gd-surface-card">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gd-hairline">
                                            <th className="px-6 py-4 text-left font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                                Produk
                                            </th>
                                            <th className="px-5 py-4 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                                Stok
                                            </th>
                                            <th className="px-5 py-4 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                                Velocity
                                            </th>
                                            <th className="px-5 py-4 text-right font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                                                Sisa Hari
                                            </th>
                                            {isAdmin && (
                                                <th className="w-16 px-4 py-4" />
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((p, i) => {
                                            const isLow = p.stock <= p.minStock;
                                            const isSelected =
                                                selected?.id === p.id;
                                            const isLast =
                                                i === filtered.length - 1;

                                            return (
                                                <tr
                                                    key={p.id}
                                                    onClick={() =>
                                                        setSelected(p)
                                                    }
                                                    className={[
                                                        'cursor-pointer transition-colors',
                                                        !isLast
                                                            ? 'border-b border-gd-hairline/60'
                                                            : '',
                                                        isSelected
                                                            ? 'bg-gd-surface-soft'
                                                            : 'hover:bg-gd-surface-soft/60',
                                                    ].join(' ')}
                                                >
                                                    <td className="px-6 py-4">
                                                        <p className="font-sans text-sm font-semibold text-gd-ink">
                                                            {p.name}
                                                        </p>
                                                        <p className="mt-0.5 font-sans text-xs text-gd-muted-soft">
                                                            {p.category} ·{' '}
                                                            {p.sku}
                                                        </p>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span
                                                            className={`font-sans text-sm font-bold ${isLow ? 'text-gd-coral' : 'text-gd-ink'}`}
                                                        >
                                                            {p.stock}
                                                        </span>
                                                        {isLow && (
                                                            <span className="ml-1 font-sans text-xs text-gd-coral">
                                                                ↓
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-5 py-4 text-right font-sans text-sm text-gd-muted">
                                                        {p.velocity}/day
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <span
                                                            className={`font-sans text-sm font-bold ${
                                                                p.daysLeft <= 3
                                                                    ? 'text-gd-coral'
                                                                    : p.daysLeft <=
                                                                        7
                                                                      ? 'text-gd-amber'
                                                                      : 'text-gd-ink'
                                                            }`}
                                                        >
                                                            {p.daysLeft >= 999
                                                                ? '∞'
                                                                : `${p.daysLeft}d`}
                                                        </span>
                                                    </td>
                                                    {isAdmin && (
                                                        <td
                                                            className="px-4 py-4"
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <div className="flex items-center justify-end gap-1">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditProduct(
                                                                            p,
                                                                        );
                                                                        setShowForm(
                                                                            true,
                                                                        );
                                                                    }}
                                                                    className="p-1.5 text-gd-muted-soft transition-colors hover:text-gd-ink"
                                                                >
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        if (
                                                                            confirm(
                                                                                'Hapus produk ini?',
                                                                            )
                                                                        ) {
                                                                            router.delete(
                                                                                `/products/${p.id}`,
                                                                            );
                                                                        }
                                                                    }}
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
                                                <td
                                                    colSpan={isAdmin ? 5 : 4}
                                                    className="px-6 py-12 text-center font-sans text-sm text-gd-muted-soft"
                                                >
                                                    Tidak ada produk ditemukan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            {search && (
                                <p className="mt-3 px-1 font-sans text-xs text-gd-muted-soft">
                                    {filtered.length} dari {products.length}{' '}
                                    produk
                                </p>
                            )}
                        </div>

                        <div className="xl:col-span-2">
                            {selected ? (
                                <ProductDetail product={selected} />
                            ) : (
                                <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gd-hairline">
                                    <p className="font-sans text-sm font-medium text-gd-muted-soft">
                                        Pilih produk
                                    </p>
                                    <p className="mt-1 font-sans text-xs text-gd-muted-soft">
                                        untuk melihat detail & trend
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showForm && (
                <ProductFormModal
                    product={editProduct}
                    categories={categories}
                    onClose={() => {
                        setShowForm(false);
                        setEditProduct(null);
                    }}
                />
            )}
        </>
    );
}

Products.layout = {
    breadcrumbs: [{ title: 'Products', href: '/products' }],
};
