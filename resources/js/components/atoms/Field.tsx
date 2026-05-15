import React from 'react';

interface FieldProps {
    label: string;
    error?: string;
    children: React.ReactNode;
}

export function Field({ label, error, children }: FieldProps) {
    return (
        <div>
            <label className="mb-1.5 block font-sans text-xs font-medium tracking-[0.12em] text-gd-muted uppercase">
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-1 font-sans text-xs text-gd-coral">{error}</p>
            )}
        </div>
    );
}
