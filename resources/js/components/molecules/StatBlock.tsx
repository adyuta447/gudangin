interface StatBlockProps {
    label: string;
    value: string;
    note: string;
    accent?: 'amber' | 'coral';
}

export function StatBlock({ label, value, note, accent }: StatBlockProps) {
    const valueColor =
        accent === 'coral'
            ? 'text-gd-coral'
            : accent === 'amber'
              ? 'text-gd-amber'
              : 'text-gd-ink';

    return (
        <div className="flex flex-col justify-between p-7">
            <span className="font-sans text-xs font-medium tracking-[0.15em] text-gd-muted uppercase">
                {label}
            </span>
            <div>
                <p
                    className={`mt-3 font-sans text-4xl font-bold tracking-tight ${valueColor}`}
                >
                    {value}
                </p>
                <p className="mt-1 font-sans text-xs text-gd-muted-soft">
                    {note}
                </p>
            </div>
        </div>
    );
}
