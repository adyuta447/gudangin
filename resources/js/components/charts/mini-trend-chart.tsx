import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import type { DailyUsage } from '@/types/gudangin';

interface MiniTrendChartProps {
    data: DailyUsage[];
}

export function MiniTrendChart({ data }: MiniTrendChartProps) {
    const formattedData = data.map((d) => ({
        ...d,
        label: d.date.slice(8), 
    }));

    return (
        <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedData} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
                    <defs>
                        <linearGradient id="miniGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#cc785c" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#cc785c" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis
                        dataKey="label"
                        tick={{ fill: '#8e8b82', fontSize: 10, fontFamily: 'Inter' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{
                            background: '#efe9de',
                            border: '1px solid #e6dfd8',
                            borderRadius: '12px',
                            fontFamily: 'Inter',
                            fontSize: 12,
                            boxShadow: 'none',
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="quantity"
                        stroke="#cc785c"
                        strokeWidth={2}
                        fill="url(#miniGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
