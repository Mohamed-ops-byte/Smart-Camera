<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionAddOn extends Model
{
    use HasFactory;

    protected $table = 'subscription_add_ons';

    protected $fillable = [
        'subscription_id',
        'add_on_id',
        'quantity',
        'price',
        'started_at',
        'ended_at',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    /**
     * العلاقة مع الاشتراك
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * العلاقة مع المزايا الإضافية
     */
    public function addOn(): BelongsTo
    {
        return $this->belongsTo(AddOn::class, 'add_on_id');
    }

    /**
     * التحقق من أن المزية تزال نشطة
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && 
               ($this->ended_at === null || $this->ended_at > now());
    }

    /**
     * إيقاف المزية الإضافية
     */
    public function cancel(): void
    {
        $this->update([
            'status' => 'canceled',
            'ended_at' => now(),
        ]);
    }
}
