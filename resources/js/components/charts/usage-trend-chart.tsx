import { useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ReferenceLine, ResponsiveContainer,
} from 'recharts';
import type { DailyUsage } from '@/types/gudangin';

interface UsageTrendChartProps { data: DailyUsage[]; average: number; }

// ─── Custom Tooltip ───
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card px-4 py-3">
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-gd-muted">{label}</p>
            <p className="mt-1 font-sans text-2xl font-bold text-gd-ink">{payload[0].value}</p>
            <p className="font-sans text-xs text-gd-muted-soft">unit keluar</p>
        </div>
    );
}

export function UsageTrendChart({ data, average }: UsageTrendChartProps) {
    const formattedData = useMemo(
        () => data.map((d) => ({
            ...d,
            label: new Date(d.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        })),
        [data],
    );

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 12, right: 8, left: -8, bottom: 0 }}>
                    <CartesianGrid
                        stroke="#e6dfd8"
                        strokeDasharray="0"
                        vertical={false}
                        strokeWidth={1}
                    />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: '#8e8b82', fontSize: 10, fontFamily: 'Inter', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        interval={5}
                        dy={8}
                    />
                    <YAxis
                        tick={{ fill: '#8e8b82', fontSize: 10, fontFamily: 'Inter', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        width={32}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e6dfd8', strokeWidth: 1 }} />
                    {/* Average reference line */}
                    <ReferenceLine
                        y={average}
                        stroke="#cc785c"
                        strokeDasharray="5 4"
                        strokeWidth={1}
                        label={{
                            value: `avg ${average}`,
                            position: 'insideTopRight',
                            fill: '#cc785c',
                            fontSize: 10,
                            fontFamily: 'Inter',
                            fontWeight: 600,
                            dy: -6,
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="quantity"
                        stroke="#141413"
                        strokeWidth={1.5}
                        dot={false}
                        activeDot={{
                            r: 4,
                            fill: '#cc785c',
                            stroke: '#faf9f5',
                            strokeWidth: 2,
                        }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
