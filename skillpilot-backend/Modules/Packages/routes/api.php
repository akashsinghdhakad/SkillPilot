<?php

use Illuminate\Support\Facades\Route;
use Modules\Packages\Http\Controllers\PackageController;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('packages', [PackageController::class, 'index']);
});
