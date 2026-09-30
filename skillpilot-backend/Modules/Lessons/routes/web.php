<?php

use Illuminate\Support\Facades\Route;
use Modules\Lessons\Http\Controllers\LessonsController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('lessons', LessonsController::class)->names('lessons');
});
