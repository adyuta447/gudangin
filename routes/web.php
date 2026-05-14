<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StaffDashboardController;
use App\Http\Controllers\StaffManagementController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');
        Route::get('staff-management', [StaffManagementController::class, 'index'])->name('staff-management');
        Route::post('staff-management', [StaffManagementController::class, 'store'])->name('staff-management.store');
        Route::put('staff-management/{user}', [StaffManagementController::class, 'update'])->name('staff-management.update');
        Route::delete('staff-management/{user}', [StaffManagementController::class, 'destroy'])->name('staff-management.destroy');
    });

    // Staff routes
    Route::middleware('role:staff')->prefix('staff')->group(function () {
        Route::get('dashboard', StaffDashboardController::class)->name('staff.dashboard');
    });

    // Shared routes (both admin and staff)
    Route::middleware('role:admin,staff')->group(function () {
        Route::get('products', [ProductController::class, 'index'])->name('products');
        Route::post('products', [ProductController::class, 'store'])->name('products.store');
        Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
        Route::get('products/{product}/usage-trend', [ProductController::class, 'usageTrend'])->name('products.usage-trend');
        Route::get('transactions', [TransactionController::class, 'index'])->name('transactions');
        Route::post('transactions', [TransactionController::class, 'store'])->name('transactions.store');
    });
});

require __DIR__.'/settings.php';
