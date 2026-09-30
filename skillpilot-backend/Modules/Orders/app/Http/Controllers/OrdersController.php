<?php

namespace Modules\Orders\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Orders\Models\Order;

class OrdersController extends Controller
{
    /**
     * Display a listing of all orders for the current tenant.
     */
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items.itemable'])
            ->orderBy('created_at', 'desc');

        // Search by user name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->filled('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }

        $orders = $query->paginate($request->get('per_page', 15));

        return response()->json($orders);
    }

    /**
     * Display the specified order.
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.itemable', 'payment'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update order status manually (e.g. mark as completed).
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,completed,cancelled,failed',
            'payment_status' => 'required|in:unpaid,paid,failed,refunded',
        ]);

        $order = Order::findOrFail($id);
        $order->update($request->only(['status', 'payment_status']));

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }
}
