interface MetricBlockProps {
    label: string;
    value: string;
    sub: string;
    subColor: string;
}

export function MetricBlock({ label, value, sub, subColor }: MetricBlockProps) {
    return (
        <div className="flex flex-col justify-between p-8">
            <span className="font-sans text-xs font-medium tracking-[0.15em] text-gd-muted uppercase">
                {label}
            </span>
            <div>
                <p className="mt-4 font-sans text-5xl font-bold tracking-tight text-gd-ink">
                    {value}
                </p>
                <p className={`mt-2 font-sans text-sm ${subColor}`}>{sub}</p>
            </div>
        </div>
    );
}
