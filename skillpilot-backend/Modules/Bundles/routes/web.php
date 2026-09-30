<?php

use Illuminate\Support\Facades\Route;
use Modules\Bundles\Http\Controllers\BundlesController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('bundles', BundlesController::class)->names('bundles');
});
