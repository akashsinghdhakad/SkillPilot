<?php

namespace Modules\Licenses\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Licenses\Models\License;

class LicenseController extends Controller
{
    /**
     * Get the active license for the current tenant.
     */
    public function index(Request $request)
    {
        $license = License::with('package')
            ->where('tenant_id', $request->user()->tenant_id)
            ->where('status', 'active')
            ->orderBy('expires_at', 'desc')
            ->first();

        return response()->json($license);
    }
}
