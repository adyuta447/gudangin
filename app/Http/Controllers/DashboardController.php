<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $products = Product::with('category')->get();

        // Top metrics
        $totalProducts = $products->count();
        $totalStock = $products->sum('stock');
        $lowStockProducts = $products->filter(fn ($p) => $p->stock <= $p->min_stock && $p->velocity > 0);
        $deadStockProducts = $products->filter(fn ($p) => $p->velocity <= 0);

        // Stock change compared to yesterday
        $stockInToday = Transaction::where('type', 'IN')
            ->whereDate('created_at', today())
            ->sum('quantity');
        $stockOutToday = Transaction::where('type', 'OUT')
            ->whereDate('created_at', today())
            ->sum('quantity');
        $stockDelta = $stockInToday - $stockOutToday;

        // Products added today
        $productsAddedToday = Product::whereDate('created_at', today())->count();

        // Restock metrics
        $activeProducts = $products->filter(fn ($p) => $p->velocity > 0);
        $avgUsage = $activeProducts->count() > 0
            ? round($activeProducts->avg('velocity'), 1)
            : 0;
        $minDaysLeft = $activeProducts->count() > 0
            ? $activeProducts->min(fn ($p) => $p->days_left)
            : 0;
        $restockNeed = $lowStockProducts->sum(fn ($p) => max(0, $p->min_stock - $p->stock));

        // Usage trend (30 days)
        $usageTrend = Transaction::where('type', 'OUT')
            ->where('created_at', '>=', now()->subDays(30))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(quantity) as quantity')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($row) => [
                'date' => $row->date,
                'quantity' => (int) $row->quantity,
            ]);

        $avgTrend = $usageTrend->count() > 0
            ? round($usageTrend->avg('quantity'))
            : 0;

        // Stock health
        $total = $products->count() ?: 1;
        $fastCount = $products->filter(fn ($p) => $p->velocity >= 3)->count();
        $slowCount = $products->filter(fn ($p) => $p->velocity > 0 && $p->velocity < 3)->count();
        $deadCount = $products->filter(fn ($p) => $p->velocity <= 0)->count();

        $stockHealth = [
            ['type' => 'Fast', 'percentage' => round($fastCount / $total * 100), 'color' => '#5db8a6'],
            ['type' => 'Slow', 'percentage' => round($slowCount / $total * 100), 'color' => '#e8a55a'],
            ['type' => 'Dead', 'percentage' => round($deadCount / $total * 100), 'color' => '#cc785c'],
        ];

        // Critical products (lowest days left)
        $criticalProducts = $activeProducts
            ->sortBy(fn ($p) => $p->days_left)
            ->take(8)
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'stock' => $p->stock,
                'daysLeft' => $p->days_left,
                'velocity' => $p->velocity,
                'minStock' => $p->min_stock,
            ])
            ->values();

        // Category distribution
        $categoryDistribution = Category::withSum('products', 'stock')
            ->get()
            ->map(fn ($c) => [
                'category' => $c->name,
                'totalStock' => (int) ($c->products_sum_stock ?? 0),
            ]);

        // ─── Decision Output: Restock Recommendations ───
        $restockRecommendations = $activeProducts
            ->filter(fn ($p) => $p->days_left <= 14) // within 2 weeks
            ->sortBy(fn ($p) => $p->days_left)
            ->take(10)
            ->map(function ($p) {
                $optimalOrder = (int) ceil($p->velocity * 30); // 30-day supply
                $urgency = $p->days_left <= 3 ? 'critical' : ($p->days_left <= 7 ? 'warning' : 'moderate');
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'stock' => $p->stock,
                    'velocity' => $p->velocity,
                    'daysLeft' => $p->days_left,
                    'minStock' => $p->min_stock,
                    'optimalOrder' => $optimalOrder,
                    'urgency' => $urgency,
                    'estimatedDepletion' => now()->addDays($p->days_left)->format('d M Y'),
                ];
            })
            ->values();

        // Recent transactions for admin overview
        $recentTransactions = Transaction::with(['product:id,name', 'user:id,name'])
            ->latest()
            ->take(8)
            ->get()
            ->map(fn ($tx) => [
                'id' => $tx->id,
                'productName' => $tx->product?->name ?? 'Unknown',
                'userName' => $tx->user?->name ?? 'System',
                'quantity' => $tx->quantity,
                'type' => $tx->type,
                'timestamp' => $tx->created_at->toIso8601String(),
            ]);

        return Inertia::render('dashboard', [
            'metrics' => [
                'totalProducts' => $totalProducts,
                'totalStock' => $totalStock,
                'lowStockCount' => $lowStockProducts->count(),
                'deadStockCount' => $deadStockProducts->count(),
                'productsAddedToday' => $productsAddedToday,
                'stockDelta' => $stockDelta,
            ],
            'restockMetrics' => [
                'avgUsage' => $avgUsage . '/day',
                'minDaysLeft' => $minDaysLeft,
                'restockNeed' => $restockNeed,
            ],
            'usageTrend' => $usageTrend,
            'avgTrend' => $avgTrend,
            'stockHealth' => $stockHealth,
            'criticalProducts' => $criticalProducts,
            'categoryDistribution' => $categoryDistribution,
            'restockRecommendations' => $restockRecommendations,
            'recentTransactions' => $recentTransactions,
        ]);
    }
}
