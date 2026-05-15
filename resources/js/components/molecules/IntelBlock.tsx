interface IntelBlockProps {
    label: string;
    value: string;
    note: string;
    highlight?: boolean;
}

export function IntelBlock({ label, value, note, highlight }: IntelBlockProps) {
    return (
        <div
            className={`flex flex-col justify-between px-10 py-8 ${highlight ? 'bg-gd-coral/10' : ''}`}
        >
            <span className="font-sans text-xs font-medium tracking-[0.15em] text-gd-on-dark-soft uppercase">
                {label}
            </span>
            <div>
                <p
                    className={`mt-4 font-sans text-4xl font-bold tracking-tight ${highlight ? 'text-gd-coral' : 'text-gd-on-dark'}`}
                >
                    {value}
                </p>
                <p className="mt-2 font-sans text-xs text-gd-on-dark-soft">
                    {note}
                </p>
            </div>
        </div>
    );
}
