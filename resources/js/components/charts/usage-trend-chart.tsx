import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    ResponsiveContainer,
} from 'recharts';
import type { DailyUsage } from '@/types/gudangin';

interface UsageTrendChartProps {
    data: DailyUsage[];
    average: number;
}

export function UsageTrendChart({ data, average }: UsageTrendChartProps) {
    const formattedData = useMemo(
        () =>
            data.map((d) => ({
                ...d,
                label: d.date.slice(5), // MM-DD
            })),
        [data],
    );

    return (
        <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedData} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
                    <CartesianGrid stroke="#e6dfd8" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: '#6c6a64', fontSize: 11, fontFamily: 'Inter' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e6dfd8' }}
                        interval={4}
                    />
                    <YAxis
                        tick={{ fill: '#6c6a64', fontSize: 11, fontFamily: 'Inter' }}
                        tickLine={false}
                        axisLine={false}
                        width={36}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#efe9de',
                            border: '1px solid #e6dfd8',
                            borderRadius: '12px',
                            fontFamily: 'Inter',
                            fontSize: 13,
                            boxShadow: 'none',
                        }}
                        labelStyle={{ color: '#141413', fontWeight: 600 }}
                        itemStyle={{ color: '#3d3d3a' }}
                    />
                    <ReferenceLine
                        y={average}
                        stroke="#8e8b82"
                        strokeDasharray="6 4"
                        strokeWidth={1.5}
                        label={{
                            value: `Avg ${average}`,
                            position: 'insideTopRight',
                            fill: '#8e8b82',
                            fontSize: 11,
                            fontFamily: 'Inter',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="quantity"
                        stroke="#141413"
                        strokeWidth={2.5}
                        dot={false}
                        activeDot={{
                            r: 5,
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
