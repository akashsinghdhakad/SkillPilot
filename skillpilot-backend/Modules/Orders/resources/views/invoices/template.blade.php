<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice #{{ $order->invoice_number ?? $order->id }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
            color: #334155;
            line-height: 1.5;
            margin: 0;
            padding: 40px;
        }
        .header {
            margin-bottom: 50px;
        }
        .logo {
            max-height: 50px;
            margin-bottom: 20px;
        }
        .company-info {
            float: right;
            text-align: right;
            font-size: 12px;
            color: #64748b;
        }
        .bill-to {
            margin-bottom: 50px;
        }
        .bill-to h3 {
            margin: 0 0 10px 0;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #94a3b8;
        }
        .bill-to p {
            margin: 0;
            font-weight: bold;
            font-size: 16px;
        }
        .invoice-details {
            margin-bottom: 50px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .table th {
            text-align: left;
            border-bottom: 2px solid #f1f5f9;
            padding: 12px 0;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #94a3b8;
        }
        .table td {
            padding: 15px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
        }
        .total-section {
            margin-top: 30px;
            float: right;
            width: 250px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
        }
        .grand-total {
            font-size: 24px;
            font-weight: 800;
            color: {{ $color }};
            border-top: 2px solid {{ $color }};
            margin-top: 10px;
            padding-top: 10px;
        }
        .footer {
            position: absolute;
            bottom: 40px;
            left: 40px;
            right: 40px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            padding-top: 20px;
        }
        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            background: #f1f5f9;
            color: #475569;
        }
        .badge-paid {
            background: #ecfdf5;
            color: #059669;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-info">
            <h2 style="margin: 0; color: {{ $color }};">{{ $tenant->name }}</h2>
            <p style="white-space: pre-line;">{{ $tenant->billing_address }}</p>
            @if($tenant->tax_id)
                <p>Tax ID: {{ $tenant->tax_id }}</p>
            @endif
            @if($tenant->support_email)
                <p>{{ $tenant->support_email }}</p>
            @endif
        </div>
        @if($logo)
            <img src="{{ $logo }}" class="logo">
        @else
            <div class="logo">
                <span style="font-size: 24px; font-weight: 900; color: {{ $color }};">SkillPilot</span>
            </div>
        @endif
    </div>

    <div class="invoice-details">
        <h1 style="margin: 0; font-size: 32px; font-weight: 900; letter-spacing: -1px;">Receipt</h1>
        <p style="margin: 5px 0 0 0; color: #94a3b8;">
            No. #{{ $order->invoice_number ?? str_pad($order->id, 6, '0', STR_PAD_LEFT) }} &bull; {{ $order->created_at->format('F d, Y') }}
        </p>
        <div style="margin-top: 15px;">
            <span class="badge {{ $order->payment_status === 'paid' ? 'badge-paid' : '' }}">
                {{ strtoupper($order->payment_status) }}
            </span>
        </div>
    </div>

    <div class="bill-to">
        <h3>Customer</h3>
        <p>{{ $order->user->name }}</p>
        <p style="font-size: 14px; font-weight: normal; color: #64748b;">{{ $order->user->email }}</p>
    </div>

    <table class="table">
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align: right;">Price</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>
                    <div style="font-weight: bold;">{{ $item->itemable->title ?? $item->itemable->name }}</div>
                    <div style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">{{ str_replace('Modules\\', '', $item->itemable_type) }}</div>
                </td>
                <td style="text-align: right; font-weight: bold;">${{ number_format($item->price, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total-section">
        <div style="text-align: right;">
            <div style="font-size: 12px; color: #94a3b8; margin-bottom: 5px;">Total Amount Due</div>
            <div class="grand-total">${{ number_format($order->total_amount, 2) }} USD</div>
        </div>
    </div>

    <div class="footer">
        <p>This is a computer-generated document. No signature is required.</p>
        <p>&copy; {{ date('Y') }} {{ $tenant->name }}. All rights reserved.</p>
    </div>
</body>
</html>
