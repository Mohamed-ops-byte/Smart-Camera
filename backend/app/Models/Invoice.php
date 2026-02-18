<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    use HasFactory;

    protected $table = 'invoices';

    protected $fillable = [
        'subscription_id',
        'payment_id',
        'invoice_number',
        'status',
        'amount',
        'currency',
        'issued_at',
        'due_at',
        'paid_at',
        'notes',
        'line_items',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'issued_at' => 'datetime',
        'due_at' => 'datetime',
        'paid_at' => 'datetime',
        'line_items' => 'json',
    ];

    /**
     * العلاقة مع الاشتراك
     */
    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }

    /**
     * العلاقة مع الدفع
     */
    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    /**
     * التحقق من دفع الفاتورة
     */
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * التحقق من تأخر الفاتورة
     */
    public function isOverdue(): bool
    {
        return $this->status === 'overdue' || ($this->due_at < now() && !$this->isPaid());
    }

    /**
     * وضع علامة على الفاتورة كمدفوعة
     */
    public function markAsPaid(): void
    {
        $this->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);
    }

    /**
     * قدم الفاتورة (إرسالها للعميل)
     */
    public function send(): void
    {
        $this->update([
            'status' => 'sent',
        ]);
    }

    /**
     * إلغاء الفاتورة
     */
    public function cancel(): void
    {
        $this->update([
            'status' => 'canceled',
        ]);
    }
}
