<?php

use Illuminate\Support\Facades\Route;
use Modules\Licenses\Http\Controllers\LicenseController;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::get('licenses/current', [LicenseController::class, 'index']);
});
