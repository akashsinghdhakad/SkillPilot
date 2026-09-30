<?php

namespace Modules\Payments\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Payments\Models\Payment;
use Modules\Orders\Models\Order;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    /**
     * Mock payment processing (simulation).
     */
    public function process(Request $request)
    {
        $request->validate([
            'order_id'       => 'required|exists:orders,id',
            'payment_method' => 'required|in:stripe,paypal,bank_transfer',
        ]);

        $order = Order::findOrFail($request->order_id);

        if ($order->payment_status === 'paid') {
            return response()->json(['message' => 'Order already paid.'], 422);
        }

        // Simulate successful payment
        $payment = Payment::create([
            'order_id'       => $order->id,
            'transaction_id' => 'TXN-' . strtoupper(Str::random(12)),
            'amount'         => $order->total_amount,
            'payment_method' => $request->payment_method,
            'status'         => 'successful',
            'payload'        => ['mock' => true, 'timestamp' => now()],
        ]);

        $order->update([
            'status'         => 'completed',
            'payment_status' => 'paid',
        ]);

        return response()->json([
            'message' => 'Payment successful.',
            'payment' => $payment
        ]);
    }
}
