import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { Field } from '@/components/atoms/Field';

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

interface ProductFormModalProps {
    product: Product | null;
    categories: Category[];
    onClose: () => void;
}

export function ProductFormModal({
    product,
    categories,
    onClose,
}: ProductFormModalProps) {
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
            post('/products', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gd-ink/50 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-gd-hairline bg-gd-surface-card p-8">
                {/* Modal header */}
                <div className="mb-7 flex items-start justify-between">
                    <div>
                        <p className="font-sans text-xs font-medium tracking-[0.15em] text-gd-muted uppercase">
                            {isEdit ? 'Edit' : 'Tambah Baru'}
                        </p>
                        <h2 className="mt-1 font-serif text-2xl font-semibold text-gd-ink">
                            {isEdit ? product.name : 'Produk Baru'}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-gd-muted-soft transition-colors hover:text-gd-ink"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Field label="Nama Produk" error={errors.name}>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama produk…"
                            className="input-field"
                        />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                        <Field label="SKU" error={errors.sku}>
                            <input
                                type="text"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                placeholder="SKU-001"
                                className="input-field"
                            />
                        </Field>
                        <Field label="Kategori" error={errors.category_id}>
                            <select
                                value={data.category_id}
                                onChange={(e) =>
                                    setData('category_id', e.target.value)
                                }
                                className="input-field"
                            >
                                <option value="">Pilih…</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {!isEdit && (
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Stok Awal" error={errors.stock}>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.stock}
                                    onChange={(e) =>
                                        setData('stock', e.target.value)
                                    }
                                    className="input-field"
                                />
                            </Field>
                            <Field label="Min Stock" error={errors.min_stock}>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.min_stock}
                                    onChange={(e) =>
                                        setData('min_stock', e.target.value)
                                    }
                                    className="input-field"
                                />
                            </Field>
                        </div>
                    )}

                    {isEdit && (
                        <Field label="Min Stock" error={errors.min_stock}>
                            <input
                                type="number"
                                min="0"
                                value={data.min_stock}
                                onChange={(e) =>
                                    setData('min_stock', e.target.value)
                                }
                                className="input-field"
                            />
                        </Field>
                    )}

                    <div className="flex items-center gap-3 border-t border-gd-hairline pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-2xl border border-gd-hairline py-3 font-sans text-sm font-semibold text-gd-muted transition-colors hover:border-gd-ink hover:text-gd-ink"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-2xl bg-gd-coral py-3 font-sans text-sm font-semibold text-gd-canvas transition-colors hover:bg-gd-coral-active disabled:opacity-40"
                        >
                            {processing
                                ? 'Menyimpan…'
                                : isEdit
                                  ? 'Simpan'
                                  : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
