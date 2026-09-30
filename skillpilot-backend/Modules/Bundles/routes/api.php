<?php

use Illuminate\Support\Facades\Route;
use Modules\Bundles\Http\Controllers\BundlesController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::get('bundles/owned', [BundlesController::class, 'owned']);
    Route::apiResource('bundles', BundlesController::class)->names('bundles');
});
