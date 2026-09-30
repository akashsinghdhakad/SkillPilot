<?php

namespace Modules\Orders\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Orders\Models\Order;
use Modules\Orders\Models\OrderItem;
use Modules\Courses\Models\Course;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * List user orders.
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.itemable')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Create a new order (Checkout).
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required',
            'items.*.type' => 'required|in:course,bundle,membership_plan',
        ]);

        return DB::transaction(function () use ($request) {
            $totalAmount = 0;
            $itemsToCreate = [];

            foreach ($request->items as $itemData) {
                $modelClass = $this->resolveModelClass($itemData['type']);
                $itemModel = $modelClass::findOrFail($itemData['id']);
                
                $totalAmount += $itemModel->price;
                $itemsToCreate[] = [
                    'itemable_id'   => $itemModel->id,
                    'itemable_type' => $modelClass,
                    'price'         => $itemModel->price,
                ];
            }

            $order = Order::create([
                'tenant_id'      => $request->user()->tenant_id,
                'user_id'        => $request->user()->id,
                'total_amount'   => $totalAmount,
                'status'         => 'pending',
                'payment_status' => 'unpaid',
            ]);

            foreach ($itemsToCreate as $item) {
                $order->items()->create($item);
            }

            return response()->json($order->load('items.itemable'), 201);
        });
    }

    /**
     * Resolve model class from type string.
     */
    private function resolveModelClass($type)
    {
        return match($type) {
            'course' => \Modules\Courses\Models\Course::class,
            'bundle' => \Modules\Bundles\Models\Bundle::class,
            'membership_plan' => \Modules\Memberships\Models\MembershipPlan::class,
            default  => throw new \Exception("Unsupported item type: {$type}"),
        };
    }

    /**
     * Show order details.
     */
    public function show($id)
    {
        $order = Order::with('items.itemable', 'payment')->findOrFail($id);
        return response()->json($order);
    }
}
