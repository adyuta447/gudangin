import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import { Users, Plus, Pencil, Trash2, X, Mail, Shield, Activity } from 'lucide-react';

interface StaffMember {
    id: number; name: string; email: string;
    transactionCount: number; createdAt: string; lastActivity: string;
}
interface Props { staffMembers: StaffMember[]; }

export default function StaffManagement({ staffMembers }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editStaff, setEditStaff] = useState<StaffMember | null>(null);

    return (
        <>
            <Head title="Staff Management" />
            <div className="min-h-screen bg-gd-canvas">
                <div className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
                    <header className="mb-10 flex items-start justify-between">
                        <div>
                            <h1 className="font-serif text-4xl font-semibold tracking-tight text-gd-ink">Staff Management</h1>
                            <p className="mt-2 font-sans text-base text-gd-muted">{staffMembers.length} akun staff terdaftar</p>
                        </div>
                        <button onClick={() => { setEditStaff(null); setShowForm(true); }}
                            className="flex items-center gap-2 rounded-2xl bg-gd-coral px-5 py-2.5 font-sans text-sm font-semibold text-gd-canvas transition-all hover:bg-gd-coral-active">
                            <Plus className="h-4 w-4" /> Tambah Staff
                        </button>
                    </header>

                    {/* Staff Cards */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {staffMembers.map((staff) => (
                            <div key={staff.id} className="rounded-2xl border border-gd-hairline bg-gd-surface-card p-6 transition-all duration-200 hover:border-gd-coral/30">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gd-coral/10 font-sans text-sm font-bold text-gd-coral">
                                            {staff.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-sans text-sm font-semibold text-gd-ink">{staff.name}</p>
                                            <p className="flex items-center gap-1 font-sans text-xs text-gd-muted">
                                                <Mail className="h-3 w-3" /> {staff.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={() => { setEditStaff(staff); setShowForm(true); }}
                                            className="rounded-lg p-1.5 text-gd-muted hover:bg-gd-surface-soft hover:text-gd-ink transition-colors">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                        <button onClick={() => { if (confirm(`Hapus akun ${staff.name}?`)) router.delete(`/staff-management/${staff.id}`); }}
                                            className="rounded-lg p-1.5 text-gd-muted hover:bg-gd-coral/10 hover:text-gd-coral transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 border-t border-gd-hairline/50 pt-4">
                                    <div className="text-center">
                                        <Shield className="mx-auto mb-1 h-3.5 w-3.5 text-gd-muted" />
                                        <p className="font-sans text-xs text-gd-muted">Role</p>
                                        <p className="font-sans text-xs font-bold text-gd-teal">Staff</p>
                                    </div>
                                    <div className="text-center">
                                        <Activity className="mx-auto mb-1 h-3.5 w-3.5 text-gd-muted" />
                                        <p className="font-sans text-xs text-gd-muted">Transaksi</p>
                                        <p className="font-sans text-sm font-bold text-gd-ink">{staff.transactionCount}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-sans text-xs text-gd-muted">Last Active</p>
                                        <p className="font-sans text-xs font-medium text-gd-body mt-1">{staff.lastActivity}</p>
                                    </div>
                                </div>

                                <p className="mt-3 font-sans text-xs text-gd-muted-soft">Dibuat {staff.createdAt}</p>
                            </div>
                        ))}

                        {staffMembers.length === 0 && (
                            <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-dashed border-gd-hairline">
                                <div className="text-center">
                                    <Users className="mx-auto mb-2 h-8 w-8 text-gd-muted-soft" />
                                    <p className="font-sans text-sm text-gd-muted-soft">Belum ada akun staff</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {showForm && (
                <StaffFormModal
                    staff={editStaff}
                    onClose={() => { setShowForm(false); setEditStaff(null); }}
                />
            )}
        </>
    );
}

function StaffFormModal({ staff, onClose }: { staff: StaffMember | null; onClose: () => void; }) {
    const isEdit = !!staff;
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: staff?.name ?? '',
        email: staff?.email ?? '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/staff-management/${staff.id}`, { onSuccess: onClose });
        } else {
            post('/staff-management', { onSuccess: () => { reset(); onClose(); } });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gd-ink/40 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-gd-hairline bg-gd-surface-card p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="font-serif text-xl font-semibold text-gd-ink">{isEdit ? 'Edit Staff' : 'Tambah Staff Baru'}</h2>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-gd-muted hover:bg-gd-surface-soft hover:text-gd-ink transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block font-sans text-sm text-gd-muted">Nama Lengkap</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama staff..."
                            className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink placeholder:text-gd-muted-soft focus:border-gd-coral focus:outline-none" />
                        {errors.name && <p className="mt-1 text-xs text-gd-coral">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block font-sans text-sm text-gd-muted">Email</label>
                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)}
                            placeholder="staff@gudangin.com"
                            className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink placeholder:text-gd-muted-soft focus:border-gd-coral focus:outline-none" />
                        {errors.email && <p className="mt-1 text-xs text-gd-coral">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block font-sans text-sm text-gd-muted">
                            Password {isEdit && <span className="text-gd-muted-soft">(kosongkan jika tidak ubah)</span>}
                        </label>
                        <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)}
                            placeholder={isEdit ? '••••••••' : 'Minimal 8 karakter'}
                            className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink placeholder:text-gd-muted-soft focus:border-gd-coral focus:outline-none" />
                        {errors.password && <p className="mt-1 text-xs text-gd-coral">{errors.password}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block font-sans text-sm text-gd-muted">Konfirmasi Password</label>
                        <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Ulangi password"
                            className="w-full rounded-xl border border-gd-hairline bg-gd-canvas px-4 py-2.5 font-sans text-sm text-gd-ink placeholder:text-gd-muted-soft focus:border-gd-coral focus:outline-none" />
                    </div>
                    <button type="submit" disabled={processing}
                        className="w-full rounded-xl bg-gd-coral py-3 font-sans text-sm font-semibold text-gd-canvas transition-all hover:bg-gd-coral-active disabled:opacity-40">
                        {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Akun Staff'}
                    </button>
                </form>
            </div>
        </div>
    );
}

StaffManagement.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Staff Management', href: '/staff-management' },
    ],
};
