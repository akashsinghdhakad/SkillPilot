<?php

use Illuminate\Support\Facades\Route;
use Modules\Memberships\Http\Controllers\MembershipsController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('memberships', MembershipsController::class)->names('memberships');
});
