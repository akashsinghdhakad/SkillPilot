<?php

use Illuminate\Support\Facades\Route;
use Modules\Progress\Http\Controllers\ProgressController;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::get('progress/{courseId}', [ProgressController::class, 'show']);
    Route::post('progress/complete', [ProgressController::class, 'complete']);
});
