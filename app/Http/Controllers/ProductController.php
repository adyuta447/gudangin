<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::with('category:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'sku' => $p->sku,
                'categoryId' => $p->category_id,
                'category' => $p->category?->name ?? 'Uncategorized',
                'stock' => $p->stock,
                'velocity' => $p->velocity,
                'daysLeft' => $p->days_left,
                'minStock' => $p->min_stock,
            ]);

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return Inertia::render('products', [
            'products' => $products,
            'categories' => $categories,
            'isAdmin' => $request->user()->isAdmin(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:50|unique:products,sku',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'min_stock' => 'required|integer|min:0',
        ]);

        Product::create([
            ...$validated,
            'velocity' => 0,
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Produk berhasil ditambahkan.',
        ]);
    }

    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:50|unique:products,sku,' . $product->id,
            'category_id' => 'required|exists:categories,id',
            'min_stock' => 'required|integer|min:0',
        ]);

        $product->update($validated);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Produk berhasil diperbarui.',
        ]);
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Produk berhasil dihapus.',
        ]);
    }

    public function usageTrend(Product $product): \Illuminate\Http\JsonResponse
    {
        $trend = Transaction::where('product_id', $product->id)
            ->where('type', 'OUT')
            ->where('created_at', '>=', now()->subDays(7))
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

        return response()->json($trend);
    }
}
