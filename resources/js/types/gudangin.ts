// ─── Shared chart/data types for Gudangin ───

export interface DailyUsage {
    date: string;
    quantity: number;
}

export interface StockHealth {
    type: string;
    percentage: number;
    color: string;
}

export interface CategoryStock {
    category: string;
    totalStock: number;
}

export interface Product {
    id: number;
    name: string;
    sku?: string;
    category: string;
    stock: number;
    velocity: number;
    daysLeft: number;
    minStock: number;
}

export interface Transaction {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    type: 'IN' | 'OUT';
    timestamp: string;
    note?: string | null;
}
