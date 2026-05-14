<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $products = Product::select('id', 'name', 'stock')
            ->orderBy('name')
            ->get();

        // Build query with filters
        $query = Transaction::with(['product:id,name', 'user:id,name'])->latest();

        // Admin sees all, staff sees their own
        if ($user->isStaff()) {
            $query->where('user_id', $user->id);
        }

        // Filter by type
        if ($request->has('type') && in_array($request->input('type'), ['IN', 'OUT'])) {
            $query->where('type', $request->input('type'));
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        // Filter by product
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->input('product_id'));
        }

        $transactions = $query->take(50)->get()->map(fn ($tx) => [
            'id' => $tx->id,
            'productId' => $tx->product_id,
            'productName' => $tx->product?->name ?? 'Unknown',
            'userName' => $tx->user?->name ?? 'System',
            'quantity' => $tx->quantity,
            'type' => $tx->type,
            'timestamp' => $tx->created_at->toIso8601String(),
            'note' => $tx->note,
        ]);

        return Inertia::render('transactions', [
            'products' => $products,
            'transactions' => $transactions,
            'isAdmin' => $user->isAdmin(),
            'filters' => [
                'type' => $request->input('type', ''),
                'date_from' => $request->input('date_from', ''),
                'date_to' => $request->input('date_to', ''),
                'product_id' => $request->input('product_id', ''),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:IN,OUT',
            'note' => 'nullable|string|max:500',
        ]);

        $product = Product::findOrFail($validated['product_id']);

        // For OUT transactions, check sufficient stock
        if ($validated['type'] === 'OUT' && $product->stock < $validated['quantity']) {
            return back()->withErrors([
                'quantity' => 'Stok tidak mencukupi. Stok tersedia: ' . $product->stock,
            ]);
        }

        // Create transaction
        Transaction::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        // Update product stock
        if ($validated['type'] === 'IN') {
            $product->increment('stock', $validated['quantity']);
        } else {
            $product->decrement('stock', $validated['quantity']);
        }

        // Recalculate velocity
        $product->recalculateVelocity();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Transaksi berhasil disimpan.',
        ]);
    }
}
