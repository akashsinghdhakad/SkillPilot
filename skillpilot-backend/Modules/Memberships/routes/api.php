<?php

use Illuminate\Support\Facades\Route;
use Modules\Memberships\Http\Controllers\MembershipsController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::get('memberships/plans', [MembershipsController::class, 'index']);
    Route::get('memberships/status', [MembershipsController::class, 'status']);
    Route::apiResource('memberships', MembershipsController::class)->names('memberships');
});
