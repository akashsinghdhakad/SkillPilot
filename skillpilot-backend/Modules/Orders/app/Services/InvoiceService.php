<?php

namespace Modules\Orders\Services;

use Barryvdh\DomPDF\Facade\Pdf;
use Modules\Orders\Models\Order;
use Modules\Tenants\Models\Tenant;

class InvoiceService
{
    /**
     * Generate a PDF invoice for a given order.
     */
    public function generate(Order $order)
    {
        $tenant = Tenant::findOrFail($order->tenant_id);
        $order->load(['items.itemable', 'user']);

        $data = [
            'order'  => $order,
            'tenant' => $tenant,
            'color'  => $tenant->brand_color ?? '#0f172a',
            'logo'   => $tenant->certificate_logo_url,
        ];

        return Pdf::loadView('orders::invoices.template', $data)
            ->setPaper('a4', 'portrait')
            ->setWarnings(false);
    }
}
