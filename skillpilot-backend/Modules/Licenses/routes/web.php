<?php

use Illuminate\Support\Facades\Route;
use Modules\Licenses\Http\Controllers\LicensesController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('licenses', LicensesController::class)->names('licenses');
});
