<?php

use Illuminate\Support\Facades\Route;
use Modules\Tenants\Http\Controllers\TenantsController;
use Modules\Tenants\Http\Controllers\TenantBrandingController;

Route::get('tenants', [TenantsController::class, 'index'])->name('tenants.public');

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::apiResource('tenants', TenantsController::class)->names('tenants');
    Route::post('tenant/branding', [TenantBrandingController::class, 'update']);
    Route::get('tenant/branding', [TenantBrandingController::class, 'show']);
    Route::get('tenant/billing', [\Modules\Tenants\Http\Controllers\TenantBillingController::class, 'show']);
    Route::post('tenant/billing', [\Modules\Tenants\Http\Controllers\TenantBillingController::class, 'update']);
});
