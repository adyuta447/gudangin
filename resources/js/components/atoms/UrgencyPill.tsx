export function UrgencyPill({
    urgency,
}: {
    urgency: 'critical' | 'warning' | 'moderate';
}) {
    const map = {
        critical: 'text-gd-coral',
        warning: 'text-gd-amber',
        moderate: 'text-gd-teal',
    };
    const label = {
        critical: 'Critical',
        warning: 'Warning',
        moderate: 'Moderate',
    };
    return (
        <span
            className={`font-sans text-xs font-bold tracking-wider uppercase ${map[urgency]}`}
        >
            {label[urgency]}
        </span>
    );
}
