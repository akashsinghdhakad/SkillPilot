<?php

namespace Modules\Payments\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'transaction_id',
        'amount',
        'payment_method',
        'status',
        'payload',
    ];

    protected $casts = [
        'payload' => 'json',
    ];

    public function order()
    {
        return $this->belongsTo(\Modules\Orders\Models\Order::class);
    }
}
