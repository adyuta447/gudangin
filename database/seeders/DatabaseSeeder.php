<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin Gudangin',
            'email' => 'admin@gudangin.com',
            'role' => 'admin',
        ]);

        $staff = User::factory()->create([
            'name' => 'Staff Gudangin',
            'email' => 'staff@gudangin.com',
            'role' => 'staff',
        ]);

        // ─── Categories ───
        $categories = collect([
            'Bahan Pokok',
            'Minuman',
            'Makanan Instan',
            'Makanan Kaleng',
            'Perawatan',
            'Kebersihan',
            'Elektronik',
            'Bumbu',
            'Lainnya',
        ])->mapWithKeys(function ($name) {
            $cat = Category::create([
                'name' => $name,
                'slug' => str($name)->slug(),
            ]);
            return [$name => $cat];
        });

        // ─── Products ───
        $productData = [
            ['Beras Premium 5kg', 'Bahan Pokok', 'BP-001', 85, 20, 4.2],
            ['Minyak Goreng 2L', 'Bahan Pokok', 'BP-002', 42, 15, 3.1],
            ['Gula Pasir 1kg', 'Bahan Pokok', 'BP-003', 38, 25, 5.0],
            ['Tepung Terigu 1kg', 'Bahan Pokok', 'BP-004', 65, 15, 2.3],
            ['Kopi Kapal Api 165g', 'Minuman', 'MN-001', 55, 20, 3.5],
            ['Teh Sariwangi 50pcs', 'Minuman', 'MN-002', 72, 15, 2.1],
            ['Susu Indomilk 1L', 'Minuman', 'MN-003', 28, 20, 4.0],
            ['Mie Indomie Goreng', 'Makanan Instan', 'MI-001', 180, 50, 8.5],
            ['Mie Sedaap Soto', 'Makanan Instan', 'MI-002', 120, 30, 5.2],
            ['Sardines ABC 155g', 'Makanan Kaleng', 'MK-001', 45, 15, 2.0],
            ['Corned Beef 340g', 'Makanan Kaleng', 'MK-002', 22, 10, 0.8],
            ['Sabun Lifebuoy 100g', 'Perawatan', 'PR-001', 90, 20, 3.2],
            ['Shampo Sunsilk 170ml', 'Perawatan', 'PR-002', 35, 15, 1.8],
            ['Pasta Gigi Pepsodent', 'Perawatan', 'PR-003', 55, 20, 2.5],
            ['Deterjen Rinso 800g', 'Kebersihan', 'KB-001', 32, 15, 3.0],
            ['Pewangi Molto 800ml', 'Kebersihan', 'KB-002', 28, 10, 1.2],
            ['Tissue Paseo 250s', 'Kebersihan', 'KB-003', 48, 20, 2.8],
            ['Baterai ABC AA 2pcs', 'Elektronik', 'EL-001', 15, 10, 0.5],
            ['Lampu LED 9W', 'Elektronik', 'EL-002', 8, 5, 0],
            ['Korek Api Cricket', 'Lainnya', 'LN-001', 110, 30, 4.0],
            ['Kantong Plastik 1kg', 'Lainnya', 'LN-002', 18, 10, 3.5],
            ['Kecap Manis ABC 275ml', 'Bumbu', 'BM-001', 40, 15, 2.2],
            ['Sambal ABC 335ml', 'Bumbu', 'BM-002', 52, 15, 3.0],
            ['Garam Halus 500g', 'Bumbu', 'BM-003', 70, 20, 1.0],
        ];

        $products = collect();
        foreach ($productData as [$name, $catName, $sku, $stock, $minStock, $velocity]) {
            $products->push(Product::create([
                'category_id' => $categories[$catName]->id,
                'name' => $name,
                'sku' => $sku,
                'stock' => $stock,
                'min_stock' => $minStock,
                'velocity' => $velocity,
            ]));
        }

        // ─── Transactions (last 30 days) ───
        $types = ['IN', 'OUT'];

        foreach ($products as $product) {
            // Generate 30 days of transactions
            for ($day = 29; $day >= 0; $day--) {
                $date = now()->subDays($day);

                // 1-3 transactions per day per product
                $txCount = rand(1, 3);
                for ($i = 0; $i < $txCount; $i++) {
                    $type = $types[array_rand($types)];
                    $maxQty = $type === 'OUT'
                        ? max(1, (int) ceil($product->velocity * 1.5))
                        : max(1, (int) ceil($product->velocity * 2));
                    $qty = rand(1, max(1, $maxQty));

                    Transaction::create([
                        'product_id' => $product->id,
                        'user_id' => $staff->id,
                        'quantity' => $qty,
                        'type' => $type,
                        'note' => null,
                        'created_at' => $date->copy()->addHours(rand(7, 20))->addMinutes(rand(0, 59)),
                        'updated_at' => $date->copy()->addHours(rand(7, 20))->addMinutes(rand(0, 59)),
                    ]);
                }
            }
        }
    }
}
