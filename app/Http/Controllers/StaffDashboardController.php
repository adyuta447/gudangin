<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StaffDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $transaksiHariIni = Transaction::where('user_id', $user->id)
            ->whereDate('created_at', today())->count();
        $barangMasuk = Transaction::where('user_id', $user->id)
            ->where('type', 'IN')
            ->whereDate('created_at', today())
            ->sum('quantity');
        $barangKeluar = Transaction::where('user_id', $user->id)
            ->where('type', 'OUT')
            ->whereDate('created_at', today())
            ->sum('quantity');
        $miniTrend = Transaction::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw("SUM(CASE WHEN type = 'IN' THEN quantity ELSE 0 END) as stok_masuk"),
                DB::raw("SUM(CASE WHEN type = 'OUT' THEN quantity ELSE 0 END) as stok_keluar")
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'stok_masuk' => (int) $row->stok_masuk,
                'stok_keluar' => (int) $row->stok_keluar,
            ]);

        $myTransactions = Transaction::with('product:id,name')
            ->where('user_id', $user->id)
            ->latest()
            ->take(15)
            ->get()
            ->map(fn ($tx) => [
                'id' => $tx->id,
                'productName' => $tx->product?->name ?? 'Unknown',
                'quantity' => $tx->quantity,
                'type' => $tx->type,
                'timestamp' => $tx->created_at->toIso8601String(),
            ]);
        $lowStockAlerts = Product::with('category:id,name')
            ->whereRaw('stock <= min_stock')
            ->where('velocity', '>', 0)
            ->orderByRaw('stock / NULLIF(velocity, 0) ASC')
            ->take(6)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'category' => $p->category?->name ?? '-',
                'stock' => $p->stock,
                'minStock' => $p->min_stock,
                'daysLeft' => $p->days_left,
            ]);

        return Inertia::render('staff/dashboard', [
            'dailyMetrics' => [
                'transaksiHariIni' => $transaksiHariIni,
                'barangMasuk' => (int) $barangMasuk,
                'barangKeluar' => (int) $barangKeluar,
            ],
            'miniTrend' => $miniTrend,
            'myTransactions' => $myTransactions,
            'lowStockAlerts' => $lowStockAlerts,
        ]);
    }
}
