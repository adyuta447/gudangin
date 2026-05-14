import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import type { CategoryStock } from '@/types/gudangin';

interface CategoryBarChartProps {
    data: CategoryStock[];
}

const CORAL_PALETTE = [
    '#cc785c',
    '#d4896f',
    '#dc9a82',
    '#e4ab95',
    '#ecbca8',
    '#c06c4e',
    '#b46040',
    '#a85432',
    '#9c4824',
];

export function CategoryBarChart({ data }: CategoryBarChartProps) {
    return (
        <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                >
                    <CartesianGrid stroke="#e6dfd8" strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                        type="number"
                        tick={{ fill: '#6c6a64', fontSize: 11, fontFamily: 'Inter' }}
                        tickLine={false}
                        axisLine={{ stroke: '#e6dfd8' }}
                    />
                    <YAxis
                        dataKey="category"
                        type="category"
                        tick={{ fill: '#3d3d3a', fontSize: 12, fontFamily: 'Inter' }}
                        tickLine={false}
                        axisLine={false}
                        width={110}
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
                    />
                    <Bar dataKey="totalStock" radius={[0, 6, 6, 0]} barSize={20}>
                        {data.map((_, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={CORAL_PALETTE[index % CORAL_PALETTE.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
