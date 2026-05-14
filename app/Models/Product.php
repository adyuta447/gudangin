<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'sku',
        'stock',
        'min_stock',
        'velocity',
    ];

    protected function casts(): array
    {
        return [
            'stock' => 'integer',
            'min_stock' => 'integer',
            'velocity' => 'float',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function getDaysLeftAttribute(): int
    {
        if ($this->velocity <= 0) {
            return 999;
        }

        return (int) floor($this->stock / $this->velocity);
    }
    public function recalculateVelocity(): void
    {
        $totalOut = $this->transactions()
            ->where('type', 'OUT')
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('quantity');

        $this->velocity = round($totalOut / 30, 2);
        $this->save();
    }
}
