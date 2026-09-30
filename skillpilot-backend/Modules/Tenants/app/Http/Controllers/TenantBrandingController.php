<?php

namespace Modules\Tenants\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Modules\Tenants\Models\Tenant;

class TenantBrandingController extends Controller
{
    /**
     * Display the current tenant branding.
     */
    public function show(Request $request)
    {
        $tenant = Tenant::findOrFail($request->user()->tenant_id);
        
        return response()->json([
            'name' => $tenant->name,
            'logo_url' => $tenant->certificate_logo_url,
            'signature_url' => $tenant->certificate_signature_url,
            'brand_color' => $tenant->brand_color,
        ]);
    }

    /**
     * Update the tenant branding.
     */
    public function update(Request $request)
    {
        $validator = \Validator::make($request->all(), [
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'signature' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'brand_color' => ['nullable', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
        ]);

        if ($validator->fails()) {
            \Log::error("Branding validation failed: ", $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $tenant = Tenant::findOrFail($request->user()->tenant_id);

        try {
            if ($request->hasFile('logo')) {
                if ($tenant->certificate_logo_path) {
                    Storage::disk('public')->delete($tenant->certificate_logo_path);
                }
                $path = $request->file('logo')->store('branding/logos', 'public');
                $tenant->certificate_logo_path = $path;
            }

            if ($request->hasFile('signature')) {
                if ($tenant->certificate_signature_path) {
                    Storage::disk('public')->delete($tenant->certificate_signature_path);
                }
                $path = $request->file('signature')->store('branding/signatures', 'public');
                $tenant->certificate_signature_path = $path;
            }

            if ($request->has('brand_color')) {
                $tenant->brand_color = $request->brand_color;
            }

            $tenant->save();
        } catch (\Exception $e) {
            \Log::error("Branding update failed: " . $e->getMessage());
            return response()->json(['message' => 'Failed to save branding assets'], 500);
        }

        return response()->json([
            'message' => 'Branding updated successfully',
            'logo_url' => $tenant->certificate_logo_url,
            'signature_url' => $tenant->certificate_signature_url,
            'brand_color' => $tenant->brand_color,
        ]);
    }
}
