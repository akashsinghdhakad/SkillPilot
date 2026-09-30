<?php

namespace Modules\Orders\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Orders\Models\Order;
use Modules\Orders\Services\InvoiceService;
use Illuminate\Support\Facades\Gate;

class OrderDownloadController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    /**
     * Download the PDF invoice for an order.
     */
    public function download(Request $request, $orderId)
    {
        $order = Order::findOrFail($orderId);

        // Security check: Only the owner or an admin can download
        if ($request->user()->id !== $order->user_id && !$request->user()->hasRole('admin')) {
            abort(403, 'Unauthorized access to this invoice.');
        }

        // Only generate for paid or completed orders (optional policy)
        // if ($order->payment_status !== 'paid') {
        //    abort(400, 'Invoice is only available for paid orders.');
        // }

        $pdf = $this->invoiceService->generate($order);

        return $pdf->download("invoice-{$order->id}.pdf");
    }
}
