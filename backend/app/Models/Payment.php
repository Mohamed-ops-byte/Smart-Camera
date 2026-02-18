<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';

    protected $fillable = [
        'subscription_id',
        'transaction_id',
        'payment_method',
        'payment_gateway',
        'status',
        'amount',
        'currency',
        'description',
        'paid_at',
        'failed_at',
        'error_message',
        'retry_count',
        'last_retry_at',
        'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
        'failed_at' => 'datetime',
        'last_retry_at' => 'datetime',
        'metadata' => 'json',
    ];

    /**
     * العلاقة مع الاشتراك
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * التحقق من اكتمال الدفع
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * التحقق من فشل الدفع
     */
    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    /**
     * التحقق من استرجاع الدفع
     */
    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    /**
     * وضع علامة على الدفع كمكتمل
     */
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'paid_at' => now(),
        ]);
    }

    /**
     * وضع علامة على الدفع كفاشل
     */
    public function markAsFailed(string $errorMessage = null): void
    {
        $this->update([
            'status' => 'failed',
            'failed_at' => now(),
            'error_message' => $errorMessage,
            'retry_count' => $this->retry_count + 1,
            'last_retry_at' => now(),
        ]);
    }

    /**
     * إرجاع الدفع
     */
    public function refund(): void
    {
        $this->update([
            'status' => 'refunded',
        ]);
    }
}
