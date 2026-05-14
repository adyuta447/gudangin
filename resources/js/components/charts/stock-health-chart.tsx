import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { StockHealth } from '@/types/gudangin';

interface StockHealthChartProps {
    data: StockHealth[];
}

export function StockHealthChart({ data }: StockHealthChartProps) {
    return (
        <div className="flex items-center gap-8">
            <div className="h-[200px] w-[200px] flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={85}
                            paddingAngle={3}
                            dataKey="percentage"
                            nameKey="type"
                            strokeWidth={0}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                background: '#efe9de',
                                border: '1px solid #e6dfd8',
                                borderRadius: '12px',
                                fontFamily: 'Inter',
                                fontSize: 13,
                                boxShadow: 'none',
                            }}
                            formatter={(value: number) => [`${value}%`, '']}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-4">
                {data.map((item) => (
                    <div key={item.type} className="flex items-center gap-3">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <div>
                            <span className="font-sans text-sm font-bold text-gd-ink">
                                {item.percentage}%
                            </span>
                            <span className="ml-2 font-sans text-sm text-gd-muted">
                                {item.type}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
