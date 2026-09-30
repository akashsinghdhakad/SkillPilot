<?php

use Illuminate\Support\Facades\Route;
use Modules\Orders\Http\Controllers\OrderController;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    // Admin Routes
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('orders', [\Modules\Orders\Http\Controllers\OrdersController::class, 'index']);
        Route::get('orders/{id}', [\Modules\Orders\Http\Controllers\OrdersController::class, 'show']);
        Route::patch('orders/{id}', [\Modules\Orders\Http\Controllers\OrdersController::class, 'update']);
    });

    // Student Routes
    Route::get('orders', [OrderController::class, 'index']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{order}', [OrderController::class, 'show']);
    Route::get('orders/{order}/invoice', [\Modules\Orders\Http\Controllers\OrderDownloadController::class, 'download']);
});
