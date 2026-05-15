import type { CategoryStock } from '@/types/gudangin';

interface CategoryBarChartProps {
    data: CategoryStock[];
}

// Alternating palette: coral → navy → teal → amber, staying within brand trinity
const PALETTE = [
    '#cc785c',
    '#181715',
    '#5db8a6',
    '#e8a55a',
    '#a9583e',
    '#252320',
    '#3d3d3a',
    '#6c6a64',
    '#8e8b82',
];

export function CategoryBarChart({ data }: CategoryBarChartProps) {
    if (!data.length) {
        return null;
    }

    const max = Math.max(...data.map((d) => d.totalStock), 1);

    // Sort descending for editorial impact
    const sorted = [...data].sort((a, b) => b.totalStock - a.totalStock);

    return (
        <div className="space-y-4">
            {sorted.map((item, i) => {
                const pct = (item.totalStock / max) * 100;
                const color = PALETTE[i % PALETTE.length];

                return (
                    <div key={item.category} className="group">
                        {/* Label row */}
                        <div className="mb-2 flex items-baseline justify-between">
                            <span className="font-sans text-sm font-medium text-gd-body">
                                {item.category}
                            </span>
                            <span className="font-sans text-sm font-bold text-gd-ink tabular-nums">
                                {item.totalStock.toLocaleString()}
                            </span>
                        </div>
                        {/* Bar */}
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gd-hairline">
                            <div
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${pct}%`,
                                    backgroundColor: color,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
