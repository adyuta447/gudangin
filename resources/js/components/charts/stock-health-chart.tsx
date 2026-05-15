import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { StockHealth } from '@/types/gudangin';

interface StockHealthChartProps { data: StockHealth[]; }

function CustomTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload as StockHealth;
    return (
        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card px-4 py-3">
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-gd-muted">{d.type} Moving</p>
            <p className="mt-1 font-sans text-2xl font-bold text-gd-ink">{d.percentage}%</p>
        </div>
    );
}

export function StockHealthChart({ data }: StockHealthChartProps) {
    // Find the dominant segment
    const dominant = data.reduce((a, b) => a.percentage > b.percentage ? a : b, data[0]);

    return (
        <div className="relative flex flex-col items-center">
            {/* Donut chart */}
            <div className="relative h-[200px] w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={62}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="percentage"
                            nameKey="type"
                            strokeWidth={0}
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                {dominant && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-sans text-2xl font-bold text-gd-ink">{dominant.percentage}%</span>
                        <span className="font-sans text-xs text-gd-muted">{dominant.type}</span>
                    </div>
                )}
            </div>

            {/* Editorial bar legend */}
            <div className="mt-6 w-full space-y-3">
                {data.map((item) => (
                    <div key={item.type}>
                        <div className="mb-1.5 flex items-center justify-between">
                            <span className="font-sans text-xs font-medium uppercase tracking-[0.12em] text-gd-muted">
                                {item.type} Moving
                            </span>
                            <span className="font-sans text-sm font-bold text-gd-ink">{item.percentage}%</span>
                        </div>
                        <div className="h-1 w-full overflow-hidden rounded-full bg-gd-hairline">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
