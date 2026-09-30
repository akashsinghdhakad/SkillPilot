<?php

use Illuminate\Support\Facades\Route;
use Modules\Payments\Http\Controllers\PaymentController;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::post('payments/process', [PaymentController::class, 'process']);
    Route::post('payments/stripe/session', [StripeController::class, 'createSession']);
});

// Webhook must be outside auth middleware
Route::post('payments/stripe/webhook', [StripeController::class, 'webhook']);
