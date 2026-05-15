import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export interface RecentTx {
    id: number;
    productName: string;
    userName: string;
    quantity: number;
    type: 'IN' | 'OUT';
    timestamp: string;
}

interface RecentActivityListProps {
    transactions: RecentTx[];
}

export function RecentActivityList({ transactions }: RecentActivityListProps) {
    return (
        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card">
            <div className="border-b border-gd-hairline px-8 py-6">
                <h2 className="font-serif text-2xl font-semibold text-gd-ink">
                    Aktivitas Terbaru
                </h2>
                <p className="mt-0.5 font-sans text-xs text-gd-muted">
                    Semua transaksi oleh seluruh staff
                </p>
            </div>
            <div className="divide-y divide-gd-hairline/60">
                {transactions.map((tx) => {
                    const dt = new Date(tx.timestamp);
                    const time = dt.toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                    });
                    const date = dt.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                    });
                    const isIn = tx.type === 'IN';
                    return (
                        <div
                            key={tx.id}
                            className="flex items-center gap-5 px-8 py-4 transition-colors hover:bg-gd-surface-soft/60"
                        >
                            {isIn ? (
                                <ArrowDownRight className="h-4 w-4 flex-shrink-0 text-gd-teal" />
                            ) : (
                                <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-gd-coral" />
                            )}
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-sans text-sm font-semibold text-gd-ink">
                                    {tx.productName}
                                </p>
                                <p className="font-sans text-xs text-gd-muted">
                                    {isIn ? '+' : '−'}
                                    {tx.quantity} unit · {tx.userName}
                                </p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                                <p className="font-sans text-xs font-medium text-gd-muted-soft">
                                    {date}
                                </p>
                                <p className="font-sans text-xs text-gd-muted-soft">
                                    {time}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {transactions.length === 0 && (
                    <p className="px-8 py-8 font-sans text-sm text-gd-muted-soft">
                        Belum ada transaksi
                    </p>
                )}
            </div>
        </div>
    );
}
