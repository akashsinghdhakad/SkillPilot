<?php

use Illuminate\Support\Facades\Route;
use Modules\Certificates\Http\Controllers\CertificateController;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::get('certificates', [CertificateController::class, 'index']);
    Route::get('certificates/{certificate}', [CertificateController::class, 'show']);
    Route::post('certificates/issue', [CertificateController::class, 'issue']);
    Route::get('certificates/{certificate}/download', [CertificateController::class, 'download']);
    Route::post('certificates/preview', [CertificateController::class, 'preview']);
});
