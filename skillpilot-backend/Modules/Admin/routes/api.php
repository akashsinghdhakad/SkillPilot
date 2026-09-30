<?php

use Illuminate\Support\Facades\Route;
use Modules\Admin\Http\Controllers\AdminController;
use Modules\Admin\Http\Controllers\DashboardController;

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('v1/admin')->group(function () {
    Route::get('stats', [AdminController::class, 'getStats']);
    Route::get('dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('dashboard/revenue', [DashboardController::class, 'getRevenueChart']);
    Route::get('dashboard/performance', [DashboardController::class, 'getCoursePerformance']);
    Route::get('tenants', [AdminController::class, 'getTenants']);
    Route::get('users', [AdminController::class, 'getUsers']);
    Route::get('courses', [AdminController::class, 'getCourses']);
    Route::post('tenants/{tenant}/toggle-status', [AdminController::class, 'toggleTenantStatus']);
});
