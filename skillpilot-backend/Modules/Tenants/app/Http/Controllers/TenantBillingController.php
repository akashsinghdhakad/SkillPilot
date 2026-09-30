<?php

namespace Modules\Tenants\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Tenants\Models\Tenant;
use Illuminate\Support\Facades\Validator;

class TenantBillingController extends Controller
{
    /**
     * Display the current tenant billing info.
     */
    public function show(Request $request)
    {
        $tenant = Tenant::findOrFail($request->user()->tenant_id);
        
        return response()->json([
            'support_email'   => $tenant->support_email,
            'billing_address' => $tenant->billing_address,
            'tax_id'          => $tenant->tax_id,
        ]);
    }

    /**
     * Update the tenant billing info.
     */
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'support_email'   => ['nullable', 'email', 'max:255'],
            'billing_address' => ['nullable', 'string', 'max:1000'],
            'tax_id'          => ['nullable', 'string', 'max:50'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tenant = Tenant::findOrFail($request->user()->tenant_id);
        
        $tenant->update($request->only([
            'support_email',
            'billing_address',
            'tax_id'
        ]));

        return response()->json([
            'message' => 'Billing information updated successfully',
            'data'    => $tenant->only(['support_email', 'billing_address', 'tax_id'])
        ]);
    }
}
