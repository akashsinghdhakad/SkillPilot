<?php

use Illuminate\Support\Facades\Route;
use Modules\Certificates\Http\Controllers\CertificatesController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('certificates', CertificatesController::class)->names('certificates');
});
