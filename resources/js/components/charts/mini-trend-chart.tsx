import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import type { DailyUsage } from '@/types/gudangin';

interface MiniTrendChartProps { data: DailyUsage[]; }

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-2xl border border-gd-hairline bg-gd-surface-card px-3 py-2">
            <p className="font-sans text-xs text-gd-muted">{label}</p>
            <p className="font-sans text-base font-bold text-gd-ink">{payload[0].value}
                <span className="ml-1 font-sans text-xs font-normal text-gd-muted-soft">unit</span>
            </p>
        </div>
    );
}

export function MiniTrendChart({ data }: MiniTrendChartProps) {
    const formattedData = data.map((d) => ({
        ...d,
        label: new Date(d.date + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    }));

    return (
        <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                    <CartesianGrid stroke="#e6dfd8" strokeDasharray="0" vertical={false} strokeWidth={1} />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: '#8e8b82', fontSize: 9, fontFamily: 'Inter', fontWeight: 500 }}
                        tickLine={false}
                        axisLine={false}
                        dy={6}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e6dfd8', strokeWidth: 1 }} />
                    <Line
                        type="monotone"
                        dataKey="quantity"
                        stroke="#cc785c"
                        strokeWidth={1.5}
                        dot={false}
                        activeDot={{ r: 3, fill: '#cc785c', stroke: '#faf9f5', strokeWidth: 2 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
